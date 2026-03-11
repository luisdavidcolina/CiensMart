import { auth } from "../config/firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from "firebase/auth";
import { toast } from "react-toastify";
import { firebaseService } from "./firebase.service";

export const authService = {
    register: async (userData: any) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );

            // Save additional user info to Firestore
            await firebaseService.saveUserProfile(userCredential.user.uid, {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                createdAt: new Date().toISOString()
            });

            toast.success("¡Registro exitoso!");
            return userCredential.user;
        } catch (error: any) {
            console.error("Error en registro:", error);
            const message = error.code === 'auth/email-already-in-use'
                ? "El correo ya está en uso."
                : "Error al registrarse. Intenta de nuevo.";
            toast.error(message);
            throw error;
        }
    },

    login: async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            toast.success("Sesión iniciada!");
            return userCredential.user;
        } catch (error: any) {
            console.error("Error en login:", error);
            let message = "Error al iniciar sesión.";
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                message = "Credenciales inválidas.";
            }
            toast.error(message);
            throw error;
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
            toast.success("Sesión cerrada");
        } catch (error) {
            console.error("Error en logout:", error);
            toast.error("Error al cerrar sesión");
        }
    },

    onAuthStateChange: (callback: (user: User | null) => void) => {
        return onAuthStateChanged(auth, callback);
    },

    getCurrentUser: () => {
        return auth.currentUser;
    },

    isAuthenticated: () => {
        return !!auth.currentUser;
    }
};
