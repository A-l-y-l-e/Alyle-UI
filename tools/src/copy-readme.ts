import { copySync } from 'fs-extra';

copySync(`${process.cwd()}/README.md`, `${process.cwd()}/dist/@alyle/ui/README.md`);
