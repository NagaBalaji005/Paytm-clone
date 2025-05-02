import { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/Home';
import Profile from './pages/Profile';
import TransactionHistory from './pages/TransactionHistory';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Footer from './components/Footer';
import Transaction from './pages/Transaction';
import { AuthContext } from './Context/Context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Protected Route component to handle route protection
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return null; // or a loading spinner
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <div className='container h-100'>
      <Navbar />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route 
          path='/transaction' 
          element={
            <ProtectedRoute>
              <Transaction />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/transaction-history' 
          element={
            <ProtectedRoute>
              <TransactionHistory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/settings' 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/profile' 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;