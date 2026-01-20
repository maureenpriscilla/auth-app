import { useAuth } from "../auth/AuthContext";

export const Profile = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="container">
      <div className="card">
        <h2>Profile</h2>
        <p style={{ marginBottom: "1.5rem" }}>
          Signed in as <strong>{user.email}</strong>
        </p>
        <button className="secondary" onClick={signOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};
