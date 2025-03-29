'use client';

import { createContext, useContext, useState } from 'react';
import { useDeviceId } from '../hooks/useDeviceId';

interface TeamContextType {
  team1: string;
  team2: string;
  setTeam1: (name: string) => void;
  setTeam2: (name: string) => void;
  deviceId: string | null;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [team1, setTeam1] = useState('Team 1');
  const [team2, setTeam2] = useState('Team 2');
  const { deviceId } = useDeviceId();

  return (
    <TeamContext.Provider value={{ team1, team2, setTeam1, setTeam2, deviceId }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeams() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeams must be used within a TeamProvider');
  }
  return context;
}
