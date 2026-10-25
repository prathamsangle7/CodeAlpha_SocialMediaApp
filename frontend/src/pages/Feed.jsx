import { useEffect, useState, useRef } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import Avatar from '../components/Avatar';

export default function Feed() {
  const { isAuthenticated, username } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mode, setMode] = useState('all');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef(null);

  const fetchPosts = async () => {
    setLoading(true);
    const query = mode === 'following' ? '?feed=following' : '';
    try {
      const res = await client.get(`/posts/${query}`);
      setPosts(res.data);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;
    setPosting(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (imageFile) formData.append('image', imageFile);
      await client.post('/posts/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setContent('');
      clearImage();
      fetchPosts();
    } finally {
      setPosting(false);
    }
  };

  const updatePost = (updated) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  return (
    <div>
      {isAuthenticated && (
        <form onSubmit={handlePost} className="composer">
          <div className="composer-row">
            <Avatar username={username} size={40} />
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={1000}
            />
          </div>
          {imagePreview && (
            <div className="composer-preview">
              <img src={imagePreview} alt="preview" />
              <button type="button" className="remove-preview" onClick={clearImage}>✕</button>
            </div>
          )}
          <div className="composer-footer">
            <label className="image-upload-btn">
              📷 Photo
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} hidden />
            </label>
            <button type="submit" disabled={posting}>{posting ? 'Posting...' : 'Post'}</button>
          </div>
        </form>
      )}

      {isAuthenticated && (
        <div className="feed-tabs">
          <button className={mode === 'all' ? 'active' : ''} onClick={() => setMode('all')}>All Posts</button>
          <button className={mode === 'following' ? 'active' : ''} onClick={() => setMode('following')}>Following</button>
        </div>
      )}

      {loading ? (
        <p className="status">Loading feed...</p>
      ) : posts.length === 0 ? (
        <p className="status">No posts yet. Be the first to share something!</p>
      ) : (
        posts.map((p) => <PostCard key={p.id} post={p} onUpdate={updatePost} />)
      )}
    </div>
  );
}
