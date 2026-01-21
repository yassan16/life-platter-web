'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/authStore';
import { ApiError } from '@/lib/api/client';

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      router.push('/calendar');
    } catch (err) {
      if (err instanceof ApiError) {
        setError('メールアドレスまたはパスワードが正しくありません');
      } else {
        setError('ログインに失敗しました');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <Input
        type="email"
        label="メールアドレス"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@email.com"
        required
        autoComplete="email"
      />

      <Input
        type="password"
        label="パスワード"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワードを入力"
        required
        autoComplete="current-password"
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        ログイン
      </Button>

      <p className="text-center text-sm text-gray-600">
        アカウントをお持ちでない方は
        <Link href="/register" className="text-orange-500 hover:underline ml-1">
          新規登録
        </Link>
      </p>
    </form>
  );
}
