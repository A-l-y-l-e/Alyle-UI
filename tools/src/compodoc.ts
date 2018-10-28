import { spawnSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { PackageConf } from './config/package.conf';
import { join } from 'path';


const { components } = PackageConf;

for (const key in components) {
  if (components.hasOwnProperty(key)) {
    const pathFolder = components[key];
    console.log(key);
    const docPathFolder = join('docs', key);
    const ls = spawnSync(
      'yarn',
      [
        'compodoc',
        join('src/lib', pathFolder),
        '--output', docPathFolder,
        '--name', key,
        '--tsconfig', 'tsconfig.json',
        '--disableSourceCode',
        '--disablePrivate',
        '--disableLifeCycleHooks',
        '--disableCoverage',
        '--silent',
        '--exportFormat', 'json'
      ],
      {stdio: 'inherit'}
    );

    if (ls.status) {
      process.exit(1);
    }
    const docPathFile = join(docPathFolder, 'documentation.json');
    const fileObject = JSON.parse(readFileSync(docPathFile, 'utf8').toString());
    const c_d = fileObject['c_d'] = [];
    if ((fileObject.components as any[]).length) {
      c_d.push({
        title: 'components',
        data: fileObject.components
      });
    }
    if ((fileObject.directives as any[]).length) {
      c_d.push({
        title: 'directives',
        data: fileObject.directives
      });
    }
    c_d.forEach(_ => {
      _.data.forEach(__ => {
        __.propertiesClass = __.propertiesClass.filter(___ => !(___.name as string).startsWith('_'));
        __.methodsClass = __.methodsClass.filter(___ => !(___.name as string).startsWith('_'));
      });
    });
    const arrayVariables = fileObject.miscellaneous.variables;
    if (arrayVariables) {
      fileObject.miscellaneous.variables = arrayVariables.filter(function(item) {
        return (item.name as string).toLowerCase() !== 'styles';
      });
    }
    if (fileObject.miscellaneous.enumerations) {
      fileObject.miscellaneous.enumerations.forEach(_ => {
        _.code = enumerationsTemplate(_);
      });
      fileObject.miscellaneous.enumerationsCode = fileObject.miscellaneous.enumerations.map(_ => _.code).join(`\n`);
      fileObject.miscellaneous.variablesCode = fileObject.miscellaneous.variables.map(_ => `const ${_.name} = ${_.defaultValue};`).join(`\n`);
    }
    delete fileObject.components;
    delete fileObject.directives;
    removeKeys(fileObject, [
      'sourceCode',
      'groupedVariables',
      'groupedTypeAliases',
      'groupedEnumerations',
      'groupedFunctions',
      'constructorObj'
    ]);
    writeFileSync(docPathFile, JSON.stringify(fileObject), 'utf8');

  }
}

function enumerationsTemplate(_enum: {
  childs: [{
    name: string
  }],
  description: string
  name: string
}) {
  const enumContent = `${_enum.childs.map(_ => `  ${_.name}`).join(',\n')}`;
  return `${createDescription(_enum.description)}enum ${_enum.name} {\n${enumContent}\n}`;
}

function methodTemplate(method: {
  args: [{
    name: string
    optional?: boolean
    type: string
  }]
  name: string
  type: string
  returnType: string
}) {
  const args = method.args.map(_ => `${_.name}${_.optional ? '?' : ''}: ${_.type || 'any'}`).join(', ');
  return `${method.name}(${args}): ${method.returnType}`;
}

/**
 * Remove all specified keys from an object, no matter how deep they are.
 * The removal is done in place, so run it on a copy if you don't want to modify the original object.
 * This function has no limit so circular objects will probably crash the browser
 *
 * @param obj The object from where you want to remove the keys
 * @param keys An array of property names (strings) to remove
 */
function removeKeys(obj, keys: string[]) {
  let index;
  for (const prop in obj) {
      // important check that this is objects own property
      // not from prototype prop inherited
      if (obj.hasOwnProperty(prop)) {
          switch (typeof(obj[prop])) {
              case 'string':
                  index = keys.indexOf(prop);
                  if (index > -1) {
                      delete obj[prop];
                  }
                  break;
              case 'object':
                  index = keys.indexOf(prop);
                  if (index > -1) {
                      delete obj[prop];
                  } else {
                      removeKeys(obj[prop], keys);
                  }
                  break;
          }
      }
  }
}

function createDescription(text: string) {
  const newText = text.replace(/\<\/?p\>/g, '').trim();
  const isMultiline = newText.split(/\n/g).length > 1;
  const lineStart = isMultiline ? `\n *` : '';
  const lineEnd = isMultiline ? `\n` : '';
  return newText ? `/**${lineStart} ${newText.replace(/\n/g, `\n * `)}${lineEnd} */\n` : '';
}
