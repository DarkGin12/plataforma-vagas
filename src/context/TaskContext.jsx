import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useJob } from './JobContext';

const TaskContext = createContext();

// Função auxiliar para converter deadline em data
const parseDeadline = (deadline, createdAt) => {
  if (!deadline) return null;
  
  // Se for uma data ISO (YYYY-MM-DD)
  if (deadline.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return new Date(deadline);
  }
  
  // Se for um formato de dias (ex: "7 dias")
  const daysMatch = deadline.match(/(\d+)\s*dias?/i);
  if (daysMatch) {
    const days = parseInt(daysMatch[1], 10);
    const createdDate = new Date(createdAt);
    const deadlineDate = new Date(createdDate);
    deadlineDate.setDate(deadlineDate.getDate() + days);
    return deadlineDate;
  }
  
  return null;
};

// Função para verificar se uma tarefa expirou
const isTaskExpired = (task, job) => {
  const deadline = parseDeadline(job?.deadline || task.deadline, task.createdAt);
  if (!deadline) return false;
  
  const now = new Date();
  return now > deadline;
};

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const { jobs } = useJob();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        localStorage.removeItem('tasks');
      }
    }
    setLoading(false);
  }, []);

  // Efeito para remover tarefas expiradas automaticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks => {
        return prevTasks.filter(task => {
          const job = jobs.find(j => j.id === task.jobId);
          return !isTaskExpired(task, job);
        });
      });
    }, 60000); // Verifica a cada 1 minuto

    return () => clearInterval(interval);
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (job, userId) => {
    const alreadyExists = tasks.some(
      task => task.jobId === job.id && task.userId === userId
    );

    if (alreadyExists) {
      throw new Error('Você já se candidatou para esta vaga');
    }

    const newTask = {
      id: `task_${Date.now()}`,
      jobId: job.id,
      userId: userId,
      jobTitle: job.title,
      company: job.company,
      description: job.description,
      deadline: job.deadline, // Armazenar deadline da vaga
      progress: 0,
      status: 'candidatado',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: ''
    };

    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTaskProgress = (taskId, progress) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const status = progress === 100 ? 'concluido' : 'em_progresso';
        return {
          ...task,
          progress,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    }));
  };

  const updateTaskNotes = (taskId, notes) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          notes,
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    }));
  };

  const getUserTasks = (userId) => {
    return tasks.filter(task => {
      if (task.userId !== userId) return false;
      
      // Filtrar tarefas expiradas
      const job = jobs.find(j => j.id === task.jobId);
      return !isTaskExpired(task, job);
    });
  };

  const hasApplied = (jobId, userId) => {
    return tasks.some(task => task.jobId === jobId && task.userId === userId);
  };

  const getTask = (taskId) => {
    return tasks.find(task => task.id === taskId);
  };

  // deleteTask foi removido - tarefas não podem ser deletadas manualmente
  // Elas são removidas automaticamente quando o prazo expira

  const getUserStats = (userId) => {
    const userTasks = getUserTasks(userId);
    return {
      total: userTasks.length,
      concluidas: userTasks.filter(t => t.status === 'concluido').length,
      em_progresso: userTasks.filter(t => t.status === 'em_progresso').length,
      candidatadas: userTasks.filter(t => t.status === 'candidatado').length
    };
  };

  const value = {
    tasks,
    loading,
    addTask,
    updateTaskProgress,
    updateTaskNotes,
    getUserTasks,
    hasApplied,
    getTask,
    getUserStats,
    isTaskExpired,
    parseDeadline
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask deve ser usado dentro de TaskProvider');
  }
  return context;
};
