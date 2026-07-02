import { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load dashboard');
      }
    };
    fetchStats();
  }, []);

  if (error) return <p style={{ color: 'red', padding: 24 }}>{error}</p>;
  if (!stats) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Dashboard</h2>
      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Stores" value={stats.totalStores} />
        <StatCard label="Total Ratings" value={stats.totalRatings} />
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div style={{ flex: '1 1 200px', padding: 24, background: '#f3f4f6', borderRadius: 8, textAlign: 'center' }}>
    <h3 style={{ margin: 0, fontSize: 32 }}>{value}</h3>
    <p style={{ margin: 0, color: '#6b7280' }}>{label}</p>
  </div>
);

export default AdminDashboard;
