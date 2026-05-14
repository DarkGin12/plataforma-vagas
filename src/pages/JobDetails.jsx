import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useJob } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import './Jobs.css'; // Reutilizando estilos de Jobs para manter o padrão

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs } = useJob();
  const { user, isAuthenticated } = useAuth();
  const { addTask, hasApplied } = useTask();

  const job = useMemo(() => {
    return jobs.find(j => String(j.id) === String(id));
  }, [jobs, id]);

  if (!job) {
    return (
      <div className="jobs-page">
        <Header />
        <main className="jobs-container">
          <div className="no-jobs">
            <p>😢 Vaga não encontrada</p>
            <button onClick={() => navigate('/vagas')} className="reset-btn">
              Voltar para Vagas
            </button>
          </div>
        </main>
      </div>
    );
  }

  const isApplied = isAuthenticated && hasApplied(job.id, user?.id);

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role === 'employer') {
      alert('Empresas não podem se candidatar a vagas');
      return;
    }

    try {
      addTask(job, user.id);
      alert('Candidatura registrada com sucesso!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="jobs-page">
      <Header />
      <main className="jobs-container">
        <section className="jobs-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <button 
            onClick={() => navigate('/vagas')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--primary-color)', 
              cursor: 'pointer', 
              padding: 0, 
              marginBottom: '1rem',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ← Voltar para Vagas
          </button>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{job.title}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--primary-color)', fontWeight: '600' }}>{job.company}</p>
        </section>

        <div className="jobs-filters" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>📍 Localização</h4>
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{job.location}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>🕒 Tipo</h4>
              <p style={{ fontSize: '1.1rem', fontWeight: '500', textTransform: 'capitalize' }}>{job.type}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>💰 Salário</h4>
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{job.salary}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>📅 Prazo</h4>
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{job.deadline}</p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>📝 Descrição da Vaga</h4>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{job.description}</p>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>🛠️ Stacks</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {job.stacks.map((stack, index) => (
                <span 
                  key={index} 
                  style={{ 
                    backgroundColor: 'var(--tag-bg)', 
                    color: 'var(--tag-text)', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '20px', 
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {stack}
                </span>
              ))}
            </div>
          </div>

          {job.institutionalEmail && (
            <div>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>📧 Contato</h4>
              <a 
                href={`mailto:${job.institutionalEmail}`} 
                style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500', fontSize: '1.1rem' }}
              >
                {job.institutionalEmail}
              </a>
            </div>
          )}

          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={handleApply}
              disabled={isApplied}
              style={{ 
                padding: '1rem 2.5rem', 
                borderRadius: '8px', 
                border: 'none', 
                background: isApplied ? 'var(--text-secondary)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white', 
                fontWeight: 'bold', 
                fontSize: '1.1rem',
                cursor: isApplied ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => !isApplied && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => !isApplied && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {isApplied ? '✓ Já Candidatado' : 'Candidatar-se para esta Vaga'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetails;
