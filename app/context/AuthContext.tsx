// "use client";

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// // Define the User Shape
// export interface User {
//   id: string;
//   name: string;
//   role: 'admin' | 'employee';
//   email: string;
//   avatar: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (role: 'admin' | 'employee') => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const router = useRouter();

//   // 1. Check LocalStorage on Load (Persistence)
//   useEffect(() => {
//     const storedUser = localStorage.getItem('travdek_mock_user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // 2. Login Function (Simulated)
//   const login = (role: 'admin' | 'employee') => {
//     const mockUser: User = {
//       id: role === 'admin' ? 'adm-001' : 'emp-001',
//       name: role === 'admin' ? 'Super Admin' : 'John Doe',
//       role: role,
//       email: role === 'admin' ? 'admin@travdek.com' : 'john@travdek.com',
//       avatar: role === 'admin' 
//         ? 'https://i.pravatar.cc/150?u=admin' 
//         : 'https://i.pravatar.cc/150?u=employee'
//     };

//     setUser(mockUser);
//     localStorage.setItem('travdek_mock_user', JSON.stringify(mockUser));
    
//     // Redirect to Dashboard after login
//     router.push('/dashboard');
//   };

//   // 3. Logout Function
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('travdek_mock_user');
//     router.push('/dashboard/login');
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       isAuthenticated: !!user, 
//       login, 
//       logout 
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   return context;
// }