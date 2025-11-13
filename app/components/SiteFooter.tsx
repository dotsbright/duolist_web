export default function SiteFooter() {
  return (
    <footer>
      <div className="app-container py-4">
        <p className="small">
          © {new Date().getFullYear()} DotsBright • <a href="/privacy">Privacy</a> • <a href="/delete-account">Delete account</a>
        </p>
      </div>
    </footer>
  );
}
