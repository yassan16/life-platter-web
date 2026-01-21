import { LoginForm } from '@/components/features/auth/LoginForm';

export const metadata = {
  title: 'ログイン - Life Platter',
};

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-center mb-6">ログイン</h2>
      <LoginForm />
    </div>
  );
}
