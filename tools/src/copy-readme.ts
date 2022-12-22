import __fsExtra from 'fs-extra';
const { copySync } = __fsExtra;

copySync(`${process.cwd()}/README.md`, `${process.cwd()}/dist/@alyle/ui/README.md`);
