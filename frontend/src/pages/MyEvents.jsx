import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../contexts/AuthContext';
import './MyEvents.css';

function MyEvents() {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Vérifier si l'utilisateur peut créer des événements
  const canCreateEvents = ['organizer', 'moderator', 'admin'].includes(user?.role);

  useEffect(() => {
    if (isAuthenticated && canCreateEvents) {
      fetchMyEvents();
    }
  }, [isAuthenticated, canCreateEvents]);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events/my-events/');
      console.log('📦 Mes événements:', response.data);
      setEvents(response.data.results || response.data || []);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des événements');
      setLoading(false);
      console.error('Erreur:', err);
    }
  };

  const handleDeleteEvent = async (eventSlug) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet événement ?')) {
      return;
    }

    try {
      await api.delete(`/events/${eventSlug}/`);
      alert('Événement supprimé avec succès');
      fetchMyEvents();
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    if (now < startDate) {
      return { label: 'À venir', class: 'status-upcoming' };
    } else if (now >= startDate && now <= endDate) {
      return { label: 'En cours', class: 'status-ongoing' };
    } else {
      return { label: 'Terminé', class: 'status-finished' };
    }
  };

  const getRoleLabel = (role) => {
    const roleMap = {
      'user': 'Utilisateur / Fêtard',
      'organizer': 'Organisateur',
      'moderator': 'Modérateur',
      'admin': 'Administrateur'
    };
    return roleMap[role] || role;
  };

  if (!isAuthenticated) {
    return (
      <div className="events-error">
        <h2>🔒 Connexion requise</h2>
        <p>Connectez-vous pour gérer vos événements</p>
        <Link to="/login" className="login-btn">Se connecter</Link>
      </div>
    );
  }

  if (!canCreateEvents) {
    return (
      <div className="events-error">
        <h2>🚫 Accès refusé</h2>
        <p>Vous devez être organisateur pour accéder à cette page</p>
        <p>Votre rôle actuel : <strong>{getRoleLabel(user?.role)}</strong></p>
        <p>Contactez un administrateur pour devenir organisateur</p>
        <Link to="/events" className="back-btn">Découvrir les événements</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="events-loading">Chargement de vos événements...</div>;
  }

  if (error) {
    return <div className="events-error">{error}</div>;
  }

  return (
    <div className="my-events-container">
      <div className="events-header">
        <div>
          <h1>Mes Événements</h1>
          <p>Gérez tous vos événements créés</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-event-btn"
        >
          {showCreateForm ? '❌ Annuler' : '➕ Créer un événement'}
        </button>
      </div>

      {showCreateForm && <CreateEventForm onSuccess={() => {
        setShowCreateForm(false);
        fetchMyEvents();
      }} />}

      {events.length === 0 ? (
        <div className="events-empty">
          <div className="empty-icon">🎉</div>
          <h2>Aucun événement créé</h2>
          <p>Commencez par créer votre premier événement !</p>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="create-first-btn"
          >
            Créer mon premier événement
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => {
            console.log('🔍 Event ID:', event.id);
            console.log('🏷️ Event slug:', event.slug);
            console.log('📦 Event complet:', event);
            const status = getEventStatus(event);
            const soldPercentage = ((event.capacity - event.available_seats) / event.capacity * 100).toFixed(0);

            return (
              <div key={event.id} className="event-card">
                <div className="event-image">
                  {event.cover_image ? (
                    <img src={event.cover_image} alt={event.title} />
                  ) : (
                    <div className="no-image">🎉</div>
                  )}
                  <span className={`event-status ${status.class}`}>
                    {status.label}
                  </span>
                </div>

                <div className="event-content">
                  <div className="event-header-info">
                    <h3>{event.title}</h3>
                    <span className="event-category">{event.category}</span>
                  </div>

                  <div className="event-details">
                    <div className="detail-item">
                      <span className="icon">📅</span>
                      <span>{formatDate(event.start_date)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">💰</span>
                      <span>{event.price}€</span>
                    </div>
                  </div>

                  <div className="event-stats">
                    <div className="stat">
                      <span className="stat-label">Billets vendus</span>
                      <span className="stat-value">
                        {event.capacity - event.available_seats} / {event.capacity}
                      </span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${soldPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="event-actions">
                    <Link 
                      to={`/events/${event.slug}`}
                      className="action-btn view-btn"
                    >
                      👁️ Voir
                    </Link>
                    <Link 
                      to={`/events/${event.slug}/chat`}
                      className="action-btn chat-btn"
                    >
                      💬 Chat
                    </Link>
                    <Link 
                      to={`/events/${event.slug}/edit`}
                      className="action-btn edit-btn"
                    >
                      ✏️ Modifier
                    </Link>
                    <button
                      onClick={() => handleDeleteEvent(event.slug)}
                      className="action-btn delete-btn"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Composant pour créer un événement
function CreateEventForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'concert',
    start_date: '',
    end_date: '',
    location: '',
    address: '',
    city: '',
    capacity: '',
    price: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    const payload = {
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity, 10) : 0,
      price: formData.price ? parseFloat(formData.price) : 0,
    };

    const response = await api.post('/events/', payload);
    const createdEvent = response.data;
    
    console.log('✅ Event créé:', createdEvent);
    console.log('🔑 ID:', createdEvent.id);
    console.log('🏷️ Slug:', createdEvent.slug);
    
    alert('Événement créé avec succès !');
    onSuccess();
  } catch (err) {
    console.error('❌ Erreur:', err.response?.data);
    alert(err.response?.data?.error || 'Erreur lors de la création');
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="create-event-form">
      <h2>Créer un nouvel événement</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Titre *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Concert de musique"
            />
          </div>

          <div className="form-group">
            <label>Catégorie *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="concert">Concert</option>
              <option value="conference">Conférence</option>
              <option value="festival">Festival</option>
              <option value="sport">Sport</option>
              <option value="exposition">Exposition</option>
              <option value="autre">Autre</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Décrivez votre événement..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date de début *</label>
            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date de fin *</label>
            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Lieu *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Nom du lieu"
            />
          </div>

          <div className="form-group">
            <label>Ville *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Paris"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Adresse *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="123 Rue de la République"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Capacité *</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
              placeholder="100"
            />
          </div>

          <div className="form-group">
            <label>Prix (€) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="25.00"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={submitting} className="submit-btn">
            {submitting ? 'Création...' : 'Créer l\'événement'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MyEvents;