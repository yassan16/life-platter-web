import { RegisterForm } from '@/components/features/auth/RegisterForm';

export const metadata = {
  title: '新規登録 - Life Platter',
};

export default function RegisterPage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-center mb-6">新規登録</h2>
      <RegisterForm />
    </div>
  );
}
