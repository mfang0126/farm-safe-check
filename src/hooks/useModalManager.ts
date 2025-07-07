import { useState } from 'react';

export interface ModalState {
  [key: string]: boolean;
}

export const useModalManager = () => {
  const [modals, setModals] = useState<ModalState>({});

  const openModal = (modalId: string) => {
    setModals(prev => ({ ...prev, [modalId]: true }));
  };

  const closeModal = (modalId: string) => {
    setModals(prev => ({ ...prev, [modalId]: false }));
  };

  const toggleModal = (modalId: string) => {
    setModals(prev => ({ ...prev, [modalId]: !prev[modalId] }));
  };

  const isOpen = (modalId: string) => !!modals[modalId];

  const closeAllModals = () => {
    setModals({});
  };

  return {
    openModal,
    closeModal,
    toggleModal,
    isOpen,
    closeAllModals,
  };
}; 