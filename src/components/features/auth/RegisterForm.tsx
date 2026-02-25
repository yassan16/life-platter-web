'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useAuthStore } from '@/stores/authStore';
import { ApiError } from '@/lib/api/client';

export function RegisterForm() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }

    try {
      await register(email, password, name);
      router.push('/calendar');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError('このメールアドレスは既に登録されています');
        } else {
          setError('登録に失敗しました');
        }
      } else {
        setError('登録に失敗しました');
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
        type="text"
        label="お名前"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="山田 太郎"
        required
        autoComplete="name"
      />

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

      <PasswordInput
        label="パスワード"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="8文字以上"
        required
        autoComplete="new-password"
      />

      <PasswordInput
        label="パスワード（確認）"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="もう一度入力"
        required
        autoComplete="new-password"
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        新規登録
      </Button>

      <p className="text-center text-sm text-gray-600">
        既にアカウントをお持ちの方は
        <Link href="/login" className="text-orange-500 hover:underline ml-1">
          ログイン
        </Link>
      </p>
    </form>
  );
}
