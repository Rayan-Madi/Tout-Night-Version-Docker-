import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../contexts/AuthContext';
import './MyTickets.css';

function MyTickets() {
  const { isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fonction pour charger les billets
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tickets/');
      console.log('Billets récupérés:', response.data);
      
      const ticketsData = Array.isArray(response.data) 
        ? response.data 
      : (response.data.results || response.data.tickets || []);
      
      setTickets(response.data.results || []);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des billets');
      setLoading(false);
      console.error('Erreur:', err);
    }
  };

  // Charger les billets au montage
  useEffect(() => {
    if (isAuthenticated) {
      fetchTickets();
    }
  }, [isAuthenticated]);

  const handleCancelTicket = async (ticketNumber) => {
    if (!window.confirm('Voulez-vous vraiment annuler ce billet ?')) {
      return;
    }

    try {
      await api.post(`/tickets/${ticketNumber}/cancel/`);
      alert('Billet annulé avec succès');
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de l\'annulation');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { label: 'Confirmé', class: 'status-confirmed' },
      pending: { label: 'En attente', class: 'status-pending' },
      cancelled: { label: 'Annulé', class: 'status-cancelled' },
      used: { label: 'Utilisé', class: 'status-used' },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`ticket-status ${config.class}`}>{config.label}</span>;
  };

  if (!isAuthenticated) {
    return (
      <div className="tickets-error">
        <h2>🔒 Connexion requise</h2>
        <p>Connectez-vous pour voir vos billets</p>
        <Link to="/login" className="login-btn">Se connecter</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="tickets-loading">Chargement de vos billets...</div>;
  }

  if (error) {
    return <div className="tickets-error">{error}</div>;
  }

  return (
    <div className="my-tickets-container">
      <div className="tickets-header">
        <h1>Mes Billets</h1>
        <p>Gérez tous vos billets d'événements</p>
      </div>

      {tickets.length === 0 ? (
        <div className="tickets-empty">
          <div className="empty-icon">🎫</div>
          <h2>Aucun billet pour le moment</h2>
          <p>Vous n'avez pas encore acheté de billets</p>
          <Link to="/events" className="browse-btn">
            Découvrir les événements
          </Link>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <div className="ticket-info">
                  <h3>{ticket.event_title}</h3>
                  {getStatusBadge(ticket.status)}
                </div>
                <div className="ticket-number">
                  <span className="ticket-number-label">N°</span>
                  <span className="ticket-number-value">
                    {ticket.ticket_number.toString().slice(0, 8)}
                  </span>
                </div>
              </div>

              <div className="ticket-details">
                <div className="detail-row">
                  <span className="detail-icon">📅</span>
                  <div className="detail-content">
                    <span className="detail-label">Date</span>
                    <span className="detail-value">{formatDate(ticket.event_date)}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <span className="detail-icon">📍</span>
                  <div className="detail-content">
                    <span className="detail-label">Lieu</span>
                    <span className="detail-value">{ticket.event_location}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <span className="detail-icon">🎫</span>
                  <div className="detail-content">
                    <span className="detail-label">Quantité</span>
                    <span className="detail-value">{ticket.quantity} billet(s)</span>
                  </div>
                </div>

                <div className="detail-row">
                  <span className="detail-icon">💰</span>
                  <div className="detail-content">
                    <span className="detail-label">Prix total</span>
                    <span className="detail-value price">{ticket.total_price}€</span>
                  </div>
                </div>
              </div>

              <div className="ticket-footer">
                <span className="purchased-date">
                  Acheté le {new Date(ticket.purchased_at).toLocaleDateString('fr-FR')}
                </span>
                {ticket.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancelTicket(ticket.ticket_number)}
                    className="cancel-btn"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTickets;