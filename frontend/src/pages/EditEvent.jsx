import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../contexts/AuthContext';

function EditEvent() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'concert',
    start_date: '',
    end_date: '',
    location: '',
    address: '',
    city: '',
    country: 'France',
    capacity: '',
    price: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchEvent();
  }, [slug, isAuthenticated]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${slug}/`);
      const event = response.data;
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        category: event.category || 'concert',
        start_date: formatDateForInput(event.start_date),
        end_date: formatDateForInput(event.end_date),
        location: event.location || '',
        address: event.address || '',
        city: event.city || '',
        country: event.country || 'France',
        capacity: event.capacity || '',
        price: event.price || '',
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Erreur chargement événement:', err);
      setError("Impossible de charger l'événement");
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // ✅ Formatter les dates correctement
      const formatDate = (dateStr) => {
        if (!dateStr) return null;
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) return dateStr;
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) return `${dateStr}:00`;
        return dateStr;
      };

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        address: formData.address || '',
        city: formData.city,
        country: formData.country || 'France',
        capacity: parseInt(formData.capacity, 10),
        price: parseFloat(formData.price),
        start_date: formatDate(formData.start_date),
        end_date: formatDate(formData.end_date),
      };

      console.log('📤 Payload envoyé:', payload);

      const response = await api.patch(`/events/${slug}/`, payload);
      console.log('✅ Succès:', response.data);

      alert('Événement modifié avec succès !');
      navigate(`/events/${slug}`);

    } catch (err) {
      console.error('❌ Status:', err.response?.status);
      console.error('❌ Erreur data:', err.response?.data);

      // ✅ Afficher l'erreur lisible
      let errorMessage = 'Erreur lors de la modification :\n\n';
      if (err.response?.data) {
        Object.entries(err.response.data).forEach(([key, val]) => {
          errorMessage += `• ${key}: ${Array.isArray(val) ? val.join(', ') : val}\n`;
        });
      }

      setError(errorMessage);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

    try {
      await api.delete(`/events/${slug}/`);
      alert('Événement supprimé');
      navigate('/my-events');
    } catch (err) {
      console.error('❌ Erreur suppression:', err.response?.data);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'white' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'white' }}>
        <h2>❌ {error}</h2>
        <button onClick={() => navigate('/my-events')}>Retour</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>✏️ Modifier l'événement</h1>
      
      {/* ✅ Affichage de l'erreur */}
      {error && (
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(255,0,0,0.2)', 
          border: '1px solid red',
          borderRadius: '8px',
          marginBottom: '1rem',
          color: '#ff9999',
          whiteSpace: 'pre-line'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Titre */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'white' }}>
            Titre *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', fontSize: '1rem', border: '1px solid #444', background: 'rgba(255,255,255,0.1)', color: 'white' }}
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'white' }}>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', fontSize: '1rem', border: '1px solid #444', background: 'rgba(255,255,255,0.1)', color: 'white' }}
          />
        </div>

        {/* Catégorie */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'white' }}>
            Catégorie *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', fontSize: '1rem', border: '1px solid #444', background: '#1a1f3a', color: 'white' }}
          >
            <option value="concert">Concert</option>
            <option value="conference">Conférence</option>
            <option value="sport">Sport</option>
            <option value="workshop">Atelier</option>
            <option value="festival">Festival</option>
            <option value="theatre">Théâtre</option>
            <option value="exposition">Exposition</option>
            <option value="spectacle">Spectacle</option>
            <option value="salon">Salon</option>
            <option value="gastronomie">Gastronomie</option>
            <option value="cinema">Cinéma</option>
            <option value="humour">Humour</option>
            <option value="other">Autre</option>
          </select>
        </div>

        {/* Dates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'white' }}>
              Date début *
            </label>
            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', fontSize: '1rem', border: '1px solid #444', background: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'white' }}>
              Date fin *
            </label>
            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', fontSize: '1rem', border: '1px solid #444', background: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>
        </div>

        {/* Lieu */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'white' }}>
            Lieu *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', fontSize: '1rem', border: '1px solid #444', background: 'rgba(255,255,255,0.1)', color: 'white' }}
          />
        </div>

        {/* Adresse */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'white' }}>
            Adresse
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', fontSize: '1rem', border: '1px solid #444', background: 'rgba(255,255,255,0.1)', color: 'white' }}
          />
        </div>

        {/* Ville */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'white' }}>
            Ville *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', fontSize: '1rem', border: '1px solid #444', background: 'rgba(255,255,255,0.1)', color: 'white' }}
          />
        </div>

        {/* Capacité et Prix */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'white' }}>
              Capacité *
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', fontSize: '1rem', border: '1px solid #444', background: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'white' }}>
              Prix (€) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', fontSize: '1rem', border: '1px solid #444', background: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              flex: 1,
              padding: '1rem',
              background: saving ? '#555' : 'linear-gradient(135deg, #d4af37, #ff9500)',
              color: saving ? '#999' : '#0a0e27',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? '⏳ Enregistrement...' : '✅ Enregistrer les modifications'}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            style={{
              padding: '1rem 2rem',
              background: 'rgba(220, 38, 38, 0.8)',
              color: 'white',
              border: '1px solid #dc2626',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🗑️ Supprimer
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/events/${slug}`)}
          style={{
            padding: '0.75rem',
            background: 'transparent',
            color: '#aaa',
            border: '1px solid #444',
            borderRadius: '8px',
            fontSize: '0.9375rem',
            cursor: 'pointer'
          }}
        >
          ← Annuler
        </button>
      </form>
    </div>
  );
}

export default EditEvent;