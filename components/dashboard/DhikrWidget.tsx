import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebaseConfig';

export default function DhikrWidget() {
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Fetching today's counts
          const date = new Date().toISOString().split('T')[0];
          const docRef = doc(db, 'users', user.uid, 'dhikr_counts', date);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            const total = Object.values(data).reduce((a: any, b: any) => a + b, 0) as number;
            setTotalCount(total);
          }
        } catch (error) {
          console.error('Error fetching dhikr counts:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
