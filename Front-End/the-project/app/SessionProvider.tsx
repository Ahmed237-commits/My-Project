'use client';
import React from 'react';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import type { SessionProviderProps } from 'next-auth/react';

const MySessionProvider: React.FC<SessionProviderProps> = ({ children, session }) => {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
};

export default MySessionProvider;
export type { SessionProviderProps };
