import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminAddUser = () => {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/admin/users', formData);
      setSuccess('User created successfully');
      setTimeout(() => navigate('/admin/users'), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create user');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <h2>Add New User</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Name (20-60 characters)</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Address</label>
          <textarea name="address" value={formData.address} onChange={handleChange} maxLength={400} style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: 8, marginTop: 4 }} />
          <small>8-16 characters, 1 uppercase letter, 1 special character</small>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: 8, marginTop: 4 }}>
            <option value="USER">Normal User</option>
            <option value="ADMIN">Admin</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
        </div>
        <button type="submit" style={{ width: '100%', padding: 10 }}>Create User</button>
      </form>
    </div>
  );
};

export default AdminAddUser;
