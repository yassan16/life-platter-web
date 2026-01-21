'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/auth';
import { setAccessToken } from '@/lib/api/client';
import * as authApi from '@/lib/api/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isInitialized: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({ email, password });
          setAccessToken(response.access_token);
          set({
            user: response.user,
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register({ email, password, name });
          setAccessToken(response.access_token);
          set({
            user: response.user,
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // Ignore logout errors
        } finally {
          setAccessToken(null);
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
          });
        }
      },

      initialize: async () => {
        const state = get();
        if (state.isInitialized) return;

        if (state.accessToken) {
          setAccessToken(state.accessToken);
          try {
            const user = await authApi.getMe();
            set({ user, isInitialized: true });
          } catch {
            // Token is invalid, try refresh
            if (state.refreshToken) {
              try {
                const response = await authApi.refreshToken(state.refreshToken);
                setAccessToken(response.access_token);
                const user = await authApi.getMe();
                set({
                  user,
                  accessToken: response.access_token,
                  refreshToken: response.refresh_token,
                  isInitialized: true,
                });
              } catch {
                // Refresh failed, clear auth
                setAccessToken(null);
                set({
                  user: null,
                  accessToken: null,
                  refreshToken: null,
                  isInitialized: true,
                });
              }
            } else {
              setAccessToken(null);
              set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isInitialized: true,
              });
            }
          }
        } else {
          set({ isInitialized: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
