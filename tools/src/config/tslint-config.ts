export const tslintConfig = {
  'extends': '../../../tslint.json',
  'rules': {
    'directive-selector': [
      true,
      'attribute',
      'ly',
      'camelCase'
    ],
    'component-selector': [
      true,
      'element',
      'ly',
       'kebab-case'
    ]
  }
};
