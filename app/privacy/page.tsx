export const metadata = { title: 'Privacy Policy – Duolist' };

export default function Privacy() {
  return (
    <div className="space-y-4">
      <div className="card">
        <div className="prose prose-invert max-w-none">
          <h2>Privacy Policy</h2>
          <p>Updated: 26-10-2026</p>

          <h3>Overview</h3>
          <p>Duolist is a minimal shared shopping list app for two people. It is free: no ads, no in-app purchases, no analytics, and no tracking. We collect only what is needed to sign you in, sync your lists, and notify you when they change.</p>

          <h3>Data we collect</h3>
          <ul>
            <li><b>Account:</b> When you sign in with Google, Google shares your email address, display name, and profile picture with the app. We store your name, email, and a Firebase user ID in your Duolist profile; the profile picture is not stored.</li>
            <li><b>Content:</b> The lists and items you create — list names, item text, quantity, optional notes, completion state, priority, and timestamps. Each item records which account created or last changed it.</li>
            <li><b>Notification token:</b> A Firebase Cloud Messaging registration token for your device, so we can notify you when a shared list changes.</li>
            <li><b>Preferences:</b> Display settings such as your nickname, theme, sort order, and list order.</li>
          </ul>

          <h3>What we do not collect</h3>
          <p>No advertising ID, no ad or analytics SDKs, no crash-reporting SDKs, no location, contacts, camera, microphone, files, or health data. The app requests only internet, network-state, and notification permissions.</p>

          <h3>How we use data</h3>
          <ul>
            <li>Sign you in and keep you signed in.</li>
            <li>Sync your lists and items in real time between your devices and the people you share them with.</li>
            <li>Send notifications when a shared list changes.</li>
            <li>Let you add a partner by the email address they signed up with.</li>
          </ul>

          <h3>Sharing</h3>
          <p>We do not sell your data and we do not share it with advertisers. Data is processed by Google Firebase (Authentication, Cloud Firestore, Cloud Messaging, Cloud Functions) on our behalf, on Google Cloud infrastructure that may be located outside your country. Google Play distributes the app and handles updates.</p>
          <p>People you share a list with can see that list&apos;s content, your display name, and your email address. Your profile name and email are also readable by other signed-in Duolist users, which is how partners find and recognize each other. If you invite someone by email, that address is used to look up their account; it is not stored.</p>

          <h3>Security</h3>
          <ul>
            <li>All data is encrypted in transit (TLS).</li>
            <li>Firestore data is encrypted at rest by Google.</li>
            <li>Access is restricted by authentication and per-document security rules.</li>
            <li>Lists are cached on your device so the app works offline; uninstalling the app removes the cache.</li>
          </ul>

          <h3>Retention and account deletion</h3>
          <p>Your content stays until you delete it or delete your account. Deleting an item removes it from our servers. Deleting a list removes it from your account and from anyone you shared it with. Deleting your account removes your authentication record, profile, lists and items, notification tokens, and partner links immediately; lists you shared stay with their owner.</p>
          <ul>
            <li>In-app: Profile → Delete account → Open delete page.</li>
            <li>Web: <a href="/delete-account">/delete-account</a> — we email a confirmation link that expires in 24 hours.</li>
          </ul>

          <h3>Children</h3>
          <p>Duolist is not directed at children under 13, and we do not knowingly collect data from them.</p>

          <h3>Changes</h3>
          <p>If this policy changes, we will update this page and the date above.</p>

          <h3>Contact</h3>
          <p>Email: <a href="mailto:contact@dotsbright.com">contact@dotsbright.com</a></p>
        </div>
      </div>
    </div>
  );
}
