import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import { useJob } from '../context/JobContext';
import './Jobs.css';

const Jobs = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addTask, hasApplied } = useTask();
  const { jobs, addJob, updateJob, deleteJob, canEditJob } = useJob();
  
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);
  
  // Estado para o formulário de criação/edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    stacks: '',
    description: '',
    deadline: '',
    level: 'junior',
    location: '',
    type: 'remoto',
    salary: '',
    institutionalEmail: ''
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesType = filter === 'all' || job.type === filter;
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.company.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [jobs, filter, searchTerm]);

  const handleApply = useCallback((job) => {
    if (!isAuthenticated) {
      setMessage({
        type: 'error',
        text: '❌ Você precisa estar autenticado para se candidatar'
      });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (user?.role === 'employer') {
      setMessage({
        type: 'error',
        text: '❌ Empresas não podem se candidatar a vagas'
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      addTask(job, user.id);
      setMessage({
        type: 'success',
        text: `✅ Candidatura registrada! Veja em "Tarefas"`
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ ${error.message}`
      });
      setTimeout(() => setMessage(null), 3000);
    }
  }, [isAuthenticated, user, addTask, navigate]);

  const handleOpenModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        company: job.company,
        stacks: job.stacks.join(', '),
        description: job.description,
        deadline: job.deadline,
        level: job.level || 'junior',
        location: job.location,
        type: job.type,
        salary: job.salary,
        institutionalEmail: job.institutionalEmail || ''
      });
    } else {
      setEditingJob(null);
      setFormData({
        title: '',
        company: user?.name || '',
        stacks: '',
        description: '',
        deadline: '',
        level: 'junior',
        location: '',
        type: 'remoto',
        salary: '',
        institutionalEmail: user?.email || ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...formData,
        stacks: formData.stacks.split(',').map(s => s.trim()).filter(s => s !== '')
      };

      if (editingJob) {
        updateJob(editingJob.id, jobData);
        setMessage({ type: 'success', text: '✅ Vaga atualizada com sucesso!' });
      } else {
        addJob(jobData);
        setMessage({ type: 'success', text: '✅ Vaga criada com sucesso!' });
      }
      
      handleCloseModal();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Tem certeza que deseja excluir esta vaga?')) {
      try {
        deleteJob(jobId);
        setMessage({ type: 'success', text: '✅ Vaga excluída com sucesso!' });
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="jobs-page">
      <Header />

      <main className="jobs-container">
        <section className="jobs-header">
          <h1>Vagas Disponíveis</h1>
          <p>Todas as vagas são para nível <strong>Júnior</strong></p>
          
          {isAuthenticated && user?.role === 'employer' && (
            <button 
              onClick={() => handleOpenModal()} 
              className="cta-btn" 
              style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
            >
              + Criar Nova Vaga
            </button>
          )}
        </section>

        {message && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <section className="jobs-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Buscar por título ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas ({jobs.length})
            </button>
            <button
              className={`filter-btn ${filter === 'remoto' ? 'active' : ''}`}
              onClick={() => setFilter('remoto')}
            >
              🏠 Remoto ({jobs.filter(j => j.type === 'remoto').length})
            </button>
            <button
              className={`filter-btn ${filter === 'presencial' ? 'active' : ''}`}
              onClick={() => setFilter('presencial')}
            >
              🏢 Presencial ({jobs.filter(j => j.type === 'presencial').length})
            </button>
          </div>
        </section>

        <section className="jobs-list">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onApply={handleApply}
                isApplied={isAuthenticated && hasApplied(job.id, user?.id)}
                canEdit={canEditJob(job)}
                onEdit={() => handleOpenModal(job)}
                onDelete={() => handleDeleteJob(job.id)}
              />
            ))
          ) : (
            <div className="no-jobs">
              <p>😢 Nenhuma vaga encontrada</p>
              <button onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }} className="reset-btn">
                Limpar Filtros
              </button>
            </div>
          )}
        </section>

        {isAuthenticated && user?.role === 'developer' && (
          <section className="jobs-cta">
            <p>Já se candidatou? Acompanhe seu progresso em <strong>Tarefas</strong></p>
            <button onClick={() => navigate('/tarefas')} className="cta-btn">
              Ver Minhas Tarefas →
            </button>
          </section>
        )}
      </main>

      {/* Modal de Criação/Edição de Vaga */}
      {isModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--modal-overlay)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'var(--card-bg)',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: 'var(--shadow)',
            border: '1px solid var(--border-color)'
          }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
              {editingJob ? 'Editar Vaga' : 'Criar Nova Vaga'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Título da Vaga</label>
                <input 
                  type="text" name="title" value={formData.title} onChange={handleInputChange} required 
                  placeholder="Ex: Frontend React Developer"
                  style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Empresa</label>
                <input 
                  type="text" name="company" value={formData.company} onChange={handleInputChange} required 
                  style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Email Institucional</label>
                <input 
                  type="email" name="institutionalEmail" value={formData.institutionalEmail} onChange={handleInputChange} required 
                  placeholder="contato@empresa.com"
                  style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Stacks (separadas por vírgula)</label>
                <input 
                  type="text" name="stacks" value={formData.stacks} onChange={handleInputChange} required 
                  placeholder="React, JavaScript, CSS"
                  style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Localização</label>
                <input 
                  type="text" name="location" value={formData.location} onChange={handleInputChange} required 
                  placeholder="Ex: São Paulo, SP ou Remoto"
                  style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                  <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Tipo</label>
                  <select 
                    name="type" value={formData.type} onChange={handleInputChange}
                    style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                  >
                    <option value="remoto">Remoto</option>
                    <option value="presencial">Presencial</option>
                    <option value="hibrido">Híbrido</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                  <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Salário</label>
                  <input 
                    type="text" name="salary" value={formData.salary} onChange={handleInputChange} required 
                    placeholder="Ex: R$ 4.000,00"
                    style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Prazo para Inscrição</label>
                <input 
                  type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} required 
                  style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Descrição da Vaga</label>
                <textarea 
                  name="description" value={formData.description} onChange={handleInputChange} required 
                  rows="4" placeholder="Descreva as responsabilidades e requisitos..."
                  style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid var(--input-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" onClick={handleCloseModal}
                  style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {editingJob ? 'Salvar Alterações' : 'Criar Vaga'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
