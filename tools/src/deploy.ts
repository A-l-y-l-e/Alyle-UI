import { exec, spawn } from 'child_process';
import { readFileSync } from 'fs';

const firebaseTools = require('firebase-tools');
const currentVersion = JSON.parse(readFileSync(`${process.cwd()}/package.json`, 'utf8').toString()).version;
const projectDir = process.cwd();

exec(`git diff HEAD^:package.json HEAD:package.json -S '${currentVersion}'` , (err, stdout) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  const isNewVersion = !!stdout.trim();
  console.log({isNewVersion, currentVersion});
  if (process.env.TRAVIS_BRANCH === 'master' && process.env.TRAVIS_PULL_REQUEST === 'false' && isNewVersion) {
    firebaseTools.deploy({
      cwd: projectDir,
      token: process.env.FIREBASE_TOKEN
    })
    .then(() => {
      console.log('Successfully deployed the alyle-ui to firebase');
      // Firebase tools opens a persistent websocket connection and the process will never exit.
      process.exit(0);
    })
    .catch((_err: any) => {
      console.log(_err);
      process.exit(1);
    });
  } else {
    console.log('Cancel deploy');
  }
});


