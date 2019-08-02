import * as ts from 'typescript';

export function findNode(node: ts.Node, kind: ts.SyntaxKind) {
  if (node.kind === kind) {
      return node;
  }
  let foundNode: null | ts.Node = null;
  ts.forEachChild(node, childNode => {
      foundNode = foundNode || findNode(childNode, kind);
  });
  return foundNode;
}

export function getNodes(node: ts.Node) {
  const nodes: ts.Node[] = [];
  ts.forEachChild(node, childNode => nodes.push(childNode));
  return nodes;
}
