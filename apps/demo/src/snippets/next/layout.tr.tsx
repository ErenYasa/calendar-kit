// app/layout.tsx — varsayılan temayı bir kez içe aktarın.
import type { ReactNode } from 'react';
import 'calendar-kit/styles.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
