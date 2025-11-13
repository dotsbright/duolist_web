export const metadata = { title: 'Privacy Policy – Duolist' };

export default function Privacy() {
  return (
    <div className="space-y-4">
      <div className="card">
        <div className="prose prose-invert max-w-none">
          <h2>Privacy Policy</h2>
          <p>Updated: 30-10-2025</p>
          <h3>Overview</h3>
          <p>Duolist is a minimal shared shopping list app. We collect only what is needed to provide the service and keep your data safe.</p>

          <h3>Data we collect</h3>
          <ul>
            <li><b>Account:</b> Email address, Firebase user ID.</li>
            <li><b>Content:</b> Lists, items, and optional notes you create.</li>
            <li><b>Diagnostics:</b> Basic crash/analytics signals from our SDKs.</li>
            <li><b>Advertising:</b> Google AdMob may collect device identifiers for ad delivery, measurement, and fraud prevention.</li>
          </ul>

          <h3>How we use data</h3>
          <ul>
            <li>Provide app functionality and real-time sync.</li>
            <li>Improve reliability and performance.</li>
            <li>Show non-overlapping banner ads and measure ad performance.</li>
          </ul>

          <h3>Sharing</h3>
          <p>We share data with service providers only to operate the app:
            Firebase (Auth, Firestore), and Google AdMob. We do not sell your data.
          </p>

          <h3>Security</h3>
          <ul>
            <li>All data is encrypted in transit (TLS).</li>
            <li>Access is restricted by authentication and least privilege.</li>
          </ul>

          <h3>Retention</h3>
          <p>You control your content. You can delete lists and items in-app. If you delete your account, your authentication record is removed and we schedule associated data for deletion within 30 days.</p>

          <h3>Account deletion</h3>
          <ul>
            <li>In-app: Settings → Delete account.</li>
            <li>Web: <a href="/delete-account">/delete-account</a> to request or confirm deletion.</li>
          </ul>

          <h3>Contact</h3>
          <p>Email: <a href="mailto:contact@dotsbright.com">contact@dotsbright.com</a></p>
        </div>
      </div>
    </div>
  );
}
