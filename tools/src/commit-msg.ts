import { request } from '@octokit/request';
import { env, REPO_OWNER, REPO_NAME } from './env';

const msg = async () => {
  const { data: { commit: { message } } } = await request('GET /repos/:owner/:repo/commits/:ref', {
    owner: REPO_OWNER,
    repo: REPO_NAME,
    ref: env.SYSTEM_PULLREQUEST_SOURCECOMMITID || env.BUILD_SOURCEVERSION || 'fcbb963bf9d62ff1c401615cbea153640e1bf983'
  });
  process.stdout.write((message as string).toLowerCase());
};

try {
  msg().catch((err) => {
    console.error(err);
    process.exit(1);
  });
} catch (err) {
  console.error(err);
  process.exit(1);
}
