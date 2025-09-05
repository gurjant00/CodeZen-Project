import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isGuest?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with demo account - always ensure it exists
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if demo user exists
    const demoExists = users.find((u: any) => u.email === 'student@demo.com' && u.id === 'demo_001');
    
    if (!demoExists) {
      // Remove any conflicting demo users and create fresh one
      users = users.filter((u: any) => u.email !== 'student@demo.com');
      
      const demoUser = {
        id: 'demo_001',
        email: 'student@demo.com',
        password: 'demo123',
        name: 'Demo Student'
      };
      
      users.unshift(demoUser); // Add demo user at the beginning
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Demo user created/updated:', demoUser);
    }

    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('All users:', users);
    console.log('Looking for:', { email, password });
    
    const foundUser = users.find((u: any) => {
      const emailMatch = u.email === email;
      const passwordMatch = u.password === password;
      console.log(`Checking user ${u.email}: email=${emailMatch}, password=${passwordMatch}`);
      return emailMatch && passwordMatch;
    });
    
    console.log('Found user:', foundUser);
    
    if (foundUser) {
      const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      console.error('Authentication failed for:', { email, password });
      throw new Error('Invalid email or password');
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const userData = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const signInAsGuest = async () => {
    // Simulate slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const guestUser = {
      id: 'guest_' + Date.now(),
      email: 'guest@example.com',
      name: 'Guest User',
      isGuest: true
    };
    
    setUser(guestUser);
    // Don't save guest session to localStorage to keep it temporary
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
