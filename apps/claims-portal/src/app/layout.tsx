import './global.css';

import { AppProviders } from './providers';

export const metadata = {
  title: 'Claims Portal | ABC Insurance',
  description: 'Insurance claims adjudication portal',
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
