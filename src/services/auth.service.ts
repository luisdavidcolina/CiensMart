import { toast } from "react-toastify";

const KEYS = {
    USERS: "simulated_users",
    CURRENT_USER: "simulated_current_user"
};

export const authService = {
    getUsers: () => {
        if (typeof window === "undefined") return [];
        return JSON.parse(localStorage.getItem(KEYS.USERS) || "[]");
    },

    register: (userData: any) => {
        const users = authService.getUsers();
        const existingUser = users.find((u: any) => u.email === userData.email);

        if (existingUser) {
            toast.error("User already exists!");
            return false;
        }

        const newUser = {
            id: Date.now(),
            ...userData,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(KEYS.USERS, JSON.stringify(users));

        // Auto login after register
        localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(newUser));
        toast.success("Registration successful!");
        return true;
    },

    login: (email: string, password: string) => {
        const users = authService.getUsers();
        // In a real app we would hash passwords. Here we just compare plain text for simulation.
        // Also since the current login page hardcodes "test@gmail.com", we might want to ensure that one exists or just check against registered users.
        const user = users.find((u: any) => u.email === email && u.password === password);

        if (user || (email === "test@gmail.com" && password === "test@123")) {
            const userToSave = user || { email, firstName: "Test", lastName: "User", id: 0 };
            localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(userToSave));
            toast.success("Login successful!");
            return true;
        } else {
            toast.error("Invalid credentials");
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem(KEYS.CURRENT_USER);
        // method to clean other session data if needed
        toast.success("Logged out successfully");
    },

    getCurrentUser: () => {
        if (typeof window === "undefined") return null;
        return JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || "null");
    },

    isAuthenticated: () => {
        return !!authService.getCurrentUser();
    }
};
