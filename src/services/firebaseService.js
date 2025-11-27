import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    orderBy,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase.config';

// Notes Management
export const uploadNote = async (noteData, file) => {
    try {
        if (!storage || !db) {
            return { success: false, error: 'Firebase services not initialized. Please check your configuration.' };
        }

        // Create a timeout promise (15 seconds for upload)
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Upload timed out. Please check your internet connection.')), 15000)
        );

        // Upload file to Firebase Storage
        const uploadTask = async () => {
            const fileRef = ref(storage, `notes/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(fileRef, file);
            const fileUrl = await getDownloadURL(snapshot.ref);

            // Save note metadata to Firestore
            const noteDoc = await addDoc(collection(db, 'notes'), {
                ...noteData,
                fileUrl,
                fileName: file.name,
                fileSize: file.size,
                uploadedAt: new Date().toISOString()
            });

            return { success: true, noteId: noteDoc.id, fileUrl };
        };

        // Race between upload and timeout
        return await Promise.race([uploadTask(), timeoutPromise]);

    } catch (error) {
        console.error('Error uploading note:', error);
        return { success: false, error: error.message };
    }
};

export const getNotes = async (filters = {}) => {
    try {
        let q = collection(db, 'notes');

        if (filters.category) {
            q = query(q, where('category', '==', filters.category));
        }

        if (filters.uploadedBy) {
            q = query(q, where('uploadedBy', '==', filters.uploadedBy));
        }

        q = query(q, orderBy('uploadedAt', 'desc'));

        const querySnapshot = await getDocs(q);
        const notes = [];
        querySnapshot.forEach((doc) => {
            notes.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, notes };
    } catch (error) {
        console.error('Error fetching notes:', error);
        return { success: false, error: error.message, notes: [] };
    }
};

export const deleteNote = async (noteId, fileUrl) => {
    try {
        // Delete from Firestore
        await deleteDoc(doc(db, 'notes', noteId));

        // Delete file from Storage
        if (fileUrl) {
            const fileRef = ref(storage, fileUrl);
            await deleteObject(fileRef);
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting note:', error);
        return { success: false, error: error.message };
    }
};

// Progress Management
export const saveProgress = async (userId, progressData) => {
    try {
        const progressRef = doc(db, 'progress', userId);
        await updateDoc(progressRef, {
            ...progressData,
            lastUpdated: new Date().toISOString()
        }).catch(async () => {
            // If document doesn't exist, create it
            await addDoc(collection(db, 'progress'), {
                userId,
                ...progressData,
                lastUpdated: new Date().toISOString()
            });
        });

        return { success: true };
    } catch (error) {
        console.error('Error saving progress:', error);
        return { success: false, error: error.message };
    }
};

export const getProgress = async (userId) => {
    try {
        const progressDoc = await getDoc(doc(db, 'progress', userId));

        if (progressDoc.exists()) {
            return { success: true, progress: progressDoc.data() };
        } else {
            return { success: true, progress: null };
        }
    } catch (error) {
        console.error('Error fetching progress:', error);
        return { success: false, error: error.message, progress: null };
    }
};

// User Profile Management
export const getUserProfile = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));

        if (userDoc.exists()) {
            return { success: true, profile: userDoc.data() };
        } else {
            return { success: false, error: 'User not found' };
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return { success: false, error: error.message };
    }
};

export const updateUserProfile = async (userId, profileData) => {
    try {
        await updateDoc(doc(db, 'users', userId), profileData);
        return { success: true };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.message };
    }
};

// Get all students (for teachers)
export const getStudents = async () => {
    try {
        const q = query(collection(db, 'users'), where('role', '==', 'student'));
        const querySnapshot = await getDocs(q);
        const students = [];

        querySnapshot.forEach((doc) => {
            students.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, students };
    } catch (error) {
        console.error('Error fetching students:', error);
        return { success: false, error: error.message, students: [] };
    }
};
