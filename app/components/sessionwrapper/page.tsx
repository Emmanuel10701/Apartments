"use client";

import React from 'react';
import { SessionProvider } from 'next-auth/react';

interface SessionWrapperProps {
  children: React.ReactNode;
}

const SessionWrapper: React.FC<SessionWrapperProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionWrapper;
