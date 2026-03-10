import { spawn } from 'child_process';
import { platform } from 'os';
import { join } from 'path';

const isWindows = platform() === 'win32';
const binaryName = isWindows ? 'pocketbase.exe' : 'pocketbase';
const binaryPath = join('services', 'pocketbase', binaryName);

const args = ['serve', '--http=0.0.0.0:8090']; // or [] if you want to pass CLI args from user input

const child = spawn(binaryPath, args, {
	  stdio: 'inherit',
	  shell: isWindows, // for .exe execution compatibility
});

child.on('exit', (code) => {
	  process.exit(code);
});
