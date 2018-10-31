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
        const properties = __.propertiesClass
        .filter(___ => !(___.name as string).startsWith('_'))
        .map(___ => propertyTemplate(___));
        delete __.propertiesClass;

        const methods = __.methodsClass
        .filter(___ => !(___.name as string).startsWith('_'))
        .map(___ => methodTemplate(___));
        delete __.methodsClass;

        const inputs = __.inputsClass.map(___ => inputsTemplate(___));
        delete __.inputsClass;

        const outputs = __.outputsClass.map(___ => outputsTemplate(___));
        delete __.outputsClass;

        const accessors = [];
        for (const accessorName in __.accessors) {
          if (__.accessors.hasOwnProperty(accessorName)) {
            const accessor = __.accessors[accessorName];
            if (accessor.getSignature) {
              accessors.push(accessorsTemplate(accessor.getSignature));
            }
          }
        }

        __.code = [
          ...properties,
          ...inputs,
          ...accessors,
          ...outputs,
          ...methods
        ].join(`\n\n`);
      });
    });
    const arrayVariables = fileObject.miscellaneous.variables;
    if (arrayVariables) {
      fileObject.miscellaneous.variables = arrayVariables.filter((item) => {
        return (item.name as string).toLowerCase() !== 'styles';
      });
    }

    // Create interfaces template
    fileObject.interfacesCode = fileObject.interfaces.map(_ => interfacesTemplate(_)).join(`\n\n`);

    if (fileObject.miscellaneous.enumerations) {
      // Create enums template
      fileObject.miscellaneous.enumerationsCode = fileObject.miscellaneous.enumerations.map(_ => enumerationsTemplate(_)).join(`\n\n`);
      delete fileObject.miscellaneous.enumerations;

      // Create variables template
      fileObject.miscellaneous.variablesCode = fileObject.miscellaneous.variables.map(_ => `const ${_.name} = ${_.defaultValue};`).join(`\n\n`);
      delete fileObject.miscellaneous.variables;
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

function accessorsTemplate(accessor: {
  description: string
  name: string
  returnType: string
  type: string
}) {
  return `${createDescription(accessor.description)}get ${accessor.name}()${accessor.returnType ? `: ${accessor.returnType}` : '' }`;
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

function interfacesTemplate(_interface: {
  name: string
  description: string
  methods: any[]
  properties: {
    name: string
    description: string
    optional: boolean
    type: string
  }[]
}) {
  const properties = _interface.properties.map(_ => interfacePropertyTemplate(_)).join(`\n`);
  return `${createDescription(_interface.description)}interface ${_interface.name} {\n${properties}\n}`;
}

function propertyTemplate(property: {
  name: string
  defaultValue: string
  type: string
  description: string
}) {
  return `${createDescription(property.description)}${property.name}: ${property.type || 'any'}`;
}

function interfacePropertyTemplate(property: {
  name: string
  description: string
  optional: boolean
  type: string
}) {
  return `${createDescription(property.description, '  ')}  ${property.name}${property.optional ? '?' : ''}: ${property.type}`;
}

function inputsTemplate(input: {name: string, type: string, description: string}) {
  const description = createDescription(input.description);
  return `${description}@Input() ${input.name}: ${input.type || 'any'}`;
}

function outputsTemplate(output: {
  name: string
  type: string
  description: string
  defaultValue: string
}) {
  const description = createDescription(output.description);
  return `${description}@Output() ${output.name} = ${output.defaultValue}`;
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
  description: string
}) {
  const args = method.args.map(_ => `${_.name}${_.optional ? '?' : ''}: ${_.type || 'any'}`).join(', ');
  return `${createDescription(method.description)}${method.name}(${args}): ${method.returnType}`;
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

function createDescription(text: string, prefix = '') {
  if (text) {
    const newText = decodeEntities(text.replace(/\<\/?p\>/g, '').trim().replace(/\<\/?code\>/g, `\``));
    const isMultiline = newText.split(/\n/g).length > 1;
    const lineStart = isMultiline ? `\n *` : '';
    const lineEnd = isMultiline ? `\n` : '';
    return newText ? `${prefix}/**${lineStart} ${newText.replace(/\n/g, `\n * `)}${lineEnd} */\n` : '';
  }
  return '';
}

function decodeEntities(encodedString) {
  const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  const translate = {
      'nbsp': ' ',
      'amp' : '&',
      'quot': '"',
      'lt'  : '<',
      'gt'  : '>'
  };
  return encodedString.replace(translate_re, function(match, entity) {
      return translate[entity];
  }).replace(/&#(\d+);/gi, function(match, numStr) {
      const num = parseInt(numStr, 10);
      return String.fromCharCode(num);
  });
}
