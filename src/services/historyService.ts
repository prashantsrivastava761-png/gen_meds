import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Saves a medicine search result to the user's history in Firestore.
 */
export async function saveSearch(userId: string, type: 'text' | 'image', resultData: any) {
  try {
    const medicineName = resultData.original?.name;
    const composition = resultData.original?.composition;

    const historyData = {
      userId,
      type,
      medicineName: medicineName || 'Unknown Medicine',
      composition: composition || 'Unknown Composition',
      alternativesCount: resultData.alternatives?.length || 0,
      fullResult: resultData,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'searches'), historyData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving search to history:', error);
    throw error;
  }
}

/**
 * Retrieves the last 20 searches for a specific user.
 */
export async function getUserHistory(userId: string) {
  try {
    const historyQuery = query(
      collection(db, 'searches'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const querySnapshot = await getDocs(historyQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user history:', error);
    throw error;
  }
}
