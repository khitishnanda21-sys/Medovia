import { Routes, Route } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import DashboardScreen from './screens/DashboardScreen';
import DrMatrixScreen from './screens/DrMatrixScreen';
import FindDoctorsScreen from './screens/FindDoctorsScreen';
import DoctorProfileScreen from './screens/DoctorProfileScreen';
import PaymentScreen from './screens/PaymentScreen';
import BookingConfirmationScreen from './screens/BookingConfirmationScreen';
import AppointmentsScreen from './screens/AppointmentsScreen';
import PrescriptionsScreen from './screens/PrescriptionsScreen';
import ReviewsScreen from './screens/ReviewsScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import ProfileScreen from './screens/ProfileScreen';
import DoctorDashboardScreen from './screens/DoctorDashboardScreen';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/dashboard" element={<DashboardScreen />} />
      <Route path="/dr-matrix" element={<DrMatrixScreen />} />
      <Route path="/find-doctors" element={<FindDoctorsScreen />} />
      <Route path="/doctor/:id" element={<DoctorProfileScreen />} />
      <Route path="/payment/:id" element={<PaymentScreen />} />
      <Route path="/booking-confirmation/:id" element={<BookingConfirmationScreen />} />
      <Route path="/appointments" element={<AppointmentsScreen />} />
      <Route path="/prescriptions" element={<PrescriptionsScreen />} />
      <Route path="/reviews" element={<ReviewsScreen />} />
      <Route path="/payments" element={<PaymentsScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/doctor-dashboard" element={<DoctorDashboardScreen />} />
    </Routes>
  );
}

export default App;