import Card from '../../components/ui/Card';
import { loginAction } from '../actions';

export default function AdminLoginPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-[480px]">
        <Card title="Admin Login">
          <form action={loginAction} method="post" className="grid gap-3">
            <input name="secret" type="password" placeholder="Admin secret" required className="input" />
            <button type="submit" className="btn">Sign in</button>
          </form>
          <p className="small mt-3">Use the admin secret to access the console.</p>
        </Card>
      </div>
    </main>
  );
}
