import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  updateProfile 
} from 'firebase/auth';
import { auth } from '../firebase';

/**
 * Creates a new account with email and password and sets the display name.
 */
export async function signUp(email, password, displayName) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  return userCredential.user;
}

/**
 * Logs in an existing user with email and password.
 */
export async function signIn(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Opens Google popup for login.
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
}

/**
 * Signs out the current user.
 */
export async function logOut() {
  await signOut(auth);
}
