'use client';

import { Modal } from '@/components/ui/Modal';
import { DishDetailContent } from '@/components/features/dishes/DishDetailContent';
import type { Dish } from '@/types/dish';

interface DishDetailModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function DishDetailModal({ dish, isOpen, onClose, isLoading }: DishDetailModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex-1 overflow-y-auto min-h-0 p-4 pb-8">
        <DishDetailContent dish={dish} isLoading={!!isLoading} />
      </div>
    </Modal>
  );
}
