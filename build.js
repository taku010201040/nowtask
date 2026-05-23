import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting custom production build using esbuild...');

try {
  // 1. Ensure dist and dist/assets folders exist
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
  if (!fs.existsSync('dist/assets')) {
    fs.mkdirSync('dist/assets');
  }

  // 2. Run esbuild bundle command
  console.log('📦 Bundling and minifying TypeScript/React and CSS files...');
  execSync(
    'npx esbuild src/main.tsx --bundle --minify --outdir=dist/assets --loader:.png=file --loader:.svg=file',
    { stdio: 'inherit' }
  );

  // 3. Rename main.css and main.js to simple names if needed (esbuild already outputs main.js/main.css due to main.tsx entrypoint)
  // Let's verify files are created
  const mainJsPath = 'dist/assets/main.js';
  const mainCssPath = 'dist/assets/main.css';

  if (!fs.existsSync(mainJsPath) || !fs.existsSync(mainCssPath)) {
    throw new Error('Esbuild output files are missing!');
  }

  // 4. Read source index.html
  console.log('📝 Generating dist/index.html with relative production paths...');
  let html = fs.readFileSync('index.html', 'utf-8');

  // Replace dev entry with production entry, and inject the bundled CSS
  html = html.replace(
    '<script type="module" src="/src/main.tsx"></script>',
    '<script type="module" src="./assets/main.js"></script>'
  );

  // Inject CSS link in head before </head>
  const cssLink = '    <link rel="stylesheet" href="./assets/main.css">\n  </head>';
  html = html.replace('  </head>', cssLink);

  // Ensure favicon path is relative
  html = html.replace('href="/favicon.svg"', 'href="./favicon.svg"');

  // Write to dist/index.html
  fs.writeFileSync('dist/index.html', html);

  // 5. Copy public folder files directly to dist (favicon.svg, icons.svg)
  console.log('📂 Copying static assets from public/ to dist/...');
  const publicFiles = ['favicon.svg', 'icons.svg'];
  publicFiles.forEach((file) => {
    const src = path.join('public', file);
    const dest = path.join('dist', file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  });

  console.log('✨ Build succeeded successfully! Custom production assets are ready in dist/.');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
