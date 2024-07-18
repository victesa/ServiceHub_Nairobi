import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpScreen from './common/screens/SignUpScreen';
import SignInScreen from './common/screens/SignInScreen';
import HomeScreen from './common/screens/HomeScreen';
import ResetPasswordScreen from './common/screens/ResetPasswordScreen';
import PasswordResetScreen from './common/screens/PasswordResetScreen';
import VerifyEmailScreen from './common/screens/VerifyEmailScreen';
import RoleOptionScreen from './common/screens/RoleOptionScreen';
import EmailVerificationLinkScreen from './common/screens/EmailVerificationLinkScreen';
import ProtectedRoute from './common/components/AuthProtection'; // Correct the import path
import RedirectIfAuthenticated from './common/components/RedirectedIfAuthenticated'; // New component
import ProfileSetUpScreen from './ServiceProvider/screens/ProfileSetupScreen';
import ServiceProviderHomeScreen from './ServiceProvider/screens/ServiceProviderHomeScreen';
import ClientHomeScreen from './client/screens/ClientHomeScreen';
import SingleService from './client/screens/SingleService';
import ViewRequestScreen from './ServiceProvider/screens/ViewRequest';
import ViewServiceCard from './client/screens/SingleService';
import OrderScreen from './client/screens/OrderScreen';
import ClientNewProfileScreen from './client/screens/ClientNewProfileScreen';
import NewSignUpScreen from './common/screens/ClientSignUpScreen';
import ServiceProviderNewProfileScreen from './ServiceProvider/screens/NewProfileSetupScreen';
import ServiceSetup from './ServiceProvider/screens/ServiceSetup';
import ViewOrderCard from './client/screens/viewOrder';
import ViewWorkScreen from './client/screens/viewWork';
import ProviderViewWorkScreen from './ServiceProvider/screens/ProviderViewWork';
import WorkScreen from './client/screens/work';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<RedirectIfAuthenticated><HomeScreen /></RedirectIfAuthenticated>} />
          <Route path="/signUpScreen" element={<RedirectIfAuthenticated><NewSignUpScreen /></RedirectIfAuthenticated>} />
          <Route path="/signInScreen" element={<RedirectIfAuthenticated><SignInScreen /></RedirectIfAuthenticated>} />
          <Route path="/reset-password" element={<ResetPasswordScreen />} />
          <Route path="/passwordReset" element={<PasswordResetScreen />} />
          <Route path="/verify-Email" element={<VerifyEmailScreen />} />
          <Route path="/roleOptionScreen" element={<RoleOptionScreen />} />
          <Route path="/EmailVerificationLink" element={<EmailVerificationLinkScreen />} />
          <Route path="/HomeAuthenticatedScreen" element={<ProtectedRoute><ProfileSetUpScreen /></ProtectedRoute>} />
          <Route path="ProfileSetupScreen" element={<ProtectedRoute><ProfileSetUpScreen/></ProtectedRoute>}/>
          <Route path="/ServiceProviderScreen" element={<ProtectedRoute><ServiceProviderHomeScreen/></ProtectedRoute>}/>
          <Route path="/ClientHomeScreen" element={<ProtectedRoute><ClientHomeScreen/></ProtectedRoute>}/>
          <Route path='/ViewServices' element={<ProtectedRoute><ViewServiceCard/></ProtectedRoute>}/>
          <Route path='/viewRequest/:request_id' element={<ProtectedRoute><ViewRequestScreen/></ProtectedRoute>}/>
          <Route path='/orderScreen' element={<ProtectedRoute><OrderScreen/></ProtectedRoute>}/>
          <Route path='/ClientNewProfileScreen' element={<ProtectedRoute><ClientNewProfileScreen/></ProtectedRoute>}/>
          <Route path='/NewSignUpScreen' element={<ProtectedRoute><NewSignUpScreen/></ProtectedRoute>}/>
          <Route path='/NewProfileSetupScreen' element={<ProtectedRoute><ServiceProviderNewProfileScreen/></ProtectedRoute>}/>
          <Route path='/serviceSetupss' element={<ProtectedRoute><ServiceSetup/></ProtectedRoute>}/>
          <Route path='/viewOrder/:request_id/:provider_id' element={<ProtectedRoute><ViewOrderCard/></ProtectedRoute>}/>
          <Route path='/ServiceProviderNewProfileScreen' element={<ProtectedRoute><ServiceProviderNewProfileScreen/></ProtectedRoute>}/>
          <Route path='/viewWork/:booking_id' element={<ProtectedRoute><ViewWorkScreen/></ProtectedRoute>}/>
          <Route path='/providerViewWork/:booking_id' element={<ProtectedRoute><ProviderViewWorkScreen/></ProtectedRoute>}/>
          <Route path='/workScreen' element={<ProtectedRoute><WorkScreen/></ProtectedRoute>}/>



        </Routes>
      </div>
    </Router>
  );
}

export default App;
