
let customClass: null | {
  [key: string]: string
} = null;

const classList = [
  'pre',
  'code',
  'inline',
  'token',
  'keyword',
  'selector-tag',
  'title',
  'section',
  'doctag',
  'name',
  'strong',
  'comment',
  'string',
  'built_in',
  'literal',
  'type',
  'addition',
  'tag',
  'quote',
  'selector-id',
  'selector-class',
  'meta',
  'subst',
  'symbol',
  'regexp',
  'attribute',
  'deletion',
  'variable',
  'template-variable',
  'link',
  'bullet',
  'emphasis',
  'function',
  'punctuation',
  'number',
  'operator',
  'constant',
  'attr-value',
  'attr-name',
  'class-name',
  'builtin',
  'property',
  'selector',
  'at',
  'decorator',
  'template-string',
  'boolean',
  'function-variable'
]; // Must be equal to: Alyle-UI/src/app/core/prism-custom-class.ts
export const prismCustomClass = () => {
  if (!customClass) {
    customClass = {};
    classList.forEach((className, index) => {
      customClass![className] = `tt${(index * 11 + 11).toString(36)}`;
    });
  }
  return customClass;
};
