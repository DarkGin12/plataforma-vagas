import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <Header />

      <main className="home-content">
        <section className="hero">
          <div className="hero-content">
            <h1>Bem-vindo ao My First Job</h1>
            <p>A plataforma perfeita para iniciar sua carreira em tecnologia</p>
            <p className="hero-subtitle">Encontre vagas exclusivas para júnior e acompanhe seu progresso</p>

            <div className="hero-buttons">
              {isAuthenticated ? (
                <>
                  <button onClick={() => navigate('/vagas')} className="primary-btn">
                    Explorar Vagas →
                  </button>
                  <button onClick={() => navigate('/tarefas')} className="secondary-btn">
                    Minhas Tarefas
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/cadastro')} className="primary-btn">
                    Começar Agora →
                  </button>
                  <button onClick={() => navigate('/login')} className="secondary-btn">
                    Já tem conta?
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="hero-image">
            <div className="illustration">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
              <div className="circle circle-3"></div>
            </div>
          </div>
        </section>

        <section className="features">
          <h2>Por que escolher My First Job?</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Vagas Exclusivas</h3>
              <p>Acesso a vagas de nível júnior selecionadas especialmente para você</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Acompanhamento</h3>
              <p>Rastreie o progresso de cada candidatura com nossa ferramenta de tarefas</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Crescimento</h3>
              <p>Desenvolvemos seu potencial desde o primeiro dia na plataforma</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Comunidade</h3>
              <p>Conecte-se com outros profissionais iniciantes em tecnologia</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Oportunidades</h3>
              <p>Novas vagas adicionadas regularmente em diversas áreas</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Suporte</h3>
              <p>Equipe dedicada para ajudar você em cada etapa da jornada</p>
            </div>
          </div>
        </section>

        <section className="stats">
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Vagas Disponíveis</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Nível Júnior</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">Possibilidades</div>
          </div>
        </section>

        <section className="cta">
          <h2>Pronto para começar sua jornada?</h2>
          <p>Junte-se a centenas de profissionais que já encontraram suas primeiras oportunidades</p>
          <button onClick={() => navigate(isAuthenticated ? '/vagas' : '/cadastro')} className="cta-btn">
            {isAuthenticated ? 'Explorar Vagas' : 'Criar Conta Grátis'}
          </button>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 My First Job. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
