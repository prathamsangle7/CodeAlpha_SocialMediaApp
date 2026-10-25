import { useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

export default function PostCard({ post, onUpdate }) {
  const { isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [burst, setBurst] = useState(false);

  const toggleLike = async () => {
    if (!isAuthenticated) return;
    // optimistic update
    const wasLiked = post.is_liked;
    onUpdate({
      ...post,
      is_liked: !wasLiked,
      likes_count: post.likes_count + (wasLiked ? -1 : 1),
    });
    try {
      const res = await client.post(`/posts/${post.id}/like/`);
      onUpdate({ ...post, is_liked: res.data.liked, likes_count: res.data.likes_count });
    } catch {
      onUpdate(post); // revert on failure
    }
  };

  const handleDoubleClick = () => {
    if (!isAuthenticated || post.is_liked) return;
    setBurst(true);
    setTimeout(() => setBurst(false), 700);
    toggleLike();
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const res = await client.post(`/posts/${post.id}/comments/`, { text: commentText });
    onUpdate({ ...post, comments: [...post.comments, res.data] });
    setCommentText('');
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.author_username}`} className="post-author-row">
          <Avatar src={post.author_avatar} username={post.author_username} size={38} />
          <span className="post-author">@{post.author_username}</span>
        </Link>
        <span className="post-time">{new Date(post.created_at).toLocaleDateString()}</span>
      </div>

      <div className="post-body" onDoubleClick={handleDoubleClick}>
        <p className="post-content">{post.content}</p>
        {post.image && <img src={post.image} alt="post" className="post-image" />}
        {burst && <span className="heart-burst">♥</span>}
      </div>

      <div className="post-actions">
        <button className={`like-btn ${post.is_liked ? 'liked' : ''}`} onClick={toggleLike}>
          {post.is_liked ? '♥' : '♡'} {post.likes_count}
        </button>
        <button className="comment-toggle" onClick={() => setShowComments(!showComments)}>
          💬 {post.comments.length}
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {post.comments.map((c) => (
            <div key={c.id} className="comment">
              <Avatar src={c.author_avatar} username={c.author_username} size={24} />
              <span><strong>@{c.author_username}</strong> {c.text}</span>
            </div>
          ))}
          {isAuthenticated && (
            <form onSubmit={handleComment} className="comment-form">
              <input
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit">Post</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
