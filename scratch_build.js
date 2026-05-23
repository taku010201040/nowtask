import { spawn } from 'child_process';

const vite = spawn('npx', ['vite', 'build'], { shell: true });

vite.stdout.on('data', (data) => {
  console.log(`STDOUT: ${data.toString()}`);
});

vite.stderr.on('data', (data) => {
  console.error(`STDERR: ${data.toString()}`);
});

vite.on('close', (code) => {
  console.log(`Vite build exited with code ${code}`);
});
