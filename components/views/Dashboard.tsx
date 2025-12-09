import React from 'react';
import { View } from '../../types';
import { useMission } from '../../context/MissionContext';
import GenesisMode from './dashboard/GenesisMode';
import IgnitionMode from './dashboard/IgnitionMode';
import VelocityMode from './dashboard/VelocityMode';

interface DashboardProps {
  onNavigate?: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { stage } = useMission();

  return (
    <div className="animate-fade-in relative h-full">
      {stage === 'ideation' && <GenesisMode onNavigate={onNavigate} />}
      {stage === 'setup' && <IgnitionMode onNavigate={onNavigate} />}
      {stage === 'growth' && <VelocityMode />}
    </div>
  );
};

export default Dashboard;