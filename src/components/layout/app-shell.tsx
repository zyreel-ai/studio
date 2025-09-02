
'use client';

import React from 'react';
import AppContent from './app-content';

// This is a new wrapper component.
// In a real app, it could hold Shell-like components that exist on every page.
// For now, it just renders AppContent.
export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <AppContent>
            {children}
        </AppContent>
    )
}
