'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DishDetailContent } from '@/components/features/dishes/DishDetailContent';
import { DishForm } from '@/components/features/dishes/DishForm';
import { deleteDish } from '@/lib/api/dishes';
import type { Dish } from '@/types/dish';

type ModalView = 'detail' | 'edit';

interface DishDetailModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onDishUpdated?: () => void;
  onDishDeleted?: (dishId: string) => void;
}

export function DishDetailModal({
  dish,
  isOpen,
  onClose,
  isLoading,
  onDishUpdated,
  onDishDeleted,
}: DishDetailModalProps) {
  const [view, setView] = useState<ModalView>('detail');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = () => {
    setView('detail');
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleEditSuccess = () => {
    setView('detail');
    onDishUpdated?.();
    onClose();
  };

  const handleDelete = async () => {
    if (!dish) return;

    setIsDeleting(true);
    try {
      await deleteDish(dish.id);
      setShowDeleteConfirm(false);
      onDishDeleted?.(dish.id);
      handleClose();
    } catch {
      setIsDeleting(false);
    }
  };

  const menuItems = [
    {
      label: '編集',
      onClick: () => setView('edit'),
    },
    {
      label: '削除',
      onClick: () => setShowDeleteConfirm(true),
      variant: 'danger' as const,
    },
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        {view === 'edit' && dish ? (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <button
              onClick={() => setView('detail')}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-2 px-4"
              aria-label="詳細に戻る"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              戻る
            </button>
            <DishForm mode="edit" dish={dish} onSuccess={handleEditSuccess} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto min-h-0 p-4 pb-8">
            {dish && !isLoading && (
              <div className="flex justify-end mb-2">
                <ActionMenu items={menuItems} />
              </div>
            )}
            <DishDetailContent dish={dish} isLoading={!!isLoading} />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="料理を削除"
        message="この料理を削除しますか？この操作は取り消せません。"
        confirmLabel="削除する"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
