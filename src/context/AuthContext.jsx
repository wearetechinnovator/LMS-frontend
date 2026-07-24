import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || '');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || '');
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [profileImg, setProfileImg] = useState(() => localStorage.getItem('userImg') || '');

  const isAuthenticated = !!token;

  const login = (newToken, newRole, newUsername, newImg = '') => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userRole', newRole);
    localStorage.setItem('username', newUsername);
    if (newImg) {
      localStorage.setItem('userImg', newImg);
    } else {
      localStorage.removeItem('userImg');
    }
    setToken(newToken);
    setUserRole(newRole);
    setUsername(newUsername);
    setProfileImg(newImg);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('userImg');
    localStorage.removeItem('lms_leads_database');
    setToken('');
    setUserRole('');
    setUsername('');
    setProfileImg('');
  };

  // Sync profile image updates if updated elsewhere
  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfileImg(localStorage.getItem('userImg') || '');
    };
    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('profile-updated', handleProfileUpdate);
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      token,
      userRole,
      username,
      profileImg,
      login,
      logout,
      setProfileImg
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
