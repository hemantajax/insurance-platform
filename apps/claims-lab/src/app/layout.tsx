import './global.css';

import { AppProviders } from './providers';

export const metadata = {
  title: 'Claims Lab | Component Showcase',
  description: 'Validate reusable CRM dashboard components from Figma',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
