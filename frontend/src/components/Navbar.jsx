import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎉 Tout Night
        </Link>

        <div className="navbar-menu">
          <Link to="/events" className="navbar-link">
            Événements
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/my-tickets" className="navbar-link">
                Mes Billets
              </Link>
              
              <Link to="/my-events" className="navbar-link">
                Mes Événements
              </Link>

              <div className="navbar-user">
                <span className="navbar-username">
                  {user?.username}
                </span>
                <button onClick={handleLogout} className="navbar-btn">
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Connexion
              </Link>
              <Link to="/register" className="navbar-btn-link">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;