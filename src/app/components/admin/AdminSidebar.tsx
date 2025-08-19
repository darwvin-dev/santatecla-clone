    export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2>Pannello</h2>
      <nav>
        <a href="/admin">Dashboard</a>
        <a href="/admin/homepage">HomePage</a>
        <a href="/admin/homepage/experiences">experiences</a>
        <a href="/admin/apartments">Appartamenti</a>
        <a href="/">Torna al sito</a>
      </nav>
    </aside>
  );
}
