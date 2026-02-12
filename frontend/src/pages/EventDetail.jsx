import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../contexts/AuthContext';
import './EventDetail.css';

function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${slug}/`);
      setEvent(response.data);
      setLoading(false);
    } catch (err) {
      setError('Événement introuvable');
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setPurchasing(true);
    try {
      await api.post('/tickets/', {
        event_id: event.id,
        quantity: quantity,
      });
      alert('Billet(s) acheté(s) avec succès !');
      navigate('/my-tickets');
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de l\'achat');
    } finally {
      setPurchasing(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="detail-loading">Chargement...</div>;
  }

  if (error || !event) {
    return (
      <div className="detail-error">
        <h2>😕 Événement introuvable</h2>
        <Link to="/events" className="back-btn">Retour aux événements</Link>
      </div>
    );
  }

  const totalPrice = event.price * quantity;

  return (
    <div className="event-detail-container">
      <Link to="/events" className="back-link">← Retour aux événements</Link>

      <div className="event-detail-hero">
        {event.cover_image && (
          <img src={event.cover_image} alt={event.title} className="hero-image" />
        )}
      </div>

      <div className="event-detail-content">
        <div className="event-main-info">
          <span className="detail-category">{event.category}</span>
          <h1>{event.title}</h1>
          
          <div className="event-meta">
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <div>
                <p className="meta-label">Date et heure</p>
                <p className="meta-value">{formatDate(event.start_date)}</p>
              </div>
            </div>

            <div className="meta-item">
              <span className="meta-icon">📍</span>
              <div>
                <p className="meta-label">Lieu</p>
                <p className="meta-value">{event.location}</p>
                <p className="meta-subvalue">{event.address}, {event.city}</p>
              </div>
            </div>

            <div className="meta-item">
              <span className="meta-icon">👤</span>
              <div>
                <p className="meta-label">Organisé par</p>
                <p className="meta-value">{event.organizer?.username || 'Organisateur'}</p>
              </div>
            </div>
          </div>

          <div className="event-description">
            <h2>À propos de cet événement</h2>
            <p>{event.description}</p>
          </div>

          <Link to={`/events/${event.slug}/chat`} className="chat-link-btn">
            💬 Rejoindre le chat de l'événement
          </Link>
        </div>

        <div className="event-booking-card">
          <div className="booking-price">
            <span className="price-label">Prix par billet</span>
            <span className="price-value">{event.price}€</span>
          </div>

          <div className="booking-availability">
            <span className="seats-available">{event.available_seats} places disponibles</span>
            <span className="seats-total">sur {event.capacity}</span>
          </div>

          {event.available_seats > 0 ? (
            <>
              <div className="quantity-selector">
                <label>Nombre de billets</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(event.available_seats, quantity + 1))}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="total-price">
                <span>Total</span>
                <span className="total-value">{totalPrice.toFixed(2)}€</span>
              </div>

              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="purchase-btn"
              >
                {purchasing ? 'Achat en cours...' : 'Acheter maintenant'}
              </button>
            </>
          ) : (
            <div className="sold-out">
              <p>❌ Événement complet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetail;