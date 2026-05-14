import React, { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Alert from './Alert';
import './Header.css';

const Header = memo(() => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertJobId, setAlertJobId] = useState(1);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setNotificationCount(prev => prev + 1);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }, 8000); 

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  
  const handleShowAlert = () => {
    const randomJobId = Math.floor(Math.random() * 2) + 1; 
    setAlertJobId(randomJobId);
    setShowAlert(true);
    
    if (notificationCount > 0) {
      setNotificationCount(prev => prev - 1);
    }
    
    setIsShaking(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <>
      {showAlert && (
        <Alert
          type="info"
          title="Nova Oportunidade Disponível"
          message="Confira esta vaga que pode ser perfeita para você!"
          jobId={alertJobId}
          onClose={() => setShowAlert(false)}
          autoClose={true}
          duration={6000}
        />
      )}

      <header className="header">
        <div className="header-container">
          <button 
            onClick={() => handleNavigation('/')} 
            className="logo"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <span className="logo-icon"></span>
            <span className="logo-text">My First Job</span>
          </button>
          <nav className="nav">
            <button 
              onClick={() => handleNavigation('/')} 
              className="nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem' }}
            >
              Início
            </button>
            <button 
              onClick={() => handleNavigation('/vagas')} 
              className="nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem' }}
            >
              Vagas
            </button>
            {isAuthenticated && user?.role === 'developer' && (
              <button 
                onClick={() => handleNavigation('/tarefas')} 
                className="nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem' }}
              >
                Tarefas
              </button>
            )}
          </nav>
          <div className="header-actions">
            <div className="alert-button-wrapper">
              <button
                onClick={handleShowAlert}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`alert-button ${isShaking ? 'shake' : ''} ${isHovering ? 'hovering' : ''}`}
                title="Ver novas oportunidades"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  padding: '0.5rem',
                  marginRight: '1rem',
                  position: 'relative',
                  transition: 'transform 0.2s'
                }}
              >
                🔔
                {notificationCount > 0 && (
                  <span className="notification-badge">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className="theme-toggle"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '0.5rem',
                marginRight: '1rem'
              }}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {isAuthenticated ? (
              <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span 
                    className="user-badge"
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      backgroundColor: user?.role === 'employer' ? '#667eea' : '#10b981',
                      color: 'white'
                    }}
                  >
                    {user?.role === 'employer' ? 'Empresa' : 'Dev'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Sair
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleNavigation('/login')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/cadastro')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Cadastro
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
});

Header.displayName = 'Header';

export default Header;
