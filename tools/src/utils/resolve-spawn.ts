import { spawn } from 'child_process';

const env: NodeJS.ProcessEnv = {
  ...process.env,
  FORCE_COLOR: '1'
};

/**
 * Create a Promise of a spawned child process.
 * @param {string} script
 */
export function resolveSpawn(script: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const { command, args } = toScript(script);
    let data = '';
    let err = '';
    const cmd = spawn(command, args, {
      env
    });
    cmd.stdout.on('data', (buffer: Buffer) => {
      data = (buffer.toString('utf8'));
      console.log(data);
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

function toScript(str: string) {
  const splited = str.split(' ');
  return {
    command: splited[0],
    args: splited.slice(1)
  };
}
