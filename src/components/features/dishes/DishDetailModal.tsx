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
      <div className="p-4 pb-8">
        <DishDetailContent dish={dish} isLoading={!!isLoading} />
      </div>
    </Modal>
  );
}
