import type { Metadata } from 'next';
import './admin.css';
import { AdminLanguageProvider } from '../../context/AdminLanguageProviderWrapper';
import { AdminGuard } from '../../components/admin/AdminGuard';

export const metadata: Metadata = {
  title: 'Admin Dashboard Overview & Control Center | Fan Hub Plus',
  description: 'Manage sales analytics, Hanteo chart sync telemetry, album catalog, orders, and fandom members.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div translate="no" className="notranslate">
      <AdminGuard>
        <AdminLanguageProvider>
          {children}
        </AdminLanguageProvider>
      </AdminGuard>
    </div>
  );
}
