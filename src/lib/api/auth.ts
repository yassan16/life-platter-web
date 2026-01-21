import { apiFetch } from './client';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenResponse,
  User,
} from '@/types/auth';

export async function login(data: LoginRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/users/login', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/users/register', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

export async function logout(): Promise<void> {
  return apiFetch<void>('/api/users/logout', {
    method: 'POST',
  });
}

export async function getMe(): Promise<User> {
  return apiFetch<User>('/api/users/me');
}

export async function refreshToken(token: string): Promise<RefreshTokenResponse> {
  return apiFetch<RefreshTokenResponse>('/api/users/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: token }),
    skipAuth: true,
  });
}
