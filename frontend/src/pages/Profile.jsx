import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import Avatar from '../components/Avatar';

export default function Profile() {
  const { username } = useParams();
  const { username: myUsername, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchData = async () => {
    const [profileRes, postsRes] = await Promise.all([
      client.get(`/auth/profile/${username}/`),
      client.get(`/posts/?username=${username}`),
    ]);
    setProfile(profileRes.data);
    setPosts(postsRes.data);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const handleFollow = async () => {
    await client.post(`/auth/profile/${username}/follow/`);
    fetchData();
  };

  const updatePost = (updated) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  if (!profile) return <p className="status">Loading profile...</p>;

  const isOwnProfile = myUsername === username;

  return (
    <div>
      <div className="profile-header">
        <Avatar src={profile.avatar} username={username} size={76} />
        <div className="profile-info">
          <h2>@{profile.username}</h2>
          {profile.bio && <p className="bio">{profile.bio}</p>}
          <div className="profile-stats">
            <span><strong>{profile.posts_count}</strong> posts</span>
            <span><strong>{profile.followers_count}</strong> followers</span>
            <span><strong>{profile.following_count}</strong> following</span>
          </div>
        </div>
        {isAuthenticated && !isOwnProfile && (
          <button className={profile.is_following ? 'following-btn' : ''} onClick={handleFollow}>
            {profile.is_following ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      <div className="profile-posts">
        {posts.length === 0 ? (
          <p className="status">No posts yet.</p>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} onUpdate={updatePost} />)
        )}
      </div>
    </div>
  );
}
