import { useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import Avatar from '../components/Avatar';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const res = await client.get(`/auth/search/?q=${encodeURIComponent(query)}`);
    setResults(res.data);
    setSearched(true);
  };

  const toggleFollow = async (username) => {
    await client.post(`/auth/profile/${username}/follow/`);
    const res = await client.get(`/auth/search/?q=${encodeURIComponent(query)}`);
    setResults(res.data);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="search-form">
        <input
          placeholder="Search for people..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {searched && results.length === 0 && <p className="status">No users found.</p>}

      <div className="search-results">
        {results.map((u) => (
          <div key={u.id} className="search-result">
            <Link to={`/profile/${u.username}`} className="post-author-row">
              <Avatar src={u.avatar} username={u.username} size={44} />
              <div>
                <div className="post-author">@{u.username}</div>
                {u.bio && <div className="search-bio">{u.bio}</div>}
              </div>
            </Link>
            <button className={u.is_following ? 'following-btn' : ''} onClick={() => toggleFollow(u.username)}>
              {u.is_following ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
