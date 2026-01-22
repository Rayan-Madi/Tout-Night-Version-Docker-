import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import './EventList.css';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [search, category]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const response = await api.get('/events/', { params });
      setEvents(response.data.results || response.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des événements');
      console.error(err);
    } finally {
      setLoading(false);
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

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h1>Découvrez nos événements</h1>
        <p>Trouvez l'événement parfait pour vous</p>
      </div>

      <div className="event-filters">
        <input
          type="text"
          placeholder="Rechercher un événement..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="">Toutes les catégories</option>
          <option value="conference">Conférence</option>
          <option value="concert">Concert</option>
          <option value="sport">Sport</option>
          <option value="workshop">Atelier</option>
          <option value="festival">Festival</option>
          <option value="other">Autre</option>
        </select>
      </div>

      {loading && <p className="loading">Chargement...</p>}
      {error && <p className="error">{error}</p>}

      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            {event.cover_image && (
              <img
                src={event.cover_image}
                alt={event.title}
                className="event-image"
              />
            )}
            <div className="event-content">
              <span className="event-category">{event.category}</span>
              <h3>{event.title}</h3>
              <p className="event-date">📅 {formatDate(event.start_date)}</p>
              <p className="event-location">📍 {event.location}, {event.city}</p>
              <div className="event-footer">
                <span className="event-price">{event.price}€</span>
                <span className="event-seats">
                  {event.available_seats} / {event.capacity} places
                </span>
              </div>
              <div className="event-actions">
                <Link to={`/events/${event.slug}`} className="event-btn event-btn-details">
                  Voir détails
                </Link>
                <Link to={`/events/${event.slug}/chat`} className="event-btn event-btn-chat">
                  💬 Chat
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && !loading && (
        <p className="no-events">Aucun événement trouvé</p>
      )}
    </div>
  );
}

export default EventList;