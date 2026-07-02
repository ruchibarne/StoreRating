import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const AdminUserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/admin/users/${id}`);
        setUser(data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load user');
      }
    };
    fetchUser();
  }, [id]);

  if (error) return <p style={{ color: 'red', padding: 24 }}>{error}</p>;
  if (!user) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h2>User Details</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Address:</strong> {user.address}</p>
      <p><strong>Role:</strong> {user.role}</p>
      {user.role === 'STORE_OWNER' && (
        <p><strong>Store Rating:</strong> {user.rating ? Number(user.rating).toFixed(2) : 'No ratings yet'}</p>
      )}
    </div>
  );
};

export default AdminUserDetail;
