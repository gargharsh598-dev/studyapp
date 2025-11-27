import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase.config';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            if (loading) {
                console.warn('Firebase initialization timeout - continuing without auth');
                setLoading(false);
            }
        }, 3000);

        // Check if auth is available
        if (!auth) {
            console.warn('Firebase Auth not initialized');
            setLoading(false);
            clearTimeout(timeout);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            clearTimeout(timeout);
            try {
                if (firebaseUser) {
                    setUser(firebaseUser);
                    // Fetch user role from Firestore with retry logic
                    if (db) {
                        let retries = 1; // Reduced retries for faster startup
                        while (retries >= 0) {
                            try {
                                // Create a timeout promise
                                const timeoutPromise = new Promise((_, reject) =>
                                    setTimeout(() => reject(new Error('Firestore timeout')), 2000)
                                );

                                // Race between getDoc and timeout
                                const userDoc = await Promise.race([
                                    getDoc(doc(db, 'users', firebaseUser.uid)),
                                    timeoutPromise
                                ]);

                                if (userDoc.exists()) {
                                    setUserRole(userDoc.data().role);
                                }
                                break; // Success, exit retry loop
                            } catch (error) {
                                retries--;
                                if ((error.code === 'unavailable' || error.message === 'Firestore timeout') && retries >= 0) {
                                    console.warn(`Firestore offline/slow, retrying... (${retries} attempts left)`);
                                    await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
                                } else {
                                    console.error('Error fetching user role:', error);
                                    // Continue without role if all retries fail
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    setUser(null);
                    setUserRole(null);
                }
            } catch (globalError) {
                console.error('Critical Auth Error:', globalError);
                // In case of critical error, ensure we don't hang in loading state
                setUser(null);
            } finally {
                setLoading(false);
            }
        });

        return () => {
            clearTimeout(timeout);
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const signup = async (email, password, displayName, role) => {
        try {
            console.log('Signup function called with role:', role);

            if (!auth) {
                console.error('Firebase Auth not initialized');
                return { success: false, error: 'Authentication service not available. Please check your Firebase configuration.' };
            }

            if (!db) {
                console.error('Firestore not initialized');
                return { success: false, error: 'Database service not available. Please check your Firebase configuration.' };
            }

            console.log('Creating user with Firebase Auth...');
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User created successfully:', user.uid);

            // Create user document in Firestore
            console.log('Creating user document in Firestore...');
            await setDoc(doc(db, 'users', user.uid), {
                email,
                displayName,
                role,
                createdAt: new Date().toISOString()
            });
            console.log('User document created successfully');

            setUser(user);
            setUserRole(role);
            console.log('Signup completed successfully');
            return { success: true };
        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = error.message;

            // Provide user-friendly error messages
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered. Please login instead.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Please use at least 6 characters.';
            }

            return { success: false, error: errorMessage };
        }
    };

    const login = async (email, password) => {
        try {
            console.log('Login attempt for:', email);

            if (!auth) {
                return { success: false, error: 'Authentication service not available.' };
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Login successful:', user.uid);

            // Fetch user role with retry logic
            if (db) {
                let retries = 1;
                while (retries >= 0) {
                    try {
                        const timeoutPromise = new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Firestore timeout')), 2000)
                        );

                        const userDoc = await Promise.race([
                            getDoc(doc(db, 'users', user.uid)),
                            timeoutPromise
                        ]);

                        if (userDoc.exists()) {
                            setUserRole(userDoc.data().role);
                            console.log('User role fetched:', userDoc.data().role);
                        }
                        break; // Success
                    } catch (error) {
                        retries--;
                        if ((error.code === 'unavailable' || error.message === 'Firestore timeout') && retries >= 0) {
                            console.warn(`Firestore offline/slow, retrying... (${retries} attempts left)`);
                            await new Promise(resolve => setTimeout(resolve, 500));
                        } else {
                            console.error('Error fetching user role:', error);
                            // Continue without role if all retries fail
                            break;
                        }
                    }
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = error.message;

            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            }

            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setUserRole(null);
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        userRole,
        loading,
        signup,
        login,
        logout,
        isTeacher: userRole === 'teacher',
        isStudent: userRole === 'student'
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #667eea',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ color: '#666' }}>Loading...</p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
