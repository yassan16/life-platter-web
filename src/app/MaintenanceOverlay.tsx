'use client';

import dynamic from 'next/dynamic';
import { useMaintenanceStore } from '@/stores/maintenanceStore';

// [Vercel Best Practice: bundle-dynamic-imports]
// MaintenancePage はめったに表示されないため next/dynamic で遅延読み込み
// → 通常時のメインバンドルサイズに影響しない
const MaintenancePage = dynamic(
  () => import('@/components/ui/MaintenancePage').then((m) => m.MaintenancePage),
  { ssr: false }
);

export function MaintenanceOverlay() {
  const isMaintenance = useMaintenanceStore((s) => s.isMaintenance);
  // [Vercel Best Practice: rendering-conditional-render]
  if (!isMaintenance) return null;
  return <MaintenancePage />;
}
