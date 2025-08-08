import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';
import './admin.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="admin-body">
        <div className="admin-layout">
          <AdminSidebar />
          <main className="admin-main">
            <AdminHeader />
            <div className="admin-content">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
