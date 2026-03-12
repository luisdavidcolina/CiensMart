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

    const getCachedProfile = (uid: string) => {
        if (typeof window === "undefined") return null;
        const raw = sessionStorage.getItem(`profile_${uid}`);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    };

    const setCachedProfile = (uid: string, profile: any) => {
        if (typeof window === "undefined") return;
        sessionStorage.setItem(`profile_${uid}`, JSON.stringify(profile || null));
    };

    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribe = authService.onAuthStateChange((user) => {
            setCurrentUser(user);
            if (user) {
                const cachedProfile = getCachedProfile(user.uid);
                if (cachedProfile) {
                    setUserProfile(cachedProfile);
                }

                // Do not block initial render with profile fetch
                setLoading(false);
                firebaseService.getUserProfile(user.uid).then((profile) => {
                    setUserProfile(profile);
                    setCachedProfile(user.uid, profile);
                }).catch(() => {
                    // Keep UI responsive even if profile fetch fails
                });
            } else {
                setUserProfile(null);
                setLoading(false);
            }
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
