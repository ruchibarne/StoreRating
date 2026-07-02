import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminAddStore = () => {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [storeOwners, setStoreOwners] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const { data } = await api.get('/admin/users', { params: { role: 'STORE_OWNER' } });
        setStoreOwners(data.users);
      } catch (err) {
      }
    };
    fetchOwners();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/admin/stores', { ...formData, ownerId: formData.ownerId || null });
      setSuccess('Store created successfully');
      setTimeout(() => navigate('/admin/stores'), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create store');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <h2>Add New Store</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Store Name (20-60 characters)</label>
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
          <label>Assign Store Owner (optional)</label>
          <select name="ownerId" value={formData.ownerId} onChange={handleChange} style={{ width: '100%', padding: 8, marginTop: 4 }}>
            <option value="">-- None --</option>
            {storeOwners.map((o) => (
              <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
            ))}
          </select>
        </div>
        <button type="submit" style={{ width: '100%', padding: 10 }}>Create Store</button>
      </form>
    </div>
  );
};

export default AdminAddStore;
