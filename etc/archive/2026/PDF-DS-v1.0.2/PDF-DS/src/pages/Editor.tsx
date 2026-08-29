import React, { useState } from 'react';
import { exportToZip } from '../utils/exportZip';

export type ElementType = 'panel' | 'heading' | 'paragraph' | 'primary-btn' | 'secondary-btn' | 'split-layout' | 'split-left' | 'split-right';

export interface EditorStyles {
  typography?: string;
  margin?: string;
  padding?: string;
  align?: string;
  size?: string;
}

export interface EditorElement {
  id: string;
  type: ElementType;
  content?: string;
  className?: string; // Custom PDF-DS classes
  styles?: EditorStyles;
  children: EditorElement[];
}

export default function Editor() {
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // View Modes
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isCodeMode, setIsCodeMode] = useState<boolean>(false);

  // ----------------------------------------------------------------------
  // Node Operations
  // ----------------------------------------------------------------------
  const addElement = (type: ElementType) => {
    const newEl: EditorElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: getDefaultContent(type),
      className: '',
      styles: {},
      children: []
    };

    if (type === 'split-layout') {
      newEl.children = [
        { id: Math.random().toString(36).substr(2, 9), type: 'split-left', styles: {}, children: [] },
        { id: Math.random().toString(36).substr(2, 9), type: 'split-right', styles: {}, children: [] }
      ];
    }

    if (selectedId) {
      const updateTree = (nodes: EditorElement[]): EditorElement[] => {
        return nodes.map(node => {
          if (node.id === selectedId) {
            // Allow appending children only to containers
            if (['panel', 'split-left', 'split-right'].includes(node.type)) {
              return { ...node, children: [...node.children, newEl] };
            }
            return node;
          }
          return { ...node, children: updateTree(node.children) };
        });
      };
      setElements(updateTree(elements));
    } else {
      setElements([...elements, newEl]);
    }
  };

  const getDefaultContent = (type: ElementType) => {
    switch (type) {
      case 'heading': return '새로운 제목 (H2)';
      case 'paragraph': return '본문 텍스트를 입력하세요.';
      case 'primary-btn': return '기본 버튼';
      case 'secondary-btn': return '보조 버튼';
      default: return '';
    }
  };

  const removeElement = (id: string) => {
    const removeFromTree = (nodes: EditorElement[]): EditorElement[] => {
      return nodes.filter(n => n.id !== id).map(n => ({
        ...n,
        children: removeFromTree(n.children)
      }));
    };
    setElements(removeFromTree(elements));
    if (selectedId === id) setSelectedId(null);
  };

  const updateElementProperty = (id: string, prop: 'content' | 'className', value: string) => {
    const updateTree = (nodes: EditorElement[]): EditorElement[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, [prop]: value };
        }
        return { ...node, children: updateTree(node.children) };
      });
    };
    setElements(updateTree(elements));
  };

  const updateElementStyle = (id: string, styleKey: keyof EditorStyles, value: string) => {
    const updateTree = (nodes: EditorElement[]): EditorElement[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, styles: { ...(node.styles || {}), [styleKey]: value } };
        }
        return { ...node, children: updateTree(node.children) };
      });
    };
    setElements(updateTree(elements));
  };

  const moveElementUp = (id: string) => {
    const moveInArray = (arr: EditorElement[]): EditorElement[] => {
      const index = arr.findIndex(n => n.id === id);
      if (index > 0) {
        const newArr = [...arr];
        const temp = newArr[index - 1];
        newArr[index - 1] = newArr[index];
        newArr[index] = temp;
        return newArr;
      }
      return arr.map(n => ({ ...n, children: moveInArray(n.children) }));
    };
    setElements(moveInArray(elements));
  };

  const getSelectedNode = (nodes: EditorElement[]): EditorElement | null => {
    for (const node of nodes) {
      if (node.id === selectedId) return node;
      const found = getSelectedNode(node.children);
      if (found) return found;
    }
    return null;
  };

  const selectedNode = selectedId ? getSelectedNode(elements) : null;

  // ----------------------------------------------------------------------
  // Renderers
  // ----------------------------------------------------------------------
  const getCombinedClasses = (node: EditorElement, baseClass: string) => {
    const s = node.styles || {};
    const classes = [baseClass];
    if (s.typography) classes.push(s.typography);
    if (s.margin) classes.push(s.margin);
    if (s.padding) classes.push(s.padding);
    if (s.align) classes.push(s.align);
    if (s.size) classes.push(s.size);
    if (node.className) classes.push(node.className);
    return classes.filter(Boolean).join(' ');
  };

  const generateHTMLString = (nodes: EditorElement[], indent = ''): string => {
    return nodes.map(node => {
      switch (node.type) {
        case 'panel':
          return `${indent}<div class="${getCombinedClasses(node, 'pdf-panel')}">\n${generateHTMLString(node.children, indent + '  ')}\n${indent}</div>`;
        case 'split-layout':
          return `${indent}<div class="${getCombinedClasses(node, 'pdf-flex-row')}">\n${generateHTMLString(node.children, indent + '  ')}\n${indent}</div>`;
        case 'split-left':
          return `${indent}<div class="${getCombinedClasses(node, '')}" style="width: 38%;">\n${generateHTMLString(node.children, indent + '  ')}\n${indent}</div>`;
        case 'split-right':
          return `${indent}<div class="${getCombinedClasses(node, '')}" style="width: 62%;">\n${generateHTMLString(node.children, indent + '  ')}\n${indent}</div>`;
        case 'heading':
          return `${indent}<h2 class="${getCombinedClasses(node, 'pdf-text-heading-32')}">${node.content}</h2>`;
        case 'paragraph':
          return `${indent}<p class="${getCombinedClasses(node, 'pdf-text-copy-14')}">${node.content}</p>`;
        case 'primary-btn':
          return `${indent}<button class="${getCombinedClasses(node, 'pdf-btn-primary')}">${node.content}</button>`;
        case 'secondary-btn':
          return `${indent}<button class="${getCombinedClasses(node, 'pdf-secondary-btn')}">${node.content}</button>`;
        default:
          return '';
      }
    }).join('\n');
  };

  const renderVisualNode = (node: EditorElement) => {
    const isSelected = node.id === selectedId && !isPreviewMode;
    const selectStyle = isSelected 
      ? { outline: '2px solid var(--color-functional-red)', outlineOffset: '2px', position: 'relative' as const } 
      : {};

    const onClick = (e: React.MouseEvent) => {
      if (isPreviewMode) return;
      e.stopPropagation();
      e.preventDefault();
      setSelectedId(node.id);
    };

    // To prevent actual button clicks from triggering
    const contentStyle = { pointerEvents: 'none' as const };

    switch (node.type) {
      case 'panel':
        return (
          <div key={node.id} className={getCombinedClasses(node, 'pdf-panel')} style={selectStyle} onClick={onClick}>
            {node.children.length > 0 ? node.children.map(renderVisualNode) : <div className="pdf-text-muted pdf-text-label-14-mono" style={contentStyle}>패널 (여기에 추가)</div>}
          </div>
        );
      case 'split-layout':
        return (
          <div key={node.id} className={getCombinedClasses(node, 'pdf-flex-row')} style={{ ...selectStyle, gap: '16px' }} onClick={onClick}>
            {node.children.map(renderVisualNode)}
          </div>
        );
      case 'split-left':
        return (
          <div key={node.id} className={getCombinedClasses(node, '')} style={{ ...selectStyle, width: '38%' }} onClick={onClick}>
            {node.children.length > 0 ? node.children.map(renderVisualNode) : <div className="pdf-text-muted pdf-text-label-14-mono" style={{ ...contentStyle, padding: '16px', border: '1px dashed var(--color-border-hover)' }}>좌측 (38%)</div>}
          </div>
        );
      case 'split-right':
        return (
          <div key={node.id} className={getCombinedClasses(node, '')} style={{ ...selectStyle, width: '62%' }} onClick={onClick}>
            {node.children.length > 0 ? node.children.map(renderVisualNode) : <div className="pdf-text-muted pdf-text-label-14-mono" style={{ ...contentStyle, padding: '16px', border: '1px dashed var(--color-border-hover)' }}>우측 (62%)</div>}
          </div>
        );
      case 'heading':
        return <h2 key={node.id} className={getCombinedClasses(node, 'pdf-text-heading-32')} style={selectStyle} onClick={onClick}><span style={contentStyle}>{node.content}</span></h2>;
      case 'paragraph':
        return <p key={node.id} className={getCombinedClasses(node, 'pdf-text-copy-14')} style={selectStyle} onClick={onClick}><span style={contentStyle}>{node.content}</span></p>;
      case 'primary-btn':
        return <button key={node.id} className={getCombinedClasses(node, 'pdf-btn-primary')} style={selectStyle} onClick={onClick}><span style={contentStyle}>{node.content}</span></button>;
      case 'secondary-btn':
        return <button key={node.id} className={getCombinedClasses(node, 'pdf-secondary-btn')} style={selectStyle} onClick={onClick}><span style={contentStyle}>{node.content}</span></button>;
      default:
        return null;
    }
  };

  const renderTree = (nodes: EditorElement[], level = 0) => {
    return nodes.map(node => (
      <div key={node.id} style={{ paddingLeft: level * 12, marginTop: 4 }}>
        <div 
          onClick={() => setSelectedId(node.id)}
          className="pdf-flex-row pdf-items-center pdf-justify-between"
          style={{ 
            cursor: 'pointer', 
            padding: '4px 8px',
            backgroundColor: selectedId === node.id ? 'var(--color-bg-secondary)' : 'transparent',
            borderLeft: selectedId === node.id ? '2px solid var(--color-functional-red)' : '2px solid transparent'
          }}
        >
          <span className="pdf-text-label-14-mono">{node.type}</span>
          <div className="pdf-flex-row pdf-gap-100">
            {node.type !== 'split-left' && node.type !== 'split-right' && (
              <>
                <button onClick={(e) => { e.stopPropagation(); moveElementUp(node.id); }} className="pdf-text-label-14-mono pdf-text-muted">↑</button>
                <button onClick={(e) => { e.stopPropagation(); removeElement(node.id); }} className="pdf-text-label-14-mono pdf-text-red">X</button>
              </>
            )}
          </div>
        </div>
        {node.children.length > 0 && renderTree(node.children, level + 1)}
      </div>
    ));
  };

  // ----------------------------------------------------------------------
  // Main Render
  // ----------------------------------------------------------------------
  if (isPreviewMode) {
    return (
      <div className="pdf-app pdf-flex-col">
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 999 }}>
          <button className="pdf-btn-primary" onClick={() => setIsPreviewMode(false)} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            프리뷰 종료 (Exit Preview)
          </button>
        </div>
        <main className="pdf-main-view pdf-grid-bg pdf-w-full" style={{ minHeight: '100vh', padding: 'var(--space-400)' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
            {elements.length === 0 ? (
              <div className="pdf-text-heading-32 pdf-text-muted pdf-text-center" style={{ marginTop: '100px' }}>비어 있음</div>
            ) : elements.map(renderVisualNode)}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="pdf-app">
      {/* LEFT PANE: Toolbox & DOM Tree */}
      <aside className="pdf-sidebar" style={{ width: '25%', borderRight: '1px solid var(--color-border-default)', overflowY: 'auto' }}>
        <div className="pdf-content-relative pdf-p-200">
          <div className="pdf-flex-row pdf-justify-between pdf-items-center pdf-mb-200">
            <h1 className="pdf-text-heading-32" style={{ fontSize: '24px' }}>PDF-DS Editor</h1>
            <a href="#/" className="pdf-text-label-14-mono pdf-text-muted" style={{ textDecoration: 'none' }}>나가기</a>
          </div>

          <div className="pdf-panel pdf-mb-200">
            <h3 className="pdf-text-label-16 pdf-mb-100">컴포넌트 삽입</h3>
            <div className="pdf-flex-row" style={{ gap: '8px', flexWrap: 'wrap' }}>
              <button className="pdf-secondary-btn" onClick={() => addElement('panel')}>Panel</button>
              <button className="pdf-secondary-btn" onClick={() => addElement('split-layout')}>38:62 Split</button>
              <button className="pdf-secondary-btn" onClick={() => addElement('heading')}>Heading</button>
              <button className="pdf-secondary-btn" onClick={() => addElement('paragraph')}>Paragraph</button>
              <button className="pdf-secondary-btn" onClick={() => addElement('primary-btn')}>Pri Btn</button>
              <button className="pdf-secondary-btn" onClick={() => addElement('secondary-btn')}>Sec Btn</button>
            </div>
            {selectedId && (
              <div className="pdf-mt-100">
                <button className="pdf-secondary-btn" onClick={() => setSelectedId(null)}>선택 해제 (최상위에 추가)</button>
              </div>
            )}
          </div>

          <div className="pdf-panel">
            <h3 className="pdf-text-label-16 pdf-mb-100">DOM 트리</h3>
            {elements.length === 0 ? (
              <p className="pdf-text-copy-14 pdf-text-muted">요소가 없습니다.</p>
            ) : (
              <div>{renderTree(elements)}</div>
            )}
          </div>
        </div>
      </aside>

      {/* CENTER PANE: Canvas or Code View */}
      <main className="pdf-main-view pdf-grid-bg pdf-relative" style={{ width: selectedNode ? '50%' : '75%', overflowY: 'auto' }} onClick={() => setSelectedId(null)}>
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', gap: '8px' }}>
          <button className="pdf-secondary-btn" onClick={(e) => { e.stopPropagation(); setIsCodeMode(!isCodeMode); }} style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            {isCodeMode ? '디자인 뷰 (Design)' : '코드 뷰 (Code)'}
          </button>
          <button className="pdf-secondary-btn" onClick={(e) => { e.stopPropagation(); setIsPreviewMode(true); }} style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            👁️ 미리보기
          </button>
          <button className="pdf-btn-primary" onClick={(e) => { e.stopPropagation(); exportToZip(elements); }}>
            ZIP 내보내기
          </button>
        </div>

        <div className="pdf-content-relative" style={{ padding: '64px 32px 32px 32px' }}>
          {isCodeMode ? (
            <div className="pdf-panel">
              <span className="pdf-text-label-14-mono pdf-text-muted pdf-mb-100" style={{ display: 'block' }}>GENERATED HTML</span>
              <pre className="pdf-text-copy-13-mono pdf-selectable" style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text-primary)' }}>
                {generateHTMLString(elements)}
              </pre>
            </div>
          ) : (
            <>
              {elements.length === 0 ? (
                <div className="pdf-text-heading-32 pdf-text-muted pdf-text-center" style={{ marginTop: '100px' }}>
                  좌측에서 요소를 추가하세요
                </div>
              ) : (
                elements.map(renderVisualNode)
              )}
            </>
          )}
        </div>
      </main>

      {/* RIGHT PANE: Properties Inspector */}
      {selectedNode && (
        <aside className="pdf-sidebar pdf-border-left" style={{ width: '25%', overflowY: 'auto', backgroundColor: 'var(--color-bg-primary)' }}>
          <div className="pdf-p-200">
            <div className="pdf-flex-row pdf-justify-between pdf-items-center pdf-mb-200">
              <h3 className="pdf-text-label-16 pdf-font-bold">속성 (Properties)</h3>
              <span className="pdf-text-label-14-mono pdf-text-red">{selectedNode.type}</span>
            </div>

            {/* Content Field (if applicable) */}
            {!['panel', 'split-layout', 'split-left', 'split-right'].includes(selectedNode.type) && (
              <div className="pdf-mb-200">
                <label className="pdf-text-label-14-mono pdf-mb-050" style={{ display: 'block' }}>텍스트 (Content)</label>
                <textarea 
                  className="pdf-text-copy-14"
                  style={{ width: '100%', minHeight: '80px', padding: '8px', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)', borderRadius: '4px', resize: 'vertical' }}
                  value={selectedNode.content || ''}
                  onChange={(e) => updateElementProperty(selectedNode.id, 'content', e.target.value)}
                />
              </div>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-default)', margin: '16px 0' }} />

            {/* Button Size Dropdown (Only for buttons) */}
            {(selectedNode.type === 'primary-btn' || selectedNode.type === 'secondary-btn') && (
              <div className="pdf-mb-200">
                <label className="pdf-text-label-14-mono pdf-mb-050" style={{ display: 'block' }}>버튼 크기 (Button Size)</label>
                <select 
                  className="pdf-text-copy-14"
                  style={{ width: '100%', padding: '8px', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)', borderRadius: '4px' }}
                  value={selectedNode.styles?.size || ''}
                  onChange={(e) => updateElementStyle(selectedNode.id, 'size', e.target.value)}
                >
                  <option value="">(기본값 - MD 44px)</option>
                  <option value="pdf-btn-xs">XS (초소형 - 32px)</option>
                  <option value="pdf-btn-sm">S (소형 - 40px)</option>
                  <option value="pdf-btn-md">M (중형 - 44px)</option>
                  <option value="pdf-btn-lg">L (대형 - 48px)</option>
                  <option value="pdf-btn-xl">XL (초대형 - 56px)</option>
                </select>
              </div>
            )}

            {/* Typography Dropdown */}
            <div className="pdf-mb-200">
              <label className="pdf-text-label-14-mono pdf-mb-050" style={{ display: 'block' }}>타이포그래피 (Typography)</label>
              <select 
                className="pdf-text-copy-14"
                style={{ width: '100%', padding: '8px', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)' }}
                value={selectedNode.styles?.typography || ''}
                onChange={(e) => updateElementStyle(selectedNode.id, 'typography', e.target.value)}
              >
                <option value="">(기본값)</option>
                <option value="pdf-text-heading-72">Heading 72 (초대형)</option>
                <option value="pdf-text-heading-32">Heading 32 (대형)</option>
                <option value="pdf-text-label-16">Label 16 (서브타이틀)</option>
                <option value="pdf-text-label-14-mono">Label 14 Mono (고정폭)</option>
                <option value="pdf-text-copy-14">Copy 14 (본문)</option>
                <option value="pdf-text-copy-13-mono">Copy 13 Mono (인라인)</option>
              </select>
            </div>

            {/* Margin Dropdown */}
            <div className="pdf-mb-200">
              <label className="pdf-text-label-14-mono pdf-mb-050" style={{ display: 'block' }}>하단 여백 (Margin Bottom)</label>
              <select 
                className="pdf-text-copy-14"
                style={{ width: '100%', padding: '8px', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)' }}
                value={selectedNode.styles?.margin || ''}
                onChange={(e) => updateElementStyle(selectedNode.id, 'margin', e.target.value)}
              >
                <option value="">(기본값)</option>
                <option value="pdf-mb-050">Space-050 (4px)</option>
                <option value="pdf-mb-100">Space-100 (8px)</option>
                <option value="pdf-mb-150">Space-150 (12px)</option>
                <option value="pdf-mb-200">Space-200 (16px)</option>
                <option value="pdf-mb-300">Space-300 (24px)</option>
                <option value="pdf-mb-400">Space-400 (32px)</option>
              </select>
            </div>

            {/* Padding Dropdown */}
            <div className="pdf-mb-200">
              <label className="pdf-text-label-14-mono pdf-mb-050" style={{ display: 'block' }}>내부 패딩 (Padding)</label>
              <select 
                className="pdf-text-copy-14"
                style={{ width: '100%', padding: '8px', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)' }}
                value={selectedNode.styles?.padding || ''}
                onChange={(e) => updateElementStyle(selectedNode.id, 'padding', e.target.value)}
              >
                <option value="">(기본값)</option>
                <option value="pdf-p-100">Space-100 (8px)</option>
                <option value="pdf-p-200">Space-200 (16px)</option>
                <option value="pdf-p-300">Space-300 (24px)</option>
                <option value="pdf-p-400">Space-400 (32px)</option>
              </select>
            </div>

            {/* Align Dropdown */}
            <div className="pdf-mb-200">
              <label className="pdf-text-label-14-mono pdf-mb-050" style={{ display: 'block' }}>정렬 (Alignment)</label>
              <select 
                className="pdf-text-copy-14"
                style={{ width: '100%', padding: '8px', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)' }}
                value={selectedNode.styles?.align || ''}
                onChange={(e) => updateElementStyle(selectedNode.id, 'align', e.target.value)}
              >
                <option value="">(기본값)</option>
                <option value="pdf-text-left">좌측 정렬 (Left)</option>
                <option value="pdf-text-center">중앙 정렬 (Center)</option>
                <option value="pdf-text-right">우측 정렬 (Right)</option>
              </select>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-default)', margin: '16px 0' }} />

            {/* Custom Classes */}
            <div className="pdf-mb-200">
              <label className="pdf-text-label-14-mono pdf-mb-050" style={{ display: 'block' }}>사용자 커스텀 클래스</label>
              <input 
                type="text"
                className="pdf-text-copy-14"
                style={{ width: '100%', padding: '8px', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)', borderRadius: '4px' }}
                placeholder="ex) text-red-500"
                value={selectedNode.className || ''}
                onChange={(e) => updateElementProperty(selectedNode.id, 'className', e.target.value)}
              />
              <p className="pdf-text-copy-13-mono pdf-text-muted pdf-mt-050" style={{ marginTop: '4px' }}>
                직접 CSS 클래스명을 적을 수 있습니다.
              </p>
            </div>
            
          </div>
        </aside>
      )}
    </div>
  );
}
