'use client';

import { Suspense } from 'react';
import ConfirmPage from './page';

export default function ConfirmPageClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmPage />
    </Suspense>
  );
}
