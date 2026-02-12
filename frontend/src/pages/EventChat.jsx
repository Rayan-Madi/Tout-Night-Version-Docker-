import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getSocket } from '../sockets/socket';
import api from '../api/axiosConfig';
import { useAuth } from '../contexts/AuthContext';
import './EventChat.css';

function EventChat() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Charger l'événement
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${slug}/`);
        setEvent(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement événement:', error);
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  // Socket.IO - Rejoindre le chat
  useEffect(() => {
    if (!event || !isAuthenticated) return;

    const socket = getSocket();
    if (!socket) {
      console.error('❌ Socket non initialisé');
      return;
    }

    console.log('🎯 Rejoindre événement:', event.id);

    socket.emit('join_event', event.id);

    socket.on('previous_messages', (history) => {
      console.log('📜 Messages précédents reçus:', history);
      setMessages(history);
    });

    socket.on('new_message', (message) => {
      console.log('💬 Nouveau message reçu:', message);
      setMessages((prev) => [...prev, message]);
    });

    // Utilisateur rejoint
    socket.on('user_joined', (data) => {
      console.log('👥 Utilisateur rejoint:', data);
    });

    // Utilisateur quitté
    socket.on('user_left', (data) => {
      console.log('👋 Utilisateur quitté:', data);
    });

    // Nettoyage
    return () => {
      console.log('🚪 Quitter événement:', event.id);
      socket.emit('leave_event', event.id);
      socket.off('previous_messages');
      socket.off('new_message');
      socket.off('user_joined');
      socket.off('user_left');
    };
  }, [event, isAuthenticated]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Envoyer un message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    console.log('🔍 Debug envoi message:');
    console.log('  - eventId:', event?.id);
    console.log('  - message:', newMessage);
    console.log('  - user:', user);
    
    if (!newMessage.trim() || !isAuthenticated || !user) {
      console.warn('⚠️ Conditions non remplies pour envoyer');
      return;
    }

    const socket = getSocket();
    if (!socket) {
      console.error('❌ Socket non disponible');
      return;
    }

    console.log('📤 Envoi message...');
    
    socket.emit('send_message', {
      eventId: event.id,
      message: newMessage.trim(),
      userId: user.id,           
      username: user.username,   
    });

    setNewMessage('');
  };

  if (loading) {
    return <div className="chat-loading">Chargement...</div>;
  }

  if (!event) {
    return <div className="chat-error">Événement introuvable</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="chat-error">
        <h2>🔒 Connexion requise</h2>
        <p>Vous devez être connecté pour accéder au chat.</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>💬 Chat - {event.title}</h2>
        <p>{event.location} • {new Date(event.start_date).toLocaleDateString('fr-FR')}</p>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <p>Aucun message pour le moment.</p>
            <p>Soyez le premier à dire bonjour ! 👋</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`chat-message ${msg.userId === user?.id ? 'own-message' : ''}`}
            >
              <div className="message-header">
                <span className="message-author">{msg.username}</span>
                <span className="message-time">
                  {new Date(msg.timestamp || msg.created_at).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="message-content">{msg.message}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          className="chat-input"
        />
        <button type="submit" className="chat-send-btn">
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default EventChat;