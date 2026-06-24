import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../store';
import { EditorNode } from '../types';
import { DndContext, closestCenter, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableNode = ({ node }: { node: EditorNode }) => {
  const { selectedNodeId, setSelectedNodeId, updateNode } = useEditorStore();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: node.id });
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.content || '');

  useEffect(() => {
    setEditValue(node.content || '');
  }, [node.content]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    outline: selectedNodeId === node.id ? '2px solid var(--color-functional-red)' : '1px dashed transparent',
    outlineOffset: '-1px',
    cursor: 'grab',
    wordBreak: 'break-word',
    ...node.styles
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (['div', 'img', 'svg'].includes(node.type)) return;
    setIsEditing(true);
  };

  const combinedClasses = node.classes.join(' ');
  const elAttributes = { ...node.attributes, className: combinedClasses, style, onClick: handleClick, onDoubleClick: handleDoubleClick, ref: setNodeRef, ...attributes, ...listeners };

  let inner: React.ReactNode = node.content ? node.content.split('\\n').map((line, i, arr) => (
    <React.Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </React.Fragment>
  )) : '';
  
  if (isEditing) {
    inner = (
      <textarea
        autoFocus
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={() => {
          setIsEditing(false);
          updateNode(node.id, { content: editValue });
        }}
        onKeyDown={(e) => {
          // ESC 키로 취소/저장
          if (e.key === 'Escape') {
            setIsEditing(false);
            updateNode(node.id, { content: editValue });
          }
        }}
        style={{
          width: '100%',
          minHeight: '1em',
          font: 'inherit',
          color: 'inherit',
          background: 'transparent',
          border: '1px solid var(--color-functional-red)',
          resize: 'none',
          outline: 'none',
          padding: 0,
          margin: 0,
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      />
    );
  } else if (node.children.length > 0) {
    inner = (
      <SortableContext items={node.children.map(c => c.id)} strategy={verticalListSortingStrategy}>
        {node.children.map(child => <SortableNode key={child.id} node={child} />)}
      </SortableContext>
    ) as any;
  }

  switch (node.type) {
    case 'div': return <div {...elAttributes}>{inner}</div>;
    case 'span': return <span {...elAttributes}>{inner}</span>;
    case 'p': return <p {...elAttributes}>{inner}</p>;
    case 'h1': return <h1 {...elAttributes}>{inner}</h1>;
    case 'h2': return <h2 {...elAttributes}>{inner}</h2>;
    case 'h3': return <h3 {...elAttributes}>{inner}</h3>;
    case 'button': return <button {...elAttributes}>{inner}</button>;
    case 'a': return <a {...elAttributes} href={node.attributes.href || '#'}>{inner}</a>;
    case 'img': return <img {...elAttributes} src={node.attributes.src} alt={node.attributes.alt} />;
    case 'input': return <input {...elAttributes} type="text" placeholder={node.attributes.placeholder} />;
    default: return <div {...elAttributes}>{inner}</div>;
  }
};

export default function CanvasArea() {
  const { getActivePageRoot, moveNode, selectedNodeId, setSelectedNodeId, removeNode } = useEditorStore();
  const rootNode = getActivePageRoot();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px 드래그 전에는 클릭 이벤트로 인식
      },
    })
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력창 등에서 타이핑 중일 때는 무시
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        removeNode(selectedNodeId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, removeNode]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // In a full tree, we need to know the parent. 
      // For simplicity in this demo, we assume moving within the same parent or we just move visually.
      // Implementing a full generic tree drag & drop requires flattening the tree.
      // As a fallback, we'll keep the DOM tree for structural moves and use this for simple reordering.
    }
  };

  if (!rootNode) return null;

  return (
    <main 
      className="pdf-grid-bg pdf-relative" 
      style={{ 
        flex: 1, 
        width: '100%', 
        height: '100%', 
        overflowY: 'auto', 
        padding: 'var(--space-400)',
        backgroundColor: 'var(--color-bg-primary)'
      }} 
      onClick={() => setSelectedNodeId(null)}
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', minHeight: '100%' }}>
          <SortableContext items={rootNode.children.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {rootNode.children.map(child => <SortableNode key={child.id} node={child} />)}
          </SortableContext>
        </div>
      </DndContext>
    </main>
  );
}
