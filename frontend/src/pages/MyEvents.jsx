import { useAuth } from '../contexts/AuthContext';

function MyEvents() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <h1>🎉 Mes Événements</h1>
      <p>Bienvenue {user?.username}</p>
      <p>Vos événements créés apparaîtront ici...</p>
    </div>
  );
}

export default MyEvents;