import { spawnSync } from 'child_process';
import { PackageConf } from './config/package.conf';

const ls = spawnSync('compodoc src/lib/typography -p tsconfig.json');
