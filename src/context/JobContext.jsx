import React, { createContext, useContext, useState, useEffect } from 'react';
import { jobs as initialJobs } from '../data/jobs';
import { useAuth } from './AuthContext';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedJobs = localStorage.getItem('custom_jobs');
    let customJobs = [];
    if (storedJobs) {
      try {
        customJobs = JSON.parse(storedJobs);
      } catch (error) {
        console.error('Erro ao carregar vagas customizadas:', error);
      }
    }
    
    // Combinar vagas iniciais com as customizadas do localStorage
    // Garantir que as iniciais não tenham createdBy para diferenciá-las se necessário
    const allJobs = [...initialJobs, ...customJobs];
    setJobs(allJobs);
    setLoading(false);
  }, []);

  const saveCustomJobs = (allJobs) => {
    const customJobs = allJobs.filter(job => job.createdBy);
    localStorage.setItem('custom_jobs', JSON.stringify(customJobs));
  };

  const addJob = (jobData) => {
    if (user?.role !== 'employer') {
      throw new Error('Apenas empresas podem criar vagas');
    }

    const newJob = {
      ...jobData,
      id: `job_${Date.now()}`,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };

    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    saveCustomJobs(updatedJobs);
    return newJob;
  };

  const updateJob = (jobId, jobData) => {
    const job = jobs.find(j => j.id === jobId);
    
    if (!job) throw new Error('Vaga não encontrada');
    if (job.createdBy !== user?.id) {
      throw new Error('Você não tem permissão para editar esta vaga');
    }

    const updatedJobs = jobs.map(j => 
      j.id === jobId ? { ...j, ...jobData, updatedAt: new Date().toISOString() } : j
    );

    setJobs(updatedJobs);
    saveCustomJobs(updatedJobs);
  };

  const deleteJob = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    
    if (!job) throw new Error('Vaga não encontrada');
    if (job.createdBy !== user?.id) {
      throw new Error('Você não tem permissão para excluir esta vaga');
    }

    const updatedJobs = jobs.filter(j => j.id !== jobId);
    setJobs(updatedJobs);
    saveCustomJobs(updatedJobs);
  };

  const canEditJob = (job) => {
    return user?.role === 'employer' && job.createdBy === user?.id;
  };

  const value = {
    jobs,
    loading,
    addJob,
    updateJob,
    deleteJob,
    canEditJob
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export const useJob = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJob deve ser usado dentro de JobProvider');
  }
  return context;
};
