#!/usr/bin/env node
/**
 * Promotes @org/app-layout → @org/layout and wires claims-lab.
 *
 * Prerequisites (run once):
 *   sudo chown -R $(whoami) libs/ui apps/claims-lab
 *
 * Then:
 *   node tools/promote-app-layout.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appLayoutSrc = path.join(root, 'libs/app-layout/src');
const layoutRoot = path.join(root, 'libs/ui/layout');
const layoutSrc = path.join(layoutRoot, 'src');
const layoutComponents = path.join(layoutSrc, 'components');
const claimsLabApp = path.join(root, 'apps/claims-lab/src/app');

function assertWritable(dir) {
  try {
    fs.accessSync(dir, fs.constants.W_OK);
  } catch {
    console.error(`\n✗ Not writable: ${dir}`);
    console.error('\nRun first:');
    console.error('  sudo chown -R $(whoami) libs/ui apps/claims-lab\n');
    process.exit(1);
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

assertWritable(path.join(root, 'libs/ui'));
assertWritable(claimsLabApp);

console.log('→ Copying shell components to @org/layout …');
if (fs.existsSync(path.join(layoutSrc, 'lib'))) {
  fs.rmSync(path.join(layoutSrc, 'lib'), { recursive: true, force: true });
}
copyDir(appLayoutSrc, layoutSrc);

write(
  path.join(layoutRoot, 'package.json'),
  JSON.stringify(
    {
      name: '@org/layout',
      version: '0.0.1',
      type: 'module',
      main: './dist/index.js',
      module: './dist/index.js',
      types: './dist/index.d.ts',
      exports: {
        './package.json': './package.json',
        '.': {
          '@org/source': './src/index.ts',
          types: './dist/index.d.ts',
          import: './dist/index.js',
          default: './dist/index.js',
        },
      },
      dependencies: {
        '@org/design-system': '*',
        'lucide-react': '^0.525.0',
      },
      peerDependencies: {
        react: '^19.0.0',
        'react-dom': '^19.0.0',
      },
    },
    null,
    2
  ) + '\n'
);

const viteConfig = fs.readFileSync(
  path.join(root, 'libs/app-layout/vite.config.mts'),
  'utf8'
);
write(
  path.join(layoutRoot, 'vite.config.mts'),
  viteConfig
    .replace('libs/app-layout', 'libs/ui/layout')
    .replace('@org/app-layout', '@org/layout')
    .replace(
      "cacheDir: '../../node_modules/.vite/libs/ui/layout'",
      "cacheDir: '../../../node_modules/.vite/libs/ui/layout'"
    )
);

console.log('→ Wiring claims-lab …');

write(
  path.join(claimsLabApp, 'global.css'),
  `@import 'tailwindcss';
@import 'tw-animate-css';

@source "../../../libs/design-system/src/**/*.{ts,tsx}";
@source "../../../libs/ui/layout/src/**/*.{ts,tsx}";
@import '@org/design-system/styles/globals.css';
`
);

write(
  path.join(root, 'apps/claims-lab/postcss.config.mjs'),
  `const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
`
);

write(
  path.join(claimsLabApp, 'providers.tsx'),
  `'use client';

import { ThemeProvider, Toaster } from '@org/design-system';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
      <Toaster richColors closeButton />
    </ThemeProvider>
  );
}
`
);

write(
  path.join(claimsLabApp, 'crm-dashboard-demo.tsx'),
  fs.readFileSync(
    path.join(root, 'apps/claims-portal/src/app/crm-dashboard-demo.tsx'),
    'utf8'
  ).replace('@org/app-layout', '@org/layout')
);

write(
  path.join(claimsLabApp, 'layout.tsx'),
  `import './global.css';

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
`
);

write(
  path.join(claimsLabApp, 'page.tsx'),
  `import { CrmDashboardDemo } from './crm-dashboard-demo';

export default function Index() {
  return <CrmDashboardDemo />;
}
`
);

write(
  path.join(root, 'apps/claims-lab/next.config.js'),
  `//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@org/design-system', '@org/layout'],
};

module.exports = nextConfig;
`
);

const claimsLabPkg = JSON.parse(
  fs.readFileSync(path.join(root, 'apps/claims-lab/package.json'), 'utf8')
);
claimsLabPkg.dependencies = {
  ...claimsLabPkg.dependencies,
  '@org/design-system': '*',
  '@org/layout': '*',
  sonner: '^2.0.6',
};
claimsLabPkg.devDependencies = {
  '@tailwindcss/postcss': '^4.1.11',
  tailwindcss: '^4.1.11',
  'tw-animate-css': '^1.3.5',
};
write(
  path.join(root, 'apps/claims-lab/package.json'),
  JSON.stringify(claimsLabPkg, null, 2) + '\n'
);

console.log('→ Updating claims-portal imports to @org/layout …');
const portalDemo = path.join(root, 'apps/claims-portal/src/app/crm-dashboard-demo.tsx');
write(portalDemo, fs.readFileSync(portalDemo, 'utf8').replace('@org/app-layout', '@org/layout'));

const portalPkg = JSON.parse(
  fs.readFileSync(path.join(root, 'apps/claims-portal/package.json'), 'utf8')
);
delete portalPkg.dependencies['@org/app-layout'];
portalPkg.dependencies['@org/layout'] = '*';
write(path.join(root, 'apps/claims-portal/package.json'), JSON.stringify(portalPkg, null, 2) + '\n');

const portalNext = fs.readFileSync(path.join(root, 'apps/claims-portal/next.config.js'), 'utf8');
write(
  path.join(root, 'apps/claims-portal/next.config.js'),
  portalNext.replace('@org/app-layout', '@org/layout')
);

console.log('→ Removing staging lib libs/app-layout …');
fs.rmSync(path.join(root, 'libs/app-layout'), { recursive: true, force: true });

console.log('→ Running npm install …');
execSync('npm install', { cwd: root, stdio: 'inherit' });

console.log('\n✓ Done. Run: npm exec nx build @org/layout && npm exec nx dev @org/claims-lab\n');
