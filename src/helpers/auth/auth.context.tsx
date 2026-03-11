import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { authService } from "../../services/auth.service";
import { firebaseService } from "../../services/firebase.service";

interface AuthContextType {
    currentUser: User | null;
    userProfile: any | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribe = authService.onAuthStateChange(async (user) => {
            setCurrentUser(user);
            if (user) {
                // Fetch additional profile info from Firestore
                const profile = await firebaseService.getUserProfile(user.uid);
                setUserProfile(profile);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await authService.logout();
        setUserProfile(null);
    };

    const value = {
        currentUser,
        userProfile,
        loading,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
