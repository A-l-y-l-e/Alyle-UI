import { promises } from 'fs';
import { resolveSpawn } from './utils/resolve-spawn';
const { readFile, writeFile, mkdir } = promises;
const firebaseTools = require('firebase-tools');

const releaseRegExp = /(create\s?release:?\s?)v?([0-9]+\.[0-9]+\.[0-9]+)/i;

(async () => {

  const COMMIT_MESSAGE = await resolveSpawn('git show -s --format=%s');
  const VERSION = await getVersionFromCommit(COMMIT_MESSAGE);

  if (VERSION) {
    const scripts = [
      'yarn tools:bump',
      'yarn tools:prepare-lib',
      'yarn build',
      'yarn build:@alyle/ui',
      'yarn tools:docs',
      'git add -A',
      `git commit --allow-empty -m "release @alyle/ui ${VERSION} :tada:" -m "[ci skip]"`,
      `git tag ${VERSION}`,
      'git push origin master --tags',
      deployApp
    ];

    for (const [index, script] of Array.from(scripts.entries())) {
      if (typeof script === 'string') {
        await resolveSpawn(script);
      } else {
        script();
      }
    }
  }

})();

/**
 * Return if version is available else null from commit message
 * @param commitMsg Commit message
 */
function getVersionFromCommit(commitMsg: string): string | null {
  if (releaseRegExp.test(commitMsg)) {
    return releaseRegExp.exec(commitMsg)![1];
  }
  return null;
}

function deployApp() {
  if (process.env.MODE_DEPLOY) {
    firebaseTools.deploy({
      cwd: process.cwd(),
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
}
