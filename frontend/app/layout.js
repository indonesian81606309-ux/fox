import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: '3+ Fox Market',
  description: 'Marketplace game premium',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e1e2f', color: '#fff' } }} />
        </AuthProvider>
      </body>
    </html>
  );
}
