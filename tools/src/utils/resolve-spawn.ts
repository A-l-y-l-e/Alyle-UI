import { exec } from 'child_process';

const env: NodeJS.ProcessEnv = {
  ...process.env,
  FORCE_COLOR: '1'
};

/**
 * Create a Promise of a execed child process.
 * @param {string} script
 */
export function resolveSpawn(script: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`\n> ${script}\n`);
    let data = '';
    let err = '';
    const cmd = exec(script, {
      env,
      encoding: 'utf8'
    });
    cmd.stdout.on('data', (buffer: Buffer) => {
      data = (buffer.toString('utf8'));
      console.log(data.trim());
    });
    cmd.stderr.on('data', (buffer: Buffer) => {
      err += (buffer.toString('utf8'));
      console.log(err);
    });
    cmd.on('close', (code) => {
      if (code === 1) {
        reject(err);
      }
      resolve(data);
    });
  });
}
