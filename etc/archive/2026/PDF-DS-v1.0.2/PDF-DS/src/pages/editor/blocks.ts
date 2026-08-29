import { EditorNode, NodeType } from './types';

const generateId = () => 'node-' + Math.random().toString(36).substr(2, 9);

export const createNode = (
  type: NodeType,
  classes: string[] = [],
  content?: string,
  attributes: Record<string, string> = {},
  styles: React.CSSProperties = {},
  children: EditorNode[] = []
): EditorNode => ({
  id: generateId(),
  type,
  classes,
  styles,
  content,
  attributes,
  children
});

export const Blocks = {
  // Primitives
  Div: () => createNode('div', [], 'Empty Container'),
  Text: () => createNode('p', ['pdf-text-copy-14'], '텍스트를 입력하세요'),
  Heading: () => createNode('h2', ['pdf-text-heading-32'], '새로운 제목'),
  Image: () => createNode('img', ['pdf-w-full', 'pdf-radius-md', 'pdf-border'], undefined, { src: 'https://via.placeholder.com/800x400?text=Placeholder+Image', alt: 'Placeholder' }),
  Button: () => createNode('button', ['pdf-btn-primary'], 'Click Me', { href: '' }),
  Link: () => createNode('a', ['pdf-text-copy-14', 'pdf-text-red'], 'Link Text', { href: '#' }),

  // Composite Blocks
  Panel: () => createNode('div', ['pdf-panel', 'pdf-p-400', 'pdf-bg-secondary'], undefined, {}, {}, [
    createNode('h3', ['pdf-text-heading-24', 'pdf-mb-200'], '패널 제목'),
    createNode('p', ['pdf-text-copy-14'], '이곳에 패널 내용을 작성하세요.')
  ]),
  
  SplitLayout: () => createNode('div', ['pdf-flex-row', 'pdf-gap-400'], undefined, {}, {}, [
    createNode('div', [], undefined, {}, { width: '25%' }, [
      createNode('p', ['pdf-text-muted'], 'Left Side (25%)')
    ]),
    createNode('div', [], undefined, {}, { width: '75%' }, [
      createNode('p', ['pdf-text-muted'], 'Right Side (75%)')
    ])
  ]),
  
  HeroSection: () => createNode('div', ['pdf-panel', 'pdf-grid-bg', 'pdf-p-400', 'pdf-mb-400'], undefined, {}, {}, [
    createNode('span', ['pdf-text-label-14-mono', 'pdf-text-red', 'pdf-mb-100'], 'CHAPTER XX'),
    createNode('h1', ['pdf-text-heading-72'], 'Hero Title')
  ]),

  CodeBlock: () => createNode('div', ['pdf-panel', 'pdf-bg-secondary', 'pdf-p-200', 'pdf-radius-md'], undefined, {}, {}, [
    createNode('span', ['pdf-text-label-13-mono', 'pdf-text-muted'], 'Code Snippet')
  ])
};
