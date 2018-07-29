const firebaseTools = require('firebase-tools');
const projectDir = process.cwd();

console.log({projectDir});

if (process.env.MODE_DEPLOY) {
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


