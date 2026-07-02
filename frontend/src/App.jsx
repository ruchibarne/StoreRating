import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UpdatePassword from './pages/UpdatePassword';

import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminUserDetail from './pages/AdminUserDetail';
import AdminAddUser from './pages/AdminAddUser';
import AdminStores from './pages/AdminStores';
import AdminAddStore from './pages/AdminAddStore';

import UserStores from './pages/UserStores';

import StoreOwnerDashboard from './pages/StoreOwnerDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/update-password"
            element={
              <ProtectedRoute>
                <UpdatePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/users"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsers /></ProtectedRoute>}
          />
          <Route
            path="/admin/users/new"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminAddUser /></ProtectedRoute>}
          />
          <Route
            path="/admin/users/:id"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUserDetail /></ProtectedRoute>}
          />
          <Route
            path="/admin/stores"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminStores /></ProtectedRoute>}
          />
          <Route
            path="/admin/stores/new"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminAddStore /></ProtectedRoute>}
          />
          <Route
            path="/stores"
            element={<ProtectedRoute allowedRoles={['USER']}><UserStores /></ProtectedRoute>}
          />
          <Route
            path="/store-owner/dashboard"
            element={<ProtectedRoute allowedRoles={['STORE_OWNER']}><StoreOwnerDashboard /></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
