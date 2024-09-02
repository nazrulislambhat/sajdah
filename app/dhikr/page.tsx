'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  deleteField,
  writeBatch,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from 'firebase/auth';
import { Plus, Trash2, Save, Download } from 'lucide-react';

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
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

interface DhikrCount {
  [key: string]: number;
}

interface VisibleDhikrs {
  [key: string]: boolean;
}

const defaultDhikrs = [
  'Allahu Akbar',
  'Astagfirullah',
  'Subhanallah',
  'Hasbi Allah',
];

const saveDhikrCounts = async (
  userId: string,
  date: string,
  counts: DhikrCount
) => {
  const docRef = doc(db, 'users', userId, 'dhikr_counts', date);
  await setDoc(docRef, counts, { merge: true });
};

const getDhikrCounts = async (userId: string, date: string) => {
  const docRef = doc(db, 'users', userId, 'dhikr_counts', date);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as DhikrCount) : {};
};

const saveVisibleDhikrs = async (
  userId: string,
  visibleDhikrs: VisibleDhikrs
) => {
  const docRef = doc(db, 'users', userId, 'settings', 'visible_dhikrs');
  await setDoc(docRef, visibleDhikrs);
};

const getVisibleDhikrs = async (userId: string) => {
  const docRef = doc(db, 'users', userId, 'settings', 'visible_dhikrs');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as VisibleDhikrs) : {};
};

const getAllDhikrs = async (userId: string) => {
  const querySnapshot = await getDocs(
    collection(db, 'users', userId, 'dhikr_counts')
  );
  const allDhikrs: Set<string> = new Set();
  querySnapshot.forEach((doc) => {
    Object.keys(doc.data()).forEach((dhikr) => allDhikrs.add(dhikr));
  });
  return Array.from(allDhikrs);
};

const removeDhikrFromDatabase = async (userId: string, dhikr: string) => {
  const querySnapshot = await getDocs(
    collection(db, 'users', userId, 'dhikr_counts')
  );
  const batch = writeBatch(db);
  querySnapshot.forEach((doc) => {
    if (doc.data()[dhikr] !== undefined) {
      batch.update(doc.ref, { [dhikr]: deleteField() });
    }
  });
  await batch.commit();
};

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export default function DhikrCounter() {
  const [counts, setCounts] = useState<DhikrCount>({});
  const [visibleDhikrs, setVisibleDhikrs] = useState<VisibleDhikrs>({});
  const [newDhikr, setNewDhikr] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [user, setUser] = useState<User | null>(null);
  const [allDhikrs, setAllDhikrs] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchData(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchData(user.uid);
    }
  }, [date, user]);

  const fetchData = async (userId: string) => {
    const savedCounts = await getDhikrCounts(userId, formatDate(date));
    setCounts(savedCounts);
    const savedVisibleDhikrs = await getVisibleDhikrs(userId);
    const allUserDhikrs = await getAllDhikrs(userId);
    setAllDhikrs(allUserDhikrs);
    const mergedVisibleDhikrs = { ...savedVisibleDhikrs };
    defaultDhikrs.concat(allUserDhikrs).forEach((dhikr) => {
      if (!(dhikr in mergedVisibleDhikrs)) {
        mergedVisibleDhikrs[dhikr] = true;
      }
    });
    setVisibleDhikrs(mergedVisibleDhikrs);
    saveVisibleDhikrs(userId, mergedVisibleDhikrs);
  };

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      fetchData(result.user.uid);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setCounts({});
      setVisibleDhikrs({});
      setAllDhikrs([]);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const incrementCount = (dhikr: string) => {
    if (user) {
      setCounts((prevCounts) => ({
        ...prevCounts,
        [dhikr]: (prevCounts[dhikr] || 0) + 1,
      }));
    }
  };

  const resetCount = (dhikr: string) => {
    if (user) {
      setCounts((prevCounts) => ({
        ...prevCounts,
        [dhikr]: 0,
      }));
    }
  };

  const saveAllDhikrs = async () => {
    if (user) {
      await saveDhikrCounts(user.uid, formatDate(date), counts);
    }
  };

  const addNewDhikr = () => {
    if (newDhikr && !counts.hasOwnProperty(newDhikr) && user) {
      setCounts((prevCounts) => ({ ...prevCounts, [newDhikr]: 0 }));
      setVisibleDhikrs((prevVisible) => ({ ...prevVisible, [newDhikr]: true }));
      setAllDhikrs((prevAll) => [...prevAll, newDhikr]);
      saveVisibleDhikrs(user.uid, { ...visibleDhikrs, [newDhikr]: true });
      setNewDhikr('');
    }
  };

  const removeDhikr = async (dhikr: string) => {
    if (user) {
      await removeDhikrFromDatabase(user.uid, dhikr);
      setVisibleDhikrs((prevVisible) => {
        const newVisible = { ...prevVisible };
        delete newVisible[dhikr];
        saveVisibleDhikrs(user.uid, newVisible);
        return newVisible;
      });
      setCounts((prevCounts) => {
        const newCounts = { ...prevCounts };
        delete newCounts[dhikr];
        return newCounts;
      });
      setAllDhikrs((prevAll) => prevAll.filter((d) => d !== dhikr));
    }
  };

  const fetchAllEntries = async () => {
    if (user) {
      const allDhikrs = await getAllDhikrs(user.uid);
      setAllDhikrs(allDhikrs);
      const newVisibleDhikrs: VisibleDhikrs = {};
      allDhikrs.forEach((dhikr) => {
        newVisibleDhikrs[dhikr] = true;
      });
      setVisibleDhikrs(newVisibleDhikrs);
      saveVisibleDhikrs(user.uid, newVisibleDhikrs);
    }
  };

  const DhikrChart = () => {
    const sortedDhikrs = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .filter(([dhikr]) => visibleDhikrs[dhikr])
      .slice(0, 5);

    const maxCount = Math.max(...sortedDhikrs.map(([, count]) => count), 1);

    return (
      <div className="space-y-2">
        {sortedDhikrs.map(([dhikr, count]) => (
          <div key={dhikr} className="flex items-center space-x-2">
            <div className="w-24 truncate">{dhikr}</div>
            <div className="flex-1 h-4  rounded-full overflow-hidden">
              <div
                className="h-full bg-colorGreen border-2 rounded-full"
                style={{ width: `${(count / maxCount) * 20}%` }}
              />
            </div>
            <div className="w-8 text-right">{count}</div>
          </div>
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <button
          onClick={signIn}
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
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4  text-colorBlue min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dhikr Counter</h1>
        <Button onClick={signOut} className="bg-[#F22B29] hover:">
          Sign Out
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {allDhikrs.concat(defaultDhikrs).map(
          (dhikr) =>
            visibleDhikrs[dhikr] && (
              <Card key={dhikr} className=" text-colorBlue ">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{dhikr}</CardTitle>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#F22B29] hover:text-[#2D936C]"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove {dhikr}</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className=" text-colorBlue ">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-colorPurple">
                          This will remove the dhikr card and delete all
                          associated data from the database. This action cannot
                          be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className=" text-colorBlue hover:">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeDhikr(dhikr)}
                          className="bg-[#F22B29] hover:"
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{counts[dhikr] || 0}</div>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      onClick={() => incrementCount(dhikr)}
                      className=" hover:bg-[#F22B29]"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase {dhikr} count</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => resetCount(dhikr)}
                      className="text-[#2D936C] hover: hover:text-colorBlue"
                    >
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
        )}
      </div>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={saveAllDhikrs} className=" hover:bg-colorRed">
          <Save className="h-4 w-4 mr-2" />
          Save All Dhikrs
        </Button>
        <Button onClick={fetchAllEntries} className="hover:bg-colorGreen">
          <Download className="h-4 w-4 mr-2 " />
          Fetch All Entries
        </Button>
      </div>
      <Card className="mb-4  text-colorBlue ">
        <CardHeader>
          <CardTitle>Add New Dhikr</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              value={newDhikr}
              onChange={(e) => setNewDhikr(e.target.value)}
              placeholder="Enter new dhikr"
              className=" text-colorBlue placeholder-gray-400 "
            />
            <Button onClick={addNewDhikr} className=" hover:bg-[#F22B29]">
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className=" text-colorBlue ">
          <CardHeader>
            <CardTitle>Daily Dhikr Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md "
              classNames={{
                day_selected: 'hover:bg-colorRed',
                day_today: 'bg-colorRed rounded text-white  !rounded-full',
              }}
            />
          </CardContent>
        </Card>
        <Card className=" text-colorBlue ">
          <CardHeader>
            <CardTitle>Dhikr Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <DhikrChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
