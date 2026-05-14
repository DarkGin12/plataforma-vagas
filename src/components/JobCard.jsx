import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import './JobCard.css';

const JobCard = memo(({ job, onApply, isApplied, canEdit, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/vaga/${job.id}`);
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-title-section">
          <h3 className="job-title">{job.title}</h3>
          <p className="job-company">{job.company}</p>
        </div>
        <span className="job-level">👨‍💻 Júnior</span>
      </div>

      <p className="job-description">
        {job.description.length > 150 
          ? `${job.description.substring(0, 150)}...` 
          : job.description}
      </p>

      <div className="job-meta">
        <div className="meta-item">
          <span className="meta-label">📍 Local:</span>
          <span className="meta-value">{job.location}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">💼 Tipo:</span>
          <span className="meta-value">{job.type === 'remoto' ? '🏠 Remoto' : '🏢 Presencial'}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">⏱️ Prazo:</span>
          <span className="meta-value">{job.deadline}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">💰 Salário:</span>
          <span className="meta-value">{job.salary}</span>
        </div>
        {job.institutionalEmail && (
          <div className="meta-item" style={{ gridColumn: '1 / -1' }}>
            <span className="meta-label">📧 Contato:</span>
            <span className="meta-value">
              <a href={`mailto:${job.institutionalEmail}`} style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}>
                {job.institutionalEmail}
              </a>
            </span>
          </div>
        )}
      </div>

      <div className="job-stacks">
        {job.stacks.map((stack, index) => (
          <span key={index} className="stack-tag">{stack}</span>
        ))}
      </div>

      <div className="job-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="footer-main-actions" style={{ display: 'flex', gap: '1rem', flex: 1 }}>
          <button 
            onClick={handleViewDetails} 
            className="view-details-btn"
            style={{ flex: 1 }}
          >
            Ver Detalhes
          </button>
          {!canEdit && (
            <button
              className={`apply-btn ${isApplied ? 'applied' : ''}`}
              onClick={() => onApply(job)}
              disabled={isApplied}
              style={{ flex: 1 }}
            >
              {isApplied ? '✓ Candidatado' : 'Candidatar-se'}
            </button>
          )}
        </div>
        
        {canEdit && (
          <div className="employer-actions" style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={onEdit} 
              className="edit-btn"
              style={{ 
                padding: '0.75rem 1.2rem', borderRadius: '6px', border: '1px solid var(--primary-color)', 
                backgroundColor: 'var(--card-bg)', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              ✏️ Editar
            </button>
            <button 
              onClick={onDelete} 
              className="delete-btn"
              style={{ 
                padding: '0.75rem 1.2rem', borderRadius: '6px', border: '1px solid #dc3545', 
                backgroundColor: 'var(--card-bg)', color: '#dc3545', cursor: 'pointer', fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              🗑️ Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

JobCard.displayName = 'JobCard';

export default JobCard;
