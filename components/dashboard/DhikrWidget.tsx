import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebaseConfig';

export default function DhikrWidget() {
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const date = new Date().toISOString().split('T')[0];
      
      // 1. Try Local Storage first (Instant)
      const localCounts = JSON.parse(localStorage.getItem(`dhikr_counts_${date}`) || '{}');
      const localTotal = Object.values(localCounts).reduce((a: any, b: any) => a + b, 0) as number;
      setTotalCount(localTotal);
      setLoading(false);

      // 2. If logged in, fetch from Cloud and update if needed
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid, 'dhikr_counts', date);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            const cloudTotal = Object.values(data).reduce((a: any, b: any) => a + b, 0) as number;
            // If cloud has more, update UI (and maybe local? Page handles sync usually)
            if (cloudTotal > localTotal) {
               setTotalCount(cloudTotal);
            }
          }
        } catch (error) {
          console.error('Error fetching dhikr counts:', error);
        }
      }
    };

    fetchCounts();

    // Listen for local storage changes (e.g. from Dhikr page in another tab)
    const handleStorageChange = () => {
      fetchCounts();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab updates if needed
    window.addEventListener('dhikr-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dhikr-updated', handleStorageChange);
    };
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div className="text-center space-y-2">
      <div className="text-4xl font-bold text-[#EF6C00]">{totalCount}</div>
      <p className="text-sm text-gray-600">Dhikr Today</p>
      {!auth.currentUser && (
        <p className="text-xs text-gray-400 mt-2">Sign in to track</p>
      )}
    </div>
  );
}
