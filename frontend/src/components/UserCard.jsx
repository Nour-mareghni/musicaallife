export default function UserCard({ user }) {
    return (
      <div className="user-card">
        <div className="avatar">{user.name.charAt(0)}</div>
        <h3>{user.name}</h3>
        <p>{user.bio || 'No bio yet'}</p>
        <div className="details">
          <span>Age: {user.age}</span>
          {user.email && <span>Contact: {user.email}</span>}
        </div>
      </div>
    );
  }