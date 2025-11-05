
// frontend-web/src/context/IncidentContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; // Ya se importa la instancia correcta
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
      // --- CORRECCIÓN #2: AUTENTICACIÓN DEL WEBSOCKET ---
      // Se añade el token a la configuración del socket antes de conectar.
      const token = localStorage.getItem('token');
      if (token) {
        socket.auth = { token };
        socket.connect();
      }

      // --- CORRECCIÓN #1: CARGA INICIAL CON API AUTENTICADA ---
      // Se utiliza la instancia 'api' que ya tiene el interceptor del token.
      api.get('/incidents')
        .then(response => {
          setIncidents(response.data);
        })
        .catch(error => {
          // Ahora los errores de autenticación serán manejados por el interceptor de api.js
          console.error("Error al cargar los incidentes:", error);
        })
        .finally(() => {
          setLoading(false);
        });

      const handleNewIncident = (newIncident) => {
        console.log("Socket IN: new_incident", newIncident);
        setIncidents(prev => [newIncident, ...prev]);
      };

      const handleIncidentDeleted = ({ id }) => {
        console.log(`Socket IN: incident_deleted (ID: ${id})`);
        setIncidents(prev => prev.filter(incident => incident.id !== id));
      };

      const handleIncidentUpdated = (updatedIncident) => {
        console.log("Socket IN: incident_updated", updatedIncident);
        setIncidents(prev => 
          prev.map(incident => 
            incident.id === updatedIncident.id ? updatedIncident : incident
          )
        );
      };

      socket.on('new_incident', handleNewIncident);
      socket.on('incident_deleted', handleIncidentDeleted);
      socket.on('incident_updated', handleIncidentUpdated);

      return () => {
        console.log("Desconectando socket y limpiando listeners...");
        socket.off('new_incident', handleNewIncident);
        socket.off('incident_deleted', handleIncidentDeleted);
        socket.off('incident_updated', handleIncidentUpdated);
        socket.disconnect();
      };
    } else {
      setLoading(false);
      setIncidents([]);
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
