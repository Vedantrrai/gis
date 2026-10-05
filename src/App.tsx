import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Overview } from './pages/Overview';
import { ChangeDetection } from './pages/ChangeDetection';
import { InteractiveMap } from './pages/InteractiveMap';
import { HistoricalAnalysis } from './pages/HistoricalAnalysis';
import { Reports } from './pages/Reports';
import { AnalysisRequest, AnalysisResponse } from './types/analysis';
import { AnalysisService } from './services/analysisService';
import { DEFAULT_ANALYSIS_RESULT } from './data/demoData';

export const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  
  // Backend & Demo State
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [demoMode, setDemoMode] = useState<boolean>(true); // default to demo mode so UI is immediately rich and functional
  const [backendError, setBackendError] = useState<string | null>(null);

  // Analysis State
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResponse>(DEFAULT_ANALYSIS_RESULT);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
  const [progressStep, setProgressStep] = useState<string>('');

  // Check backend health on mount
  const checkHealth = useCallback(async () => {
    const health = await AnalysisService.checkBackendHealth();
    setIsBackendOnline(health.online);
    if (!health.online && !demoMode) {
      setBackendError(`Cannot reach inference API (${health.message}). Switched to Demo Simulation.`);
      setDemoMode(true);
    } else if (health.online) {
      setBackendError(null);
    }
  }, [demoMode]);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Handle running an analysis
  const handleRunAnalysis = async (request: AnalysisRequest) => {
    setIsLoadingAnalysis(true);
    setBackendError(null);

    // Multi-step progress simulation feedback
    setProgressStep('Fetching bi-temporal satellite scenes...');
    await new Promise(r => setTimeout(r, 600));

    setProgressStep('Co-registering multispectral bands & radiometric calibration...');
    await new Promise(r => setTimeout(r, 700));

    setProgressStep('Running Self-Supervised Vision Transformer inference...');
    await new Promise(r => setTimeout(r, 900));

    if (!demoMode && isBackendOnline) {
      // Try real backend API
      const { data, error } = await AnalysisService.submitAnalysis(request);
      if (error) {
        setBackendError(error.message);
        setIsLoadingAnalysis(false);
        return;
      }
      if (data) {
        setCurrentAnalysis(data);
      }
    } else {
      // Demo simulation mode
      const simulated = AnalysisService.getSimulatedAnalysis(request);
      setCurrentAnalysis(simulated);
    }

    setProgressStep('Polygons vectorized and land-use classified.');
    await new Promise(r => setTimeout(r, 400));
    setIsLoadingAnalysis(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F7F8FA] text-[#17191D] flex">
        {/* Desktop Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          isBackendOnline={isBackendOnline}
          demoMode={demoMode}
          setDemoMode={setDemoMode}
        />

        {/* Mobile Sidebar Backdrop & Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div 
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-10 w-60">
              <Sidebar
                collapsed={false}
                setCollapsed={() => {}}
                isBackendOnline={isBackendOnline}
                demoMode={demoMode}
                setDemoMode={setDemoMode}
              />
            </div>
          </div>
        )}

        {/* Main Workspace Content Area */}
        <div 
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
          }`}
        >
          {/* Topbar */}
          <Topbar
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            isBackendOnline={isBackendOnline}
            onRefreshBackendHealth={checkHealth}
            demoMode={demoMode}
          />

          {/* Main Router Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            <Routes>
              <Route 
                path="/" 
                element={
                  <Overview
                    currentAnalysis={currentAnalysis}
                    onRunAnalysis={handleRunAnalysis}
                    isLoading={isLoadingAnalysis}
                    progressStep={progressStep}
                    isBackendOnline={isBackendOnline}
                    demoMode={demoMode}
                    setDemoMode={setDemoMode}
                    errorMessage={backendError}
                    onRetry={() => handleRunAnalysis({
                      location: currentAnalysis.location,
                      before_year: currentAnalysis.before_year,
                      after_year: currentAnalysis.after_year,
                      dataset: currentAnalysis.dataset,
                    })}
                  />
                } 
              />
              <Route 
                path="/change-detection" 
                element={
                  <ChangeDetection
                    currentAnalysis={currentAnalysis}
                    onRunAnalysis={handleRunAnalysis}
                    isLoading={isLoadingAnalysis}
                    demoMode={demoMode}
                  />
                } 
              />
              <Route 
                path="/interactive-map" 
                element={
                  <InteractiveMap
                    currentAnalysis={currentAnalysis}
                  />
                } 
              />
              <Route 
                path="/historical" 
                element={<HistoricalAnalysis />} 
              />
              <Route 
                path="/reports" 
                element={
                  <Reports
                    currentAnalysis={currentAnalysis}
                  />
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};
export default App;
