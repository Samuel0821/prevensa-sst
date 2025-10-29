
// frontend-web/src/context/IncidentContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import socket from '../socket';
import { useAuth } from './AuthContext';

const IncidentContext = createContext();

export function useIncidents() {
  return useContext(IncidentContext);
}

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socket.connect();

      // Carga inicial
      api.get('/incidents')
        .then(response => {
          setIncidents(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error al cargar los incidentes:", error);
          setLoading(false);
        });

      // --- LISTENERS DE WEBSOCKET ---

      // 1. Alguien crea un nuevo incidente
      const handleNewIncident = (newIncident) => {
        console.log("Socket IN: new_incident", newIncident);
        setIncidents(prev => [newIncident, ...prev]);
      };

      // 2. Alguien elimina un incidente
      const handleIncidentDeleted = ({ id }) => {
        console.log(`Socket IN: incident_deleted (ID: ${id})`);
        setIncidents(prev => prev.filter(incident => incident.id !== id));
      };

      // 3. Alguien actualiza un incidente
      const handleIncidentUpdated = (updatedIncident) => {
        console.log("Socket IN: incident_updated", updatedIncident);
        setIncidents(prev => 
          prev.map(incident => 
            incident.id === updatedIncident.id ? updatedIncident : incident
          )
        );
      };

      // Registrar los listeners
      socket.on('new_incident', handleNewIncident);
      socket.on('incident_deleted', handleIncidentDeleted);
      socket.on('incident_updated', handleIncidentUpdated);

      // Limpieza al desmontar el componente
      return () => {
        console.log("Desconectando socket y limpiando listeners...");
        socket.off('new_incident', handleNewIncident);
        socket.off('incident_deleted', handleIncidentDeleted);
        socket.off('incident_updated', handleIncidentUpdated);
        socket.disconnect();
      };
    }
  }, [user]);

  const value = {
    incidents,
    loading,
  };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
}
