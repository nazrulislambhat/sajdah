'use client';
import { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
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
  User,
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

const firebaseConfig = {
  apiKey: 'AIzaSyAErADCm3oV3mZft9DlLo69H1kbwUXxuYc',
  authDomain: 'prayertracker-1e48e.firebaseapp.com',
  projectId: 'prayertracker-1e48e',
  storageBucket: 'prayertracker-1e48e.appspot.com',
  messagingSenderId: '1085385987618',
  appId: '1:1085385987618:web:5b51af94a37e6e1bcb1c7b',
  measurementId: 'G-V087D89QKG',
};

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
  const [user, setUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const signIn = async () => {
    setIsSigningIn(true);
    setSignInError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
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
        return updatedEntries;
      } else {
        return [
          ...prev,
          {
            date: format(currentDate, 'yyyy-MM-dd'),
            statuses: { [prayer]: status },
          },
        ];
      }
    });
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Welcome to Prayer Tracker</h1>
        <Button onClick={signIn} disabled={isSigningIn}>
          {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
        </Button>
        {signInError && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{signInError}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Daily Prayer Tracker</h2>
        <Button onClick={signOut} className="text-xs bg-colorRed text-white">
          Sign Out
        </Button>
      </div>
      {showSaveSuccess && (
        <Alert className="mb-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your prayer entry has been saved successfully.
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
                  onValueChange={(value: PrayerStatus) =>
                    handlePrayerStatusChange(prayer, value)
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
                    <SelectItem value="Not Prayed" className="text-colorRed">
                      Not Prayed
                    </SelectItem>
                    <SelectItem
                      value="Prayed On Time"
                      className="text-colorBlue"
                    >
                      Prayed On Time
                    </SelectItem>
                    <SelectItem
                      value="Prayed In Jamaat"
                      className="text-colorGreen"
                    >
                      Prayed In Jamaat
                    </SelectItem>
                    <SelectItem
                      value="Prayed But Qaza"
                      className="text-colorPurple"
                    >
                      Prayed But Qaza
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <div className="mt-8 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
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
