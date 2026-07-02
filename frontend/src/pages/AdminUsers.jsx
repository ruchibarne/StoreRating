import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const params = { ...filters, ...sort };
      Object.keys(params).forEach((key) => { if (!params[key]) delete params[key]; });
      const { data } = await api.get('/admin/users', { params });
      setUsers(data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load users');
    }
  };

  useEffect(() => { fetchUsers(); }, [sort]);

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
        <h2>Users</h2>
        <Link to="/admin/users/new" style={{ padding: '8px 16px', background: '#1f2937', color: '#fff', textDecoration: 'none', borderRadius: 4 }}>
          + Add User
        </Link>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 8, margin: '16px 0', flexWrap: 'wrap' }}>
        <input name="name" placeholder="Filter by name" value={filters.name} onChange={handleFilterChange} style={{ padding: 8 }} />
        <input name="email" placeholder="Filter by email" value={filters.email} onChange={handleFilterChange} style={{ padding: 8 }} />
        <input name="address" placeholder="Filter by address" value={filters.address} onChange={handleFilterChange} style={{ padding: 8 }} />
        <select name="role" value={filters.role} onChange={handleFilterChange} style={{ padding: 8 }}>
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
        <button onClick={fetchUsers} style={{ padding: '8px 16px' }}>Apply Filters</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
            <Th label="Name" field="name" sort={sort} onClick={toggleSort} />
            <Th label="Email" field="email" sort={sort} onClick={toggleSort} />
            <Th label="Address" field="address" sort={sort} onClick={toggleSort} />
            <Th label="Role" field="role" sort={sort} onClick={toggleSort} />
            <th style={{ padding: 8 }}>Details</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: 8 }}>{u.name}</td>
              <td style={{ padding: 8 }}>{u.email}</td>
              <td style={{ padding: 8 }}>{u.address}</td>
              <td style={{ padding: 8 }}>{u.role}</td>
              <td style={{ padding: 8 }}>
                <Link to={`/admin/users/${u.id}`}>View</Link>
              </td>
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

export default AdminUsers;
