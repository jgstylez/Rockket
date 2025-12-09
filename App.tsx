import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Platform from './Platform';
import MarketingLayout from './components/marketing/layout/MarketingLayout';
import Home from './components/marketing/pages/Home';
import Features from './components/marketing/pages/Features';
import Pricing from './components/marketing/pages/Pricing';
import AuthPage from './components/auth/AuthPage';
import OnboardingPage from './components/auth/OnboardingPage';
import { useMission } from './context/MissionContext';

const PrivateRoute = () => {
    const { user, onboardingCompleted } = useMission();

    if (!user) return <Navigate to="/auth" replace />;
    if (!onboardingCompleted) return <Navigate to="/onboarding" replace />;

    return <Outlet />;
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Marketing Routes */}
                <Route element={<MarketingLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/pricing" element={<Pricing />} />
                </Route>

                {/* Auth Flow */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />

                {/* Platform Routes - Protected */}
                <Route element={<PrivateRoute />}>
                    <Route path="/platform/*" element={<Platform />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
