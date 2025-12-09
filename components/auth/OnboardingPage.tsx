import React from 'react';
import { useNavigate } from 'react-router-dom';
import Onboarding from '../views/Onboarding';
import { useMission } from '../../context/MissionContext';
import { Stage } from '../../types';

const OnboardingPage: React.FC = () => {
    const navigate = useNavigate();
    const { setStage, setOnboardingCompleted } = useMission();

    const handleCompletion = (data: { stage: Stage }) => {
        // Save to context
        setStage(data.stage);
        setOnboardingCompleted(true);

        // Navigate to platform
        navigate('/platform');
    };

    return (
        <div className="bg-slate-950 min-h-screen">
            <Onboarding onComplete={handleCompletion} />
        </div>
    );
};

export default OnboardingPage;
