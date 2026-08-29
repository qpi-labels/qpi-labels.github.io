import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { EditorPageItem, EditorNode, NodeType } from './types';

// Helper to generate UUID-like string
const generateId = () => 'node-' + Math.random().toString(36).substr(2, 9);

interface EditorContextProps {
  appTitle: string;
  appDescription: string;
  setAppTitle: (title: string) => void;
  setAppDescription: (desc: string) => void;

  pages: EditorPageItem[];
  activePageId: string | null;
  selectedNodeId: string | null;
  
  // Page actions
  addPage: (title: string, category?: string) => void;
  removePage: (id: string) => void;
  setActivePage: (id: string) => void;
  updatePageTitle: (id: string, title: string) => void;
  updatePageTitleAndCategory: (id: string, title: string, category: string | undefined) => void;
  
  // Category actions
  customCategories: string[];
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;
  renameCategory: (oldName: string, newName: string) => void;
  movePage: (draggedId: string, targetId: string) => void;
  movePageToCategory: (pageId: string, category: string) => void;
  
  // Node actions
  addNode: (node: EditorNode, parentId?: string, index?: number) => void;
  removeNode: (id: string) => void;
  moveNode: (id: string, targetParentId: string, targetIndex: number) => void;
  updateNode: (id: string, updates: Partial<EditorNode>) => void;
  setSelectedNodeId: (id: string | null) => void;

  // Project actions
  loadProject: (pages: EditorPageItem[], title: string, desc: string) => void;
  
  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Utils
  getActivePageRoot: () => EditorNode | null;
  getSelectedNode: () => EditorNode | null;
}

const EditorContext = createContext<EditorContextProps | undefined>(undefined);

const createEmptyRoot = (): EditorNode => ({
  id: generateId(),
  type: 'div',
  classes: ['pdf-main-content'],
  styles: {},
  attributes: {},
  children: []
});

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [appTitle, setAppTitle] = useState('PDF-DS System');
  const [appDescription, setAppDescription] = useState('물리-디지털 융합 디자인 가이드라인');
  
  const [pages, setPages] = useState<EditorPageItem[]>([
    { id: 'home', title: '홈', rootNode: createEmptyRoot() }
  ]);
  const [activePageId, setActivePageId] = useState<string | null>('home');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  
  const [history, setHistory] = useState<{ pages: EditorPageItem[]; appTitle: string; appDescription: string }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const historyRef = useRef(history);
  const historyIndexRef = useRef(historyIndex);
  
  useEffect(() => {
    historyRef.current = history;
    historyIndexRef.current = historyIndex;
  }, [history, historyIndex]);

  useEffect(() => {
    const initialEntry = { 
      pages: JSON.parse(JSON.stringify(pages)), 
      appTitle, 
      appDescription 
    };
    setHistory([initialEntry]);
    setHistoryIndex(0);
  }, []);
  const updatePagesWithHistory = (newPages: EditorPageItem[]) => {
    setPages(newPages);
    const cleanHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    const newEntry = { 
      pages: JSON.parse(JSON.stringify(newPages)), 
      appTitle, 
      appDescription 
    };
    setHistory([...cleanHistory, newEntry]);
    setHistoryIndex(cleanHistory.length);
  };

  const undo = () => {
    if (historyIndexRef.current > 0) {
      const nextIndex = historyIndexRef.current - 1;
      const entry = historyRef.current[nextIndex];
      setPages(JSON.parse(JSON.stringify(entry.pages)));
      setAppTitle(entry.appTitle);
      setAppDescription(entry.appDescription);
      setHistoryIndex(nextIndex);
    }
  };

  const redo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      const nextIndex = historyIndexRef.current + 1;
      const entry = historyRef.current[nextIndex];
      setPages(JSON.parse(JSON.stringify(entry.pages)));
      setAppTitle(entry.appTitle);
      setAppDescription(entry.appDescription);
      setHistoryIndex(nextIndex);
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl) {
        const tagName = activeEl.tagName.toLowerCase();
        const isEditable = activeEl.getAttribute('contenteditable') === 'true';
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select' || isEditable) {
          return;
        }
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if (e.key.toLowerCase() === 'y') {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pages, history, historyIndex, appTitle, appDescription]);

  const addPage = (title: string, category?: string) => {
    const newId = title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + generateId();
    updatePagesWithHistory([...pages, { id: newId, title, category: category || undefined, rootNode: createEmptyRoot() }]);
    setActivePageId(newId);
  };

  const removePage = (id: string) => {
    if (pages.length <= 1) return;
    const newPages = pages.filter(p => p.id !== id);
    updatePagesWithHistory(newPages);
    if (activePageId === id) {
      setActivePageId(newPages[0].id);
      setSelectedNodeId(null);
    }
  };

  const setActivePage = (id: string) => {
    setActivePageId(id);
    setSelectedNodeId(null);
  };

  const updatePageTitle = (id: string, title: string) => {
    updatePagesWithHistory(pages.map(p => p.id === id ? { ...p, title } : p));
  };

  const updatePageTitleAndCategory = (id: string, title: string, category: string | undefined) => {
    updatePagesWithHistory(pages.map(p => p.id === id ? { ...p, title, category: category?.trim() || undefined } : p));
  };

  const addCategory = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !customCategories.includes(trimmed)) {
      setCustomCategories([...customCategories, trimmed]);
    }
  };

  const deleteCategory = (name: string) => {
    updatePagesWithHistory(pages.map(p => p.category === name ? { ...p, category: undefined } : p));
    setCustomCategories(customCategories.filter(c => c !== name));
  };

  const renameCategory = (oldName: string, newName: string) => {
    const trimmedNew = newName.trim();
    if (!trimmedNew) return;
    updatePagesWithHistory(pages.map(p => p.category === oldName ? { ...p, category: trimmedNew } : p));
    setCustomCategories(customCategories.map(c => c === oldName ? trimmedNew : c));
  };

  const movePage = (draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;
    const draggedIdx = pages.findIndex(p => p.id === draggedId);
    const targetIdx = pages.findIndex(p => p.id === targetId);
    if (draggedIdx === -1 || targetIdx === -1) return;

    const targetPage = pages[targetIdx];
    const newPages = [...pages];
    const [draggedPage] = newPages.splice(draggedIdx, 1);
    
    draggedPage.category = targetPage.category;
    
    const insertIdx = newPages.findIndex(p => p.id === targetId);
    newPages.splice(insertIdx, 0, draggedPage);
    updatePagesWithHistory(newPages);
  };

  const movePageToCategory = (pageId: string, category: string) => {
    const pageToMove = pages.find(p => p.id === pageId);
    if (!pageToMove) return;

    const targetCategory = category || undefined;
    const rest = pages.filter(p => p.id !== pageId);
    const updatedPage = { ...pageToMove, category: targetCategory };

    const lastIndexInCat = rest.reduce((lastIdx, p, idx) => {
      if ((p.category || '') === (category || '')) return idx;
      return lastIdx;
    }, -1);

    if (lastIndexInCat === -1) {
      updatePagesWithHistory([...rest, updatedPage]);
    } else {
      const result = [...rest];
      result.splice(lastIndexInCat + 1, 0, updatedPage);
      updatePagesWithHistory(result);
    }
  };

  const updateTree = (root: EditorNode, updater: (node: EditorNode) => EditorNode): EditorNode => {
    const newNode = updater(root);
    return {
      ...newNode,
      children: newNode.children.map(child => updateTree(child, updater))
    };
  };

  const addNode = (node: EditorNode, parentId?: string, index?: number) => {
    if (!activePageId) return;
    updatePagesWithHistory(pages.map(page => {
      if (page.id !== activePageId) return page;
      const targetId = parentId || page.rootNode.id;
      
      const newRoot = updateTree(page.rootNode, (n) => {
        if (n.id === targetId) {
          const newChildren = [...n.children];
          if (index !== undefined) {
            newChildren.splice(index, 0, node);
          } else {
            newChildren.push(node);
          }
          return { ...n, children: newChildren };
        }
        return n;
      });
      return { ...page, rootNode: newRoot };
    }));
  };

  const removeNode = (id: string) => {
    if (!activePageId) return;
    updatePagesWithHistory(pages.map(page => {
      if (page.id !== activePageId) return page;
      if (page.rootNode.id === id) return page; // Cannot remove root

      const removeFromTree = (node: EditorNode): EditorNode => {
        return {
          ...node,
          children: node.children.filter(c => c.id !== id).map(removeFromTree)
        };
      };
      
      return { ...page, rootNode: removeFromTree(page.rootNode) };
    }));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const moveNode = (id: string, targetParentId: string, targetIndex: number) => {
    if (!activePageId) return;
    updatePagesWithHistory(pages.map(page => {
      if (page.id !== activePageId) return page;
      
      // 1. Find the node
      let nodeToMove: EditorNode | null = null;
      const findNode = (n: EditorNode) => {
        if (n.id === id) nodeToMove = n;
        n.children.forEach(findNode);
      };
      findNode(page.rootNode);
      if (!nodeToMove) return page;

      // 2. Remove from old parent
      let tempRoot = updateTree(page.rootNode, (n) => ({
        ...n,
        children: n.children.filter(c => c.id !== id)
      }));

      // 3. Insert to new parent
      tempRoot = updateTree(tempRoot, (n) => {
        if (n.id === targetParentId) {
          const newChildren = [...n.children];
          newChildren.splice(targetIndex, 0, nodeToMove!);
          return { ...n, children: newChildren };
        }
        return n;
      });

      return { ...page, rootNode: tempRoot };
    }));
  };

  const updateNode = (id: string, updates: Partial<EditorNode>) => {
    if (!activePageId) return;
    updatePagesWithHistory(pages.map(page => {
      if (page.id !== activePageId) return page;
      const newRoot = updateTree(page.rootNode, (n) => {
        if (n.id === id) {
          return { ...n, ...updates };
        }
        return n;
      });
      return { ...page, rootNode: newRoot };
    }));
  };

  const loadProject = (loadedPages: EditorPageItem[], title: string, desc: string) => {
    setPages(loadedPages);
    setAppTitle(title);
    setAppDescription(desc);
    setActivePageId(loadedPages.length > 0 ? loadedPages[0].id : null);
    setSelectedNodeId(null);
  };

  const getActivePageRoot = () => {
    return pages.find(p => p.id === activePageId)?.rootNode || null;
  };

  const getSelectedNode = () => {
    const root = getActivePageRoot();
    if (!root || !selectedNodeId) return null;
    let found: EditorNode | null = null;
    const findNode = (n: EditorNode) => {
      if (n.id === selectedNodeId) found = n;
      if (!found) n.children.forEach(findNode);
    };
    findNode(root);
    return found;
  };

  return (
    <EditorContext.Provider value={{
      appTitle, appDescription, setAppTitle, setAppDescription,
      pages, activePageId, selectedNodeId,
      addPage, removePage, setActivePage, updatePageTitle, updatePageTitleAndCategory,
      customCategories, addCategory, deleteCategory, renameCategory, movePage, movePageToCategory,
      addNode, removeNode, moveNode, updateNode,
      setSelectedNodeId,
      loadProject,
      undo, redo, canUndo, canRedo,
      getActivePageRoot, getSelectedNode
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorStore = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditorStore must be used within EditorProvider');
  }
  return context;
};
