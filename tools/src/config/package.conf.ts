import * as jsyaml from 'js-yaml';
import { readFileSync } from 'fs';

export const PackageConf = jsyaml.load(readFileSync(`${process.cwd()}/.package.conf.yml`, 'utf8').toString());
