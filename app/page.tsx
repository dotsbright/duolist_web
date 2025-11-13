import Card from './components/ui/Card';

export default function Home() {
  return (
    <div className="space-y-4">
      <Card title="Welcome to Duolist">
        <div className="prose prose-invert">
          <p>Duolist is a minimal shared shopping list for two people. Add items, tick them off, and stay in sync.</p>
          <p>
            <a
              className="btn"
              href="https://play.google.com/store/apps/details?id=com.dotsbright.duolist"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get it on Google Play
            </a>
          </p>
        </div>
      </Card>

      <Card title="How it works">
        <div className="prose prose-invert">
          <ol>
            <li>Install the app from Google Play.</li>
            <li>Create an account (email &amp; password).</li>
            <li>Create a list and invite your partner.</li>
            <li>Add items; both of you see changes instantly.</li>
          </ol>
        </div>
      </Card>

      <Card title="Support">
        <p className="small">
          Need help? Email support at <a href="mailto:contact@dotsbright.com">contact@dotsbright.com</a>.
        </p>
      </Card>
    </div>
  );
}
