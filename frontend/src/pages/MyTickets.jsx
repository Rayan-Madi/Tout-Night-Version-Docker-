import { useAuth } from '../contexts/AuthContext';

function MyTickets() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <h1>🎫 Mes Billets</h1>
      <p>Bienvenue {user?.username}</p>
      <p>Vos billets achetés apparaîtront ici...</p>
    </div>
  );
}

export default MyTickets;