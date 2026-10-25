export default function Avatar({ src, username, size = 40 }) {
  const style = { width: size, height: size, fontSize: size * 0.4 };
  if (src) {
    return <img className="avatar" src={src} alt={username} style={style} />;
  }
  return (
    <div className="avatar avatar-fallback" style={style}>
      {username ? username[0].toUpperCase() : '?'}
    </div>
  );
}
