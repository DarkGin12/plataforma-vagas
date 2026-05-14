import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import './Tasks.css';

const Tasks = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { getUserTasks, updateTaskProgress, getUserStats, isTaskExpired, parseDeadline } = useTask();
  const [filter, setFilter] = useState('all');
  const [expandedTask, setExpandedTask] = useState(null);

  const userTasks = useMemo(() => {
    if (!user?.id) return [];
    return getUserTasks(user.id);
  }, [user?.id, getUserTasks]);

  const stats = useMemo(() => {
    if (!user?.id) return { total: 0, concluidas: 0, em_progresso: 0, candidatadas: 0 };
    return getUserStats(user.id);
  }, [user?.id, getUserStats]);

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return userTasks;
    return userTasks.filter(task => task.status === filter);
  }, [userTasks, filter]);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleProgressChange = (taskId, newProgress) => {
    updateTaskProgress(taskId, newProgress);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'candidatado':
        return '#667eea';
      case 'em_progresso':
        return '#ffa500';
      case 'concluido':
        return '#4caf50';
      default:
        return '#999';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'candidatado':
        return '📝 Candidatado';
      case 'em_progresso':
        return '⏳ Em Progresso';
      case 'concluido':
        return '✅ Concluído';
      default:
        return status;
    }
  };

  return (
    <div className="tasks-page">
      <Header />

      <main className="tasks-container">
        <section className="tasks-header">
          <h1>📋 Minhas Tarefas</h1>
          <p>Acompanhe o progresso de suas candidaturas</p>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total de Candidaturas</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--primary-color)' }}>{stats.candidatadas}</div>
            <div className="stat-label">Candidatadas</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#ffa500' }}>{stats.em_progresso}</div>
            <div className="stat-label">Em Progresso</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#4caf50' }}>{stats.concluidas}</div>
            <div className="stat-label">Concluídas</div>
          </div>
        </section>

        <section className="tasks-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas ({userTasks.length})
          </button>
          <button
            className={`filter-btn ${filter === 'candidatado' ? 'active' : ''}`}
            onClick={() => setFilter('candidatado')}
          >
            📝 Candidatadas ({stats.candidatadas})
          </button>
          <button
            className={`filter-btn ${filter === 'em_progresso' ? 'active' : ''}`}
            onClick={() => setFilter('em_progresso')}
          >
            ⏳ Em Progresso ({stats.em_progresso})
          </button>
          <button
            className={`filter-btn ${filter === 'concluido' ? 'active' : ''}`}
            onClick={() => setFilter('concluido')}
          >
            ✅ Concluídas ({stats.concluidas})
          </button>
        </section>

        <section className="tasks-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <div className="task-title-section">
                    <h3 className="task-title">{task.jobTitle}</h3>
                    <p className="task-company">{task.company}</p>
                  </div>
                  <span className="task-status" style={{ backgroundColor: getStatusColor(task.status) }}>
                    {getStatusLabel(task.status)}
                  </span>
                </div>

                <p className="task-description">{task.description}</p>

                <div className="progress-section">
                  <div className="progress-header">
                    <span className="progress-label">Progresso da Candidatura</span>
                    <span className="progress-percentage" style={{ color: 'var(--primary-color)' }}>{task.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="progress-controls">
                  <button
                    className={`progress-btn ${task.progress === 0 ? 'active' : ''}`}
                    onClick={() => handleProgressChange(task.id, 0)}
                  >
                    0%
                  </button>
                  <button
                    className={`progress-btn ${task.progress === 25 ? 'active' : ''}`}
                    onClick={() => handleProgressChange(task.id, 25)}
                  >
                    25%
                  </button>
                  <button
                    className={`progress-btn ${task.progress === 50 ? 'active' : ''}`}
                    onClick={() => handleProgressChange(task.id, 50)}
                  >
                    50%
                  </button>
                  <button
                    className={`progress-btn ${task.progress === 75 ? 'active' : ''}`}
                    onClick={() => handleProgressChange(task.id, 75)}
                  >
                    75%
                  </button>
                  <button
                    className={`progress-btn ${task.progress === 100 ? 'active' : ''}`}
                    onClick={() => handleProgressChange(task.id, 100)}
                  >
                    100% ✅
                  </button>
                </div>

                <div className="task-actions">
                  <button
                    className="expand-btn"
                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                  >
                    {expandedTask === task.id ? '▼ Menos' : '▶ Mais'}
                  </button>
                </div>

                {expandedTask === task.id && (
                  <div className="task-details">
                    <div className="detail-item">
                      <span className="detail-label">Data de Candidatura:</span>
                      <span className="detail-value">
                        {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Última Atualização:</span>
                      <span className="detail-value">
                        {new Date(task.updatedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-tasks">
              <p>😴 Nenhuma tarefa encontrada</p>
              <button onClick={() => navigate('/vagas')} className="new-task-btn">
                Explorar Vagas →
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Tasks;
