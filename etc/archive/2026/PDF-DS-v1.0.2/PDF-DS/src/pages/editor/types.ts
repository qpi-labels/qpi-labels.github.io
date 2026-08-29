export type NodeType = 
  | 'div' 
  | 'span' 
  | 'p' 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'button' 
  | 'a' 
  | 'img' 
  | 'svg' 
  | 'input' 
  | 'textarea';

export interface EditorNode {
  id: string;
  type: NodeType;
  classes: string[];
  styles: React.CSSProperties;
  content?: string;
  attributes: Record<string, string>; // e.g. src, href, placeholder
  children: EditorNode[];
}

export interface EditorPageItem {
  id: string;
  title: string;
  category?: string;
  rootNode: EditorNode;
}
