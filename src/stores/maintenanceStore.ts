import { create } from 'zustand';

interface MaintenanceState {
  isMaintenance: boolean;
  setMaintenance: (value: boolean) => void;
}

export const useMaintenanceStore = create<MaintenanceState>((set) => ({
  isMaintenance: false,
  setMaintenance: (value) => set({ isMaintenance: value }),
}));
