export default function Home() {
  return (
    <div className="container">
      <h2>Welcome to Duolist</h2>
      <p>Duolist is a minimal shared shopping list for two people. Add items, tick them off, and stay in sync.</p>
      <h3>How it works</h3>
      <ol>
        <li>Install the app from Google Play.</li>
        <li>Create an account (email & password).</li>
        <li>Create a list and invite your partner.</li>
        <li>Add items; both of you see changes instantly.</li>
      </ol>
      <p>
        <a className="btn" href="https://play.google.com/store/apps/details?id=com.dotsbright.duolist" target="_blank" rel="noopener noreferrer">
          Get it on Google Play
        </a>
      </p>
      <p className="small">Need help? Email support at <a href="mailto:contact@dotsbright.com">contact@dotsbright.com</a>.</p>
    </div>
  );
}
