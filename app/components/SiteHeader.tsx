export default function SiteHeader() {
  return (
    <header>
      <div className="app-container py-4">
        <a href="/" className="brand" aria-label="Duolist Home">
          <img src="/logo.svg" alt="Duolist logo" className="brand-logo" />
          <span className="brand-title">Duolist</span>
        </a>
        <p className="small">Minimal shared shopping list</p>
      </div>
    </header>
  );
}
