import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Email e senha são obrigatórios');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Email inválido');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Truque para facilitar testes: se o email contiver "empresa", loga como employer
      const role = formData.email.includes('empresa') ? 'employer' : 'developer';

      const userData = {
        email: formData.email,
        name: formData.email.split('@')[0],
        role: role
      };

      login(userData);
      navigate('/vagas');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <div className="auth-container">
        <div className="auth-card">
          <h1>Bem-vindo de Volta!</h1>
          <p>Faça login para acompanhar suas candidaturas</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Sua senha"
                disabled={loading}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="auth-footer">
            Não tem conta? <button 
              onClick={() => navigate('/cadastro')} 
              style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}
            >
              Criar conta
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
