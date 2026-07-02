import { useEffect, useState } from 'react';
import api from '../api/axios';

const StoreOwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/store-owner/dashboard');
        setData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load dashboard');
      }
    };
    fetchDashboard();
  }, []);

  if (error) return <p style={{ color: 'red', padding: 24 }}>{error}</p>;
  if (!data) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>{data.store.name}</h2>
      <p style={{ color: '#6b7280' }}>{data.store.address}</p>
      <div style={{ padding: 16, background: '#f3f4f6', borderRadius: 8, display: 'inline-block', margin: '16px 0' }}>
        <h3 style={{ margin: 0 }}>Average Rating: {data.averageRating || 'No ratings yet'}</h3>
      </div>

      <h3>Users Who Rated This Store</h3>
      {data.raters.length === 0 ? (
        <p>No ratings submitted yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
              <th style={{ padding: 8 }}>Name</th>
              <th style={{ padding: 8 }}>Email</th>
              <th style={{ padding: 8 }}>Address</th>
              <th style={{ padding: 8 }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.raters.map((r) => (
              <tr key={r.userId} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: 8 }}>{r.name}</td>
                <td style={{ padding: 8 }}>{r.email}</td>
                <td style={{ padding: 8 }}>{r.address}</td>
                <td style={{ padding: 8 }}>{r.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
