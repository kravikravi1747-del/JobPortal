import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('All');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search, location, type });
  };

  const handleClear = () => {
    setSearch('');
    setLocation('');
    setType('All');
    onSearch({ search: '', location: '', type: 'All' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="search-bar">
        <div className="search-input-group">
          <span className="icon">🔍</span>
          <input
            type="text"
            className="form-control"
            placeholder="Search job title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="search-divider" />

        <div className="search-input-group">
          <span className="icon">📍</span>
          <input
            type="text"
            className="form-control"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="search-divider" />

        <select
          className="form-control"
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ minWidth: '130px', flex: 'none' }}
        >
          <option>All</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Remote</option>
          <option>Internship</option>
          <option>Contract</option>
        </select>

        <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
          Search
        </button>

        {(search || location || type !== 'All') && (
          <button type="button" className="btn btn-secondary" onClick={handleClear} style={{ flexShrink: 0 }}>
            Clear
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
