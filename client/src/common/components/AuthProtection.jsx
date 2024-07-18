import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {

        fetch('http://localhost:5000/protect', {
          method: 'GET',
          credentials: 'include', // Include credentials in request
        })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            if (data.authenticated) {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          })
          .catch(error => {
            console.error('Error checking authentication:', error);
            setIsAuthenticated(false);
          });
      }, []);

    if (isAuthenticated === null) {
      return <div>Loading...</div>; // Optionally render a loading state while checking authentication
    }

    return isAuthenticated ? children : <Navigate to="/signInScreen" />;
};

export default ProtectedRoute;
