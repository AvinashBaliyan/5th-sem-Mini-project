// This file is DEPRECATED.
'use client';
import {createContext, useContext} from 'react';
import type {IconName} from '@/components/ui/lucide-icon';

type LucideIconContext = {
  getIcon: (name: IconName) => React.ElementType;
};

const LucideIconContext = createContext<LucideIconContext | null>(null);

export const useLucideIcon = () => {
  const context = useContext(LucideIconContext);
  if (!context) {
    throw new Error('useLucideIcon must be used within a LucideIconProvider');
  }
  return context;
};

export const LucideIconProvider = ({
  children,
  getIcon,
}: {
  children: React.ReactNode;
  getIcon: (name: IconName) => React.ElementType;
}) => {
  return (
    <LucideIconContext.Provider value={{getIcon}}>{children}</LucideIconContext.Provider>
  );
};
