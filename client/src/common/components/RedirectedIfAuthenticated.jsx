import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const RedirectIfAuthenticated = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [screenToNavigate, setScreenToNavigate] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('http://localhost:5000/protectedRoute', {
          method: 'POST',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Unauthorized');
        }

        const data = await response.json();

        setIsAuthenticated(data.authenticated);
        if (data.role === "Service Provider") {
          setScreenToNavigate('/clientHomeScreen');
        } else {
          setScreenToNavigate('/');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Optionally render a loading state while checking authentication
  }

  return isAuthenticated ? <Navigate to={screenToNavigate} /> : children;
};

export default RedirectIfAuthenticated;
