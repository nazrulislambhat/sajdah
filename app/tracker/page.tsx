'use client';
import { useState, useEffect } from 'react';
import { CalendarIcon, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
  GithubAuthProvider,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import Confetti from 'react-confetti';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { firebaseConfig } from '../../config/firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const prayers = [
  'Fajr',
  'Tahajjud',
  'Chast',
  'Dhuhr',
  'Asr',
  'Maghrib',
  'Isha',
];
const fardPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
type PrayerStatus =
  | 'Not Prayed'
  | 'Prayed On Time'
  | 'Prayed In Jamaat'
  | 'Prayed But Qaza'
  | null;
type PrayerEntry = { date: string; statuses: Record<string, PrayerStatus> };

const statusColors = {
  'Not Prayed': '#F22B29',
  'Prayed On Time': '#3B28CC',
  'Prayed In Jamaat': '#2D936C',
  'Prayed But Qaza': '#360568',
};

export default function Component() {
  const [entries, setEntries] = useState<PrayerEntry[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchEntries(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchEntryForDate(format(currentDate, 'yyyy-MM-dd'));
    }
  }, [currentDate, user]);

  const signIn = async (providerName: any) => {
    setIsSigningIn(true);
    setSignInError(null);
    let provider;
    if (providerName === 'google') {
      provider = new GoogleAuthProvider();
    } else if (providerName === 'github') {
      provider = new GithubAuthProvider();
    } else {
      console.error('Unsupported provider');
      return;
    }

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setSignInError('Failed to sign in. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setEntries([]);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const fetchEntries = async (userId: string) => {
    try {
      const q = query(collection(db, 'entries'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const fetchedEntries: PrayerEntry[] = [];
      querySnapshot.forEach((doc) => {
        fetchedEntries.push(doc.data() as PrayerEntry);
      });
      setEntries(fetchedEntries);
    } catch (error) {
      console.error('Error fetching entries', error);
    }
  };

  const fetchEntryForDate = async (date: string) => {
    if (!user) return;

    try {
      const docRef = doc(db, 'entries', `${user.uid}_${date}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as PrayerEntry;
        setEntries((prev) => {
          const index = prev.findIndex((entry) => entry.date === date);
          if (index !== -1) {
            const newEntries = [...prev];
            newEntries[index] = data;
            return newEntries;
          } else {
            return [...prev, data];
          }
        });
        checkForConfetti(data);
      } else {
        setEntries((prev) => {
          const index = prev.findIndex((entry) => entry.date === date);
          if (index === -1) {
            return [...prev, { date, statuses: {} }];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Error fetching entry for date', error);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
      setIsCalendarOpen(false);
    }
  };

  const handlePrayerStatusChange = (prayer: string, status: PrayerStatus) => {
    setEntries((prev) => {
      const existingEntryIndex = prev.findIndex(
        (entry) => entry.date === format(currentDate, 'yyyy-MM-dd')
      );
      if (existingEntryIndex !== -1) {
        const updatedEntries = [...prev];
        updatedEntries[existingEntryIndex] = {
          ...updatedEntries[existingEntryIndex],
          statuses: {
            ...updatedEntries[existingEntryIndex].statuses,
            [prayer]: status,
          },
        };
        checkForConfetti(updatedEntries[existingEntryIndex]);
        return updatedEntries;
      } else {
        const newEntry = {
          date: format(currentDate, 'yyyy-MM-dd'),
          statuses: { [prayer]: status },
        };
        checkForConfetti(newEntry);
        return [...prev, newEntry];
      }
    });
  };

  const checkForConfetti = (entry: PrayerEntry) => {
    const allFardInJamaat = fardPrayers.every(
      (prayer) => entry.statuses[prayer] === 'Prayed In Jamaat'
    );
    setShowConfetti(allFardInJamaat);
    if (allFardInJamaat) {
      setTimeout(() => setShowConfetti(false), 10000);
    }
  };

  const getStatusColor = (status: PrayerStatus) => {
    switch (status) {
      case 'Not Prayed':
        return 'bg-colorRed text-white';
      case 'Prayed On Time':
        return 'bg-colorBlue text-white';
      case 'Prayed But Qaza':
        return 'bg-colorPurple text-white';
      case 'Prayed In Jamaat':
        return 'bg-colorGreen text-white';
      default:
        return '';
    }
  };

  const getCurrentEntry = () => {
    return (
      entries.find(
        (entry) => entry.date === format(currentDate, 'yyyy-MM-dd')
      ) || { date: format(currentDate, 'yyyy-MM-dd'), statuses: {} }
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    const currentEntry = getCurrentEntry();
    try {
      await setDoc(
        doc(db, 'entries', `${user.uid}_${currentEntry.date}`),
        {
          ...currentEntry,
          userId: user.uid,
        },
        { merge: true }
      );
      setIsSaveDialogOpen(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving entry', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getPieChartData = () => {
    const currentEntry = getCurrentEntry();
    const statusCounts = Object.values(currentEntry.statuses).reduce(
      (acc, status) => {
        if (status) {
          acc[status] = (acc[status] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-2">
        <h1 className="text-2xl font-bold mb-4">Welcome to Prayer Tracker</h1>
        {signInError && <p>{signInError}</p>}
        <button
          onClick={() => signIn('google')}
          disabled={isSigningIn}
          className="flex items-center border-gray-800 border-2 text-gray-800 gap-1 text-xs font-semibold rounded px-4 py-2 bg-white hover:bg-opacity-85"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 48 48"
            >
              <path
                fill="#fbc02d"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#e53935"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4caf50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1565c0"
                d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
          </span>
          Sign in with Google
        </button>
        <button
          onClick={() => signIn('github')}
          disabled={isSigningIn}
          className="flex items-center border-2 border-gray-800 text-white gap-1 text-xs font-semibold rounded px-4 py-2 bg-gray-800 hover:bg-opacity-85"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="30"
            height="30"
            viewBox="0 0 72 72"
            className="fill-white"
          >
            <path d="M 36 12 C 22.745 12 12 22.745 12 36 C 12 49.255 22.745 60 36 60 C 49.255 60 60 49.255 60 36 C 60 22.745 49.255 12 36 12 z M 36 20 C 44.837 20 52 27.163 52 36 C 52 43.284178 47.128298 49.420174 40.46875 51.355469 C 40.198559 51.103128 39.941627 50.74363 39.953125 50.285156 C 39.980125 49.233156 39.953125 46.778953 39.953125 45.876953 C 39.953125 44.328953 38.972656 43.230469 38.972656 43.230469 C 38.972656 43.230469 46.654297 43.316141 46.654297 35.119141 C 46.654297 31.957141 45.003906 30.310547 45.003906 30.310547 C 45.003906 30.310547 45.872125 26.933953 44.703125 25.501953 C 43.393125 25.359953 41.046922 26.753297 40.044922 27.404297 C 40.044922 27.404297 38.457406 26.753906 35.816406 26.753906 C 33.175406 26.753906 31.587891 27.404297 31.587891 27.404297 C 30.586891 26.753297 28.239687 25.360953 26.929688 25.501953 C 25.760688 26.933953 26.628906 30.310547 26.628906 30.310547 C 26.628906 30.310547 24.974609 31.956141 24.974609 35.119141 C 24.974609 43.316141 32.65625 43.230469 32.65625 43.230469 C 32.65625 43.230469 31.782197 44.226723 31.693359 45.652344 C 31.180078 45.833418 30.48023 46.048828 29.8125 46.048828 C 28.2025 46.048828 26.978297 44.483766 26.529297 43.759766 C 26.086297 43.045766 25.178031 42.447266 24.332031 42.447266 C 23.775031 42.447266 23.503906 42.726922 23.503906 43.044922 C 23.503906 43.362922 24.285781 43.585781 24.800781 44.175781 C 25.887781 45.420781 25.866281 48.21875 29.738281 48.21875 C 30.196553 48.21875 31.021102 48.11542 31.677734 48.025391 C 31.674106 48.90409 31.663893 49.74536 31.677734 50.285156 C 31.688158 50.700354 31.476914 51.032045 31.236328 51.279297 C 24.726159 49.25177 20 43.177886 20 36 C 20 27.163 27.163 20 36 20 z"></path>
          </svg>
          Sign in with GitHub
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      {showConfetti && <Confetti />}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Daily Prayer Tracker</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.photoURL || undefined}
                  alt={user.displayName || 'User avatar'}
                />
                <AvatarFallback>
                  {user.displayName ? user.displayName[0] : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.displayName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {}}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {showSaveSuccess && (
        <Alert className="mb-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your prayer entry has been saved successfully.
          </AlertDescription>
        </Alert>
      )}
      {showConfetti && (
        <Alert className="mb-4 bg-green-100 border-green-400 text-green-700">
          <AlertTitle>Congratulations!</AlertTitle>
          <AlertDescription>
            All your Fard prayers for{' '}
            <span className="font-bold">{format(currentDate, 'PPP')}</span> have
            been prayed in <span className="font-bold">Jamaat</span>.
          </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Prayer Entry - {format(currentDate, 'PPP')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="date-select"
              >
                Date
              </label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="date-select"
                    variant={'outline'}
                    className={cn('w-full justify-start text-left font-normal')}
                    onClick={() => setIsCalendarOpen(true)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(currentDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={currentDate}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {prayers.map((prayer) => (
              <div key={prayer}>
                <label
                  htmlFor={prayer}
                  className="block text-sm font-medium mb-1"
                >
                  {prayer}
                </label>
                <Select
                  value={getCurrentEntry().statuses[prayer] || ''}
                  onValueChange={(value) =>
                    handlePrayerStatusChange(prayer, value as PrayerStatus)
                  }
                >
                  <SelectTrigger
                    id={prayer}
                    className={cn(
                      getStatusColor(getCurrentEntry().statuses[prayer])
                    )}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Prayed">Not Prayed</SelectItem>
                    <SelectItem value="Prayed On Time">
                      Prayed On Time
                    </SelectItem>
                    {prayer !== 'Tahajjud' && prayer !== 'Chast' && (
                      <>
                        <SelectItem value="Prayed In Jamaat">
                          Prayed In Jamaat
                        </SelectItem>
                        <SelectItem value="Prayed But Qaza">
                          Prayed But Qaza
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <div className="mt-8 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart className="text-xs rounded border-2">
                <Pie
                  data={getPieChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={50}
                  innerRadius={25}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {getPieChartData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        statusColors[entry.name as keyof typeof statusColors]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4">Save Entry</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Prayer Entry</DialogTitle>
              <DialogDescription>
                Are you sure you want to save this prayer entry?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsSaveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
