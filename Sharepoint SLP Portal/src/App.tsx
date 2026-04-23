import React, { useState, Suspense } from "react";
import { DocumentContent } from "./data/documents";
import { SearchProvider } from "./context/SearchContext";
import { OnlineStatusProvider } from "./context/OnlineStatusContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AIProvider } from "./context/AIContext";
import { DashboardProvider, useDashboard } from "./context/DashboardContext";
import { ClinicalSafetyProvider } from "./context/ClinicalSafetyContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/layout/Layout";
import { ViewManager } from "./components/router/ViewManager";
import { DocumentViewer } from "./components/DocumentViewer";

export default function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <OnlineStatusProvider>
          <SearchProvider>
            <ClinicalSafetyProvider>
              <ThemeProvider>
                <AIProvider>
                  <DashboardProvider>
                    <AppContent />
                  </DashboardProvider>
                </AIProvider>
              </ThemeProvider>
            </ClinicalSafetyProvider>
          </SearchProvider>
        </OnlineStatusProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

import { OfflineIndicator } from "./components/OfflineIndicator";
import { HealthMonitor } from "./components/HealthMonitor";

function AppContent() {
  const { 
    activeView, setActiveView,
    viewParams
  } = useDashboard();
  
  const [viewingDocument, setViewingDocument] = useState<DocumentContent | null>(null);

  return (
    <Layout>
      <OfflineIndicator />
      <HealthMonitor />
      {viewingDocument && (
        <Suspense fallback={null}>
          <DocumentViewer document={viewingDocument} onClose={() => setViewingDocument(null)} />
        </Suspense>
      )}
      <ViewManager 
        activeView={activeView} 
        setActiveView={setActiveView} 
        viewParams={viewParams}
      />
    </Layout>
  );
}
