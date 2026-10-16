import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import { I18nProvider } from './contexts/I18nContext';
import { TemaProvider } from './contexts/TemaContext';
import { AuthProvider } from './contexts/AuthContext';
import { XPProvider } from './contexts/XPContext';
import { MascoteProvider } from './contexts/MascoteContext';
import { AppRouter } from './routes/AppRouter';
import { useConsoleEasterEgg } from './hooks/useConsoleEasterEgg';

function AppInterno() {
  useConsoleEasterEgg();
  return <AppRouter />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <I18nProvider>
            <TemaProvider>
              <AuthProvider>
                <XPProvider>
                  <MascoteProvider>
                    <AppInterno />
                  </MascoteProvider>
                </XPProvider>
              </AuthProvider>
            </TemaProvider>
          </I18nProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}