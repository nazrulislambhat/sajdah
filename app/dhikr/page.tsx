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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchData(user.uid);
      } else {
        fetchLocalData();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchData(user.uid);
    } else if (!loading) {
      fetchLocalData();
    }
  }, [date, user, loading]);

  const fetchLocalData = () => {
    const dateStr = formatDate(date);
    const localCounts = JSON.parse(localStorage.getItem(`dhikr_counts_${dateStr}`) || '{}');
    setCounts(localCounts);

    const localVisible = JSON.parse(localStorage.getItem('visible_dhikrs') || '{}');
    const localAll = JSON.parse(localStorage.getItem('all_dhikrs') || '[]');
    
    setAllDhikrs(localAll);
    
    const mergedVisibleDhikrs = { ...localVisible };
    defaultDhikrs.concat(localAll).forEach((dhikr) => {
      if (!(dhikr in mergedVisibleDhikrs)) {
        mergedVisibleDhikrs[dhikr] = true;
      }
    });
    setVisibleDhikrs(mergedVisibleDhikrs);
    localStorage.setItem('visible_dhikrs', JSON.stringify(mergedVisibleDhikrs));
  };

  const fetchData = async (userId: string) => {
    try {
      // 1. Fetch Cloud Data
      const cloudCounts = await getDhikrCounts(userId, formatDate(date));
      const cloudVisible = await getVisibleDhikrs(userId);
      const cloudAll = await getAllDhikrs(userId);

      // 2. Fetch Local Data
      const dateStr = formatDate(date);
      const localCounts = JSON.parse(localStorage.getItem(`dhikr_counts_${dateStr}`) || '{}');
      const localVisible = JSON.parse(localStorage.getItem('visible_dhikrs') || '{}');
      const localAll = JSON.parse(localStorage.getItem('all_dhikrs') || '[]');

      // 3. Merge (Prefer Cloud, but if Cloud is empty/zero and Local has data, use Local? 
      // Or better: Max(Cloud, Local) for counts to prevent data loss if save failed)
      const mergedCounts: DhikrCount = { ...cloudCounts };
      Object.keys(localCounts).forEach(key => {
        if ((localCounts[key] || 0) > (mergedCounts[key] || 0)) {
          mergedCounts[key] = localCounts[key];
        }
      });
      
      // For visible/all, union them
      const mergedAll = Array.from(new Set([...cloudAll, ...localAll, ...defaultDhikrs]));
      const mergedVisible = { ...cloudVisible, ...localVisible };
      mergedAll.forEach(d => {
         if (defaultDhikrs.includes(d)) mergedVisible[d] = true;
      });

      setCounts(mergedCounts);
      setAllDhikrs(mergedAll);
      setVisibleDhikrs(mergedVisible);

      // Sync back to local to ensure consistency
      localStorage.setItem(`dhikr_counts_${dateStr}`, JSON.stringify(mergedCounts));
      localStorage.setItem('visible_dhikrs', JSON.stringify(mergedVisible));
      localStorage.setItem('all_dhikrs', JSON.stringify(mergedAll));

    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
      fetchLocalData();
    }
  };

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      await fetchData(result.user.uid);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      fetchLocalData();
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const updateLocal = (newCounts: DhikrCount, newVisible?: VisibleDhikrs, newAll?: string[]) => {
      localStorage.setItem(`dhikr_counts_${formatDate(date)}`, JSON.stringify(newCounts));
      if (newVisible) localStorage.setItem('visible_dhikrs', JSON.stringify(newVisible));
      if (newAll) localStorage.setItem('all_dhikrs', JSON.stringify(newAll));
      
      // Notify other components
      window.dispatchEvent(new Event('dhikr-updated'));
  };

  const incrementCount = (dhikr: string) => {
    const newCounts = {
      ...counts,
      [dhikr]: (counts[dhikr] || 0) + 1,
    };
    setCounts(newCounts);
    updateLocal(newCounts); // Always save local
  };

  const resetCount = (dhikr: string) => {
    const newCounts = {
      ...counts,
      [dhikr]: 0,
    };
    setCounts(newCounts);
    updateLocal(newCounts); // Always save local
  };

  const saveAllDhikrs = async () => {
    // Always save local first
    updateLocal(counts);

    if (user) {
      try {
        await saveDhikrCounts(user.uid, formatDate(date), counts);
        alert("Saved to cloud successfully.");
      } catch (error) {
        console.error("Error saving to Firestore:", error);
        alert("Cloud save failed (Permissions). Data saved locally.");
      }
    } else {
      alert("Saved locally.");
    }
  };

  const addNewDhikr = async () => {
    if (newDhikr && !counts.hasOwnProperty(newDhikr)) {
      setCounts((prevCounts) => ({ ...prevCounts, [newDhikr]: 0 }));
      const newVisible = { ...visibleDhikrs, [newDhikr]: true };
      setVisibleDhikrs(newVisible);
      const newAll = [...allDhikrs, newDhikr];
      setAllDhikrs(newAll);
      
      // Always save local
      updateLocal({ ...counts, [newDhikr]: 0 }, newVisible, newAll);

      if (user) {
        try {
          await saveVisibleDhikrs(user.uid, newVisible);
        } catch (error) {
           console.error("Error saving new dhikr to cloud:", error);
           // Don't alert here to keep it smooth, just log
        }
      }
      setNewDhikr('');
    }
  };

  const removeDhikr = async (dhikr: string) => {
    const newVisible = { ...visibleDhikrs };
    delete newVisible[dhikr];
    setVisibleDhikrs(newVisible);
    
    const newCounts = { ...counts };
    delete newCounts[dhikr];
    setCounts(newCounts);
    
    const newAll = allDhikrs.filter((d) => d !== dhikr);
    setAllDhikrs(newAll);

    // Always save local
    updateLocal(newCounts, newVisible, newAll);

    if (user) {
      try {
        await removeDhikrFromDatabase(user.uid, dhikr);
        await saveVisibleDhikrs(user.uid, newVisible);
      } catch (error) {
        console.error("Error removing dhikr from cloud:", error);
      }
    }
  };

  const fetchAllEntries = async () => {
    if (user) {
      try {
        const allDhikrs = await getAllDhikrs(user.uid);
        setAllDhikrs(allDhikrs);
        const newVisibleDhikrs: VisibleDhikrs = {};
        allDhikrs.forEach((dhikr) => {
          newVisibleDhikrs[dhikr] = true;
        });
        setVisibleDhikrs(newVisibleDhikrs);
        
        // Update local
        updateLocal(counts, newVisibleDhikrs, allDhikrs);

        await saveVisibleDhikrs(user.uid, newVisibleDhikrs);
      } catch (error) {
        console.error("Error fetching all entries:", error);
      }
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

  return (
    <div className="container mx-auto p-4  text-colorBlue min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dhikr Counter</h1>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm hidden md:inline">Signed in as {user.displayName}</span>
            <Button onClick={signOut} className="bg-[#F22B29] hover:">
              Sign Out
            </Button>
          </div>
        ) : (
          <Button onClick={signIn} className="bg-Primarysajdah hover:bg-opacity-90">
            Sign In to Sync
          </Button>
        )}
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
                          associated data. This action cannot
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
        {user && (
          <Button onClick={fetchAllEntries} className="hover:bg-colorGreen">
            <Download className="h-4 w-4 mr-2 " />
            Fetch All Entries
          </Button>
        )}
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
