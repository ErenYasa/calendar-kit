// app/layout.tsx — import the default theme once.
import type { ReactNode } from 'react';
import 'calendar-kit/styles.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
