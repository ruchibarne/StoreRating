import { useEffect, useState } from 'react';
import api from '../api/axios';
import StarRating from '../components/StarRating';

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchStores = async () => {
    try {
      const params = { ...search, ...sort };
      Object.keys(params).forEach((key) => { if (!params[key]) delete params[key]; });
      const { data } = await api.get('/stores', { params });
      setStores(data.stores);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load stores');
    }
  };

  useEffect(() => { fetchStores(); }, [sort]);

  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const toggleSort = (field) => {
    setSort((prev) => ({
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handleRate = async (storeId, rating, alreadyRated) => {
    setError('');
    setMessage('');
    try {
      if (alreadyRated) {
        await api.put(`/stores/${storeId}/rating`, { rating });
      } else {
        await api.post(`/stores/${storeId}/rating`, { rating });
      }
      setMessage('Rating saved');
      fetchStores();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save rating');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Browse Stores</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <div style={{ display: 'flex', gap: 8, margin: '16px 0', flexWrap: 'wrap' }}>
        <input name="name" placeholder="Search by store name" value={search.name} onChange={handleSearchChange} style={{ padding: 8 }} />
        <input name="address" placeholder="Search by address" value={search.address} onChange={handleSearchChange} style={{ padding: 8 }} />
        <button onClick={fetchStores} style={{ padding: '8px 16px' }}>Search</button>
        <button onClick={() => toggleSort('name')} style={{ padding: '8px 16px' }}>
          Sort by Name {sort.sortBy === 'name' ? (sort.order === 'ASC' ? '▲' : '▼') : ''}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} onRate={handleRate} />
        ))}
      </div>
    </div>
  );
};

const StoreCard = ({ store, onRate }) => {
  const [selected, setSelected] = useState(store.userRating || 0);
  const alreadyRated = Boolean(store.userRating);

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
      <h3 style={{ margin: '0 0 4px 0' }}>{store.name}</h3>
      <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>{store.address}</p>
      <p style={{ margin: '0 0 8px 0' }}>
        Overall Rating: {store.averageRating ? Number(store.averageRating).toFixed(2) : 'No ratings yet'}
      </p>
      <p style={{ margin: '0 0 4px 0' }}>Your Rating:</p>
      <StarRating value={selected} onChange={setSelected} />
      <div style={{ marginTop: 8 }}>
        <button
          onClick={() => onRate(store.id, selected, alreadyRated)}
          disabled={selected === 0}
          style={{ padding: '6px 12px' }}
        >
          {alreadyRated ? 'Update Rating' : 'Submit Rating'}
        </button>
      </div>
    </div>
  );
};

export default UserStores;
