import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });
  const [error, setError] = useState('');

  const fetchStores = async () => {
    try {
      const params = { ...filters, ...sort };
      Object.keys(params).forEach((key) => { if (!params[key]) delete params[key]; });
      const { data } = await api.get('/admin/stores', { params });
      setStores(data.stores);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load stores');
    }
  };

  useEffect(() => { fetchStores(); }, [sort]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const toggleSort = (field) => {
    setSort((prev) => ({
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Stores</h2>
        <Link to="/admin/stores/new" style={{ padding: '8px 16px', background: '#1f2937', color: '#fff', textDecoration: 'none', borderRadius: 4 }}>
          + Add Store
        </Link>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 8, margin: '16px 0', flexWrap: 'wrap' }}>
        <input name="name" placeholder="Filter by name" value={filters.name} onChange={handleFilterChange} style={{ padding: 8 }} />
        <input name="email" placeholder="Filter by email" value={filters.email} onChange={handleFilterChange} style={{ padding: 8 }} />
        <input name="address" placeholder="Filter by address" value={filters.address} onChange={handleFilterChange} style={{ padding: 8 }} />
        <button onClick={fetchStores} style={{ padding: '8px 16px' }}>Apply Filters</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eff2f9', textAlign: 'left' }}>
            <Th label="Name" field="name" sort={sort} onClick={toggleSort} />
            <Th label="Email" field="email" sort={sort} onClick={toggleSort} />
            <Th label="Address" field="address" sort={sort} onClick={toggleSort} />
            <th style={{ padding: 8 }}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id} style={{ borderBottom: '1px solid #e0e3e9' }}>
              <td style={{ padding: 8 }}>{s.name}</td>
              <td style={{ padding: 8 }}>{s.email}</td>
              <td style={{ padding: 8 }}>{s.address}</td>
              <td style={{ padding: 8 }}>{s.averageRating ? Number(s.averageRating).toFixed(2) : 'No ratings'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Th = ({ label, field, sort, onClick }) => (
  <th style={{ padding: 8, cursor: 'pointer' }} onClick={() => onClick(field)}>
    {label} {sort.sortBy === field ? (sort.order === 'ASC' ? '▲' : '▼') : ''}
  </th>
);

export default AdminStores;
