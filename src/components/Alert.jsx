import React, { useState, useEffect } from 'react';
import { jobs } from '../data/jobs';
import './Alert.css';

const Alert = ({ 
  type = 'info', // 'success', 'error', 'warning', 'info'
  title = 'Notificação',
  message = '',
  jobId = 1, // ID da vaga que será buscada em jobs.js
  onClose = null,
  autoClose = true,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [jobData, setJobData] = useState(null);

  // Buscar dados da vaga do jobs.js (simulando busca em banco de dados)
  useEffect(() => {
    const foundJob = jobs.find(job => job.id === jobId);
    if (foundJob) {
      setJobData(foundJob);
    }
  }, [jobId]);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <div className="alert-icon">{getIcon()}</div>
        <div className="alert-body">
          <h4 className="alert-title">{title}</h4>
          <p className="alert-message">{message}</p>
          {jobData && (
            <div className="alert-job">
              <p className="alert-job-title">
                <strong>Vaga:</strong> {jobData.title}
              </p>
              <p className="alert-job-company">
                <strong>Empresa:</strong> {jobData.company}
              </p>
              <p className="alert-job-salary">
                <strong>Salário:</strong> {jobData.salary}
              </p>
            </div>
          )}
        </div>
        <button 
          className="alert-close" 
          onClick={handleClose}
          aria-label="Fechar alerta"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Alert;
