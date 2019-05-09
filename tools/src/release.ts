import { resolveSpawn } from './utils/resolve-spawn';
import * as firebaseTools from 'firebase-tools';

const releaseRegExp = /create\s?release\:?\s?v?([0-9]+\.[0-9]+\.[0-9]+)/i;

(async () => {

  const COMMIT_MESSAGE = await resolveSpawn('git show -s --format=%s');
  const VERSION = await getVersionFromCommit(COMMIT_MESSAGE);

  if (VERSION) {
    console.log(`New version ${VERSION}`);
    const scripts = [
      `node dist/tools/bump-version --newVersion ${VERSION}`,
      'yarn changelog',
      'yarn tools:prepare-lib',
      'yarn build',
      'yarn build:@alyle/ui',
      'yarn tools:docs',
      'cp -r dist/docs-content/* repos/alyle-ui-docs-content',
      'cd repos/alyle-ui-docs-content && git add -A',
      `cd repos/alyle-ui-docs-content && git commit --allow-empty -m "release @alyle/ui ${VERSION} 🎉🎉🎉"`,
      `cd repos/alyle-ui-docs-content && git tag ${VERSION}`,
      `cd repos/alyle-ui-docs-content && git push origin master --tags`,
      `git checkout master`,
      'git add -A',
      `git commit --allow-empty -m 'release @alyle/ui ${VERSION} 🎉🎉🎉' -m "[ci skip]"`,
      `git tag ${VERSION}`,
      'git push origin master --tags',
      'npm publish dist/@alyle/ui',
      deployApp
    ];

    for (const script of scripts) {
      if (typeof script === 'string') {
        await resolveSpawn(script);
      } else {
        await script();
      }
    }
    process.exit(0);
  } else {
    console.log(`No version found.`);
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

async function deployApp() {
  await (firebaseTools.deploy({
    cwd: process.cwd(),
    token: process.env.FIREBASE_TOKEN
  }) as Promise<void>);
  console.log('Successfully deployed the alyle-ui to firebase');
}
