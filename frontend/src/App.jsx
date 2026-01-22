import MyEvents from './pages/MyEvents';
import MyTickets from './pages/MyTickets';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import EventList from './pages/EventList';
import EventChat from './pages/EventChat';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          
          <Routes>
            <Route path="/" element={
              <div className="home-container">
                <header className="home-header">
                  <h1>🎉 Tout Night</h1>
                  <p>Architecture fullstack professionnelle</p>
                  <div className="status">
                    <span className="status-item">✅ Django REST API</span>
                    <span className="status-item">✅ Node.js WebSocket</span>
                    <span className="status-item">✅ React + Vite</span>
                  </div>
                </header>

                <div className="content">
                  <h2>Bienvenue sur Event Platform</h2>
                  <p>Votre plateforme de gestion d'événements en temps réel</p>
                  <div className="features">
                    <div className="feature">
                      <h3>🎫 Gestion d'événements</h3>
                      <p>Créez et gérez vos événements facilement</p>
                    </div>
                    <div className="feature">
                      <h3>💬 Chat en temps réel</h3>
                      <p>Communiquez instantanément avec les participants</p>
                    </div>
                    <div className="feature">
                      <h3>🔔 Notifications</h3>
                      <p>Recevez des alertes en temps réel</p>
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/events/:slug/chat" element={<EventChat />} />
            
            <Route path="/my-events" element={
              <div className="page-container">
                <h1>🎉 Mes Événements</h1>
                <p>Page en cours de développement...</p>
              </div>
            } />
            
            <Route path="/my-tickets" element={
              <div className="page-container">
                <h1>🎫 Mes Billets</h1>
                <p>Page en cours de développement...</p>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;