import React, { useState, useRef } from 'react';
import { useEditorStore } from '../store';

import { exportToZip } from '../utils/exportHtml';
import { importFromZip } from '../utils/importZip';

export default function PageSidebar({ onPreview }: { onPreview: () => void }) {
  const { 
    pages, activePageId, addPage, removePage, setActivePage, updatePageTitleAndCategory, 
    appTitle, appDescription, loadProject,
    customCategories, addCategory, deleteCategory, renameCategory, movePage, movePageToCategory 
  } = useEditorStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editCatVal, setEditCatVal] = useState('');
  
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  
  const [dragOverCat, setDragOverCat] = useState<string | null>(null);
  const [dragOverPageId, setDragOverPageId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPage = () => {
    addPage('New Page');
  };

  const handleCreateCategory = () => {
    if (newCatName.trim()) {
      addCategory(newCatName.trim());
      setNewCatName('');
      setShowAddCat(false);
    }
  };

  const handleExportZip = async () => {
    try {
      await exportToZip(pages, appTitle, appDescription);
    } catch (e) {
      console.error('Failed to export zip:', e);
      alert('ZIP 내보내기 실패');
    }
  };

  const handleImportZip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await importFromZip(
      file,
      (loadedPages, title, desc) => {
        loadProject(loadedPages, title, desc);
      },
      (errorMsg) => {
        alert(errorMsg);
      }
    );
    e.target.value = ''; // Reset input
  };

  const startEdit = (id: string, title: string, category?: string) => {
    setEditingId(id);
    setEditTitle(title);
    setEditCategory(category || '');
  };

  const saveEdit = (id: string) => {
    updatePageTitleAndCategory(id, editTitle, editCategory);
    setEditingId(null);
  };

  const toggleCategory = (cat: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const startRenameCat = (cat: string) => {
    setEditingCat(cat);
    setEditCatVal(cat);
  };

  const saveRenameCat = (oldName: string) => {
    if (editCatVal.trim() && editCatVal !== oldName) {
      renameCategory(oldName, editCatVal.trim());
    }
    setEditingCat(null);
  };

  // Combine all categories (from pages + empty custom categories)
  const allCategoriesSet = new Set<string>();
  pages.forEach(p => allCategoriesSet.add(p.category || ''));
  customCategories.forEach(c => allCategoriesSet.add(c));
  
  // Group pages
  const categoriesMap: Record<string, typeof pages> = {};
  allCategoriesSet.forEach(cat => {
    categoriesMap[cat] = [];
  });
  pages.forEach(page => {
    const cat = page.category || '';
    categoriesMap[cat].push(page);
  });

  // Sort categories: Uncategorized ('') last, others alphabetically
  const sortedCategories = Array.from(allCategoriesSet).sort((a, b) => {
    if (a === '') return 1;
    if (b === '') return -1;
    return a.localeCompare(b);
  });

  return (
    <aside className="pdf-sidebar" style={{ width: '25%', borderRight: '1px solid var(--color-border-default)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="pdf-content-relative pdf-p-300" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="pdf-mb-300">
          <span className="pdf-text-label-14-mono pdf-text-red pdf-mb-100" style={{ display: 'block' }}>
            {appDescription || '사이트 설명을 입력하세요'}
          </span>
          <div className="pdf-flex-row pdf-justify-between pdf-items-center pdf-mb-100">
            <h1 className="pdf-text-heading-32">{appTitle || '사이트 제목'}</h1>
          </div>
        </div>

        <nav>
          <span className="pdf-text-label-14-mono pdf-text-muted pdf-border-bottom pdf-pb-100 pdf-mb-100 pdf-font-bold" style={{ display: 'block' }}>
            SITE NAVIGATOR
          </span>
          
          <div className="pdf-mb-200">
            {sortedCategories.map(cat => {
              const catPages = categoriesMap[cat];
              const catDisplayName = cat === '' ? '미분류 페이지' : cat;
              const isCollapsed = collapsedCategories[cat] || false;
              const isDraggingOverCat = dragOverCat === cat;

              return (
                <div 
                  key={cat} 
                  className="pdf-mb-150"
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (cat !== '') setDragOverCat(cat);
                  }}
                  onDragLeave={() => {
                    setDragOverCat(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverCat(null);
                    const pageId = e.dataTransfer.getData('text/plain');
                    if (pageId) {
                      movePageToCategory(pageId, cat);
                    }
                  }}
                  style={{
                    border: isDraggingOverCat ? '2px dashed var(--color-functional-red)' : '2px dashed transparent',
                    borderRadius: '6px',
                    padding: '2px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Category Header */}
                  <div 
                    className="pdf-nav-group-header" 
                    onClick={() => toggleCategory(cat)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      margin: '12px 0 6px 0', 
                      padding: '6px 8px',
                      backgroundColor: isDraggingOverCat ? 'var(--color-red-light)' : 'var(--color-bg-secondary)',
                      borderRadius: '4px'
                    }}
                  >
                    <div className="pdf-flex-row pdf-items-center pdf-gap-100" style={{ flex: 1 }} onClick={(e) => editingCat === cat && e.stopPropagation()}>
                      {editingCat === cat ? (
                        <div className="pdf-flex-row pdf-items-center pdf-gap-050" style={{ width: '100%' }}>
                          <input
                            autoFocus
                            type="text"
                            value={editCatVal}
                            className="pdf-input pdf-input-sm"
                            style={{ padding: '4px 8px', fontSize: '13px', width: '120px' }}
                            onChange={(e) => setEditCatVal(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveRenameCat(cat)}
                          />
                          <button 
                            className="pdf-text-label-14-mono pdf-text-red pdf-font-bold" 
                            style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}
                            onClick={() => saveRenameCat(cat)}
                          >
                            Ok
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="pdf-text-label-14-mono" style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            📁 {catDisplayName}
                          </span>
                          <span className="pdf-text-label-14-mono pdf-text-muted" style={{ fontSize: '11px' }}>
                            ({catPages.length})
                          </span>
                        </>
                      )}
                    </div>
                    
                    <div className="pdf-flex-row pdf-items-center pdf-gap-100" onClick={(e) => e.stopPropagation()}>
                      {editingCat !== cat && cat !== '' && (
                        <>
                          <button 
                            className="pdf-text-label-14-mono pdf-text-muted"
                            style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '11px' }}
                            onClick={() => startRenameCat(cat)}
                          >
                            Edit
                          </button>
                          <button 
                            className="pdf-text-label-14-mono pdf-text-red"
                            style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '11px', padding: '0 4px' }}
                            onClick={() => {
                              if (confirm(`'${catDisplayName}' 대분류를 삭제하시겠습니까?\n(소속된 페이지는 미분류로 이동합니다.)`)) {
                                deleteCategory(cat);
                              }
                            }}
                          >
                            X
                          </button>
                        </>
                      )}
                      <svg 
                        className={`pdf-chevron ${isCollapsed ? 'collapsed' : ''}`} 
                        viewBox="0 0 24 24"
                        style={{ width: 12, height: 12, fill: 'currentColor', marginLeft: 4, cursor: 'pointer' }}
                        onClick={() => toggleCategory(cat)}
                      >
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </div>
                  </div>

                  {/* Pages list */}
                  {!isCollapsed && (
                    <div className="pdf-flex-col pdf-gap-050" style={{ paddingLeft: '8px', borderLeft: '1px solid var(--color-border-default)', marginLeft: '8px', minHeight: catPages.length === 0 ? '24px' : 'auto' }}>
                      {catPages.length === 0 ? (
                        <div className="pdf-text-copy-13-mono pdf-text-muted" style={{ padding: '8px', fontSize: '12px' }}>페이지를 여기로 드래그하세요</div>
                      ) : (
                        catPages.map(page => {
                          const isSelected = activePageId === page.id;
                          const globalIdx = pages.findIndex(p => p.id === page.id);
                          const num = globalIdx + 1;
                          const isDraggingOverPage = dragOverPageId === page.id;
                          
                          return (
                            <div 
                              key={page.id} 
                              className={`pdf-nav-item ${isSelected ? 'active' : ''}`}
                              onClick={() => setActivePage(page.id)}
                              draggable="true"
                              onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', page.id);
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setDragOverPageId(page.id);
                              }}
                              onDragLeave={() => {
                                setDragOverPageId(null);
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                setDragOverPageId(null);
                                const draggedId = e.dataTransfer.getData('text/plain');
                                if (draggedId) {
                                  movePage(draggedId, page.id);
                                }
                              }}
                              style={{ 
                                marginBottom: '4px', 
                                cursor: 'grab', 
                                borderRadius: '4px',
                                borderTop: isDraggingOverPage ? '2px solid var(--color-functional-red)' : 'none',
                                transition: 'border-top 0.15s ease'
                              }}
                            >
                              <div className="pdf-flex-row pdf-items-center pdf-gap-150 pdf-overflow-hidden pdf-w-full" style={{ padding: '2px 0' }}>
                                <span className="pdf-text-label-14-mono pdf-text-center pdf-font-bold" style={{
                                  backgroundColor: isSelected ? 'var(--color-functional-red)' : 'var(--color-border-default)',
                                  color: isSelected ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)',
                                  padding: '2px 6px',
                                  borderRadius: '2px',
                                  fontSize: '11px',
                                  minWidth: '24px'
                                }}>
                                  {num < 10 ? `0${num}` : num}
                                </span>
                                <div className="pdf-flex-col pdf-overflow-hidden" style={{ flex: 1 }}>
                                  {editingId === page.id ? (
                                    <div className="pdf-flex-col pdf-gap-050 pdf-w-full" onClick={(e) => e.stopPropagation()}>
                                      <input
                                        autoFocus
                                        type="text"
                                        value={editTitle}
                                        placeholder="페이지 제목"
                                        className="pdf-input pdf-input-sm"
                                        style={{ padding: '6px 8px', fontSize: '13px', width: '100%', maxWidth: 'none', marginBottom: '4px' }}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(page.id)}
                                      />
                                      <input
                                        type="text"
                                        value={editCategory}
                                        placeholder="대분류 (비워두면 미분류)"
                                        className="pdf-input pdf-input-sm"
                                        style={{ padding: '6px 8px', fontSize: '13px', width: '100%', maxWidth: 'none' }}
                                        list="category-suggestions"
                                        onChange={(e) => setEditCategory(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(page.id)}
                                      />
                                      <div className="pdf-flex-row pdf-gap-100 pdf-mt-100" style={{ marginTop: '8px' }}>
                                        <button 
                                          className="pdf-btn-primary pdf-btn-xs"
                                          style={{ minHeight: '24px', height: '24px', fontSize: '11px', borderRadius: '4px' }}
                                          onClick={() => saveEdit(page.id)}
                                        >
                                          적용
                                        </button>
                                        <button 
                                          className="pdf-secondary-btn pdf-btn-xs" 
                                          style={{ minHeight: '24px', height: '24px', fontSize: '11px', padding: '0 8px', borderRadius: '4px' }}
                                          onClick={() => setEditingId(null)}
                                        >
                                          취소
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="pdf-text-label-16 pdf-flex-row pdf-items-center pdf-overflow-hidden" style={{ fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                      {page.title}
                                    </span>
                                  )}
                                </div>
                                {/* Action buttons */}
                                {editingId !== page.id && (
                                  <div className="pdf-flex-row pdf-gap-100" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                      className="pdf-text-label-14-mono pdf-text-muted" 
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px' }}
                                      onClick={() => startEdit(page.id, page.title, page.category)}
                                    >
                                      Edit
                                    </button>
                                    {pages.length > 1 && (
                                      <button 
                                        className="pdf-text-label-14-mono pdf-text-red" 
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px' }}
                                        onClick={() => removePage(page.id)}
                                      >
                                        X
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <datalist id="category-suggestions">
            {Array.from(allCategoriesSet).filter(Boolean).map(cat => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </nav>

        {/* 출처 표시 (Optional Attribution) */}
        <div className="pdf-mt-400 pdf-pt-200 pdf-border-top" style={{ marginTop: '32px', paddingTop: '16px' }}>
          <div className="pdf-text-label-14-mono pdf-text-muted pdf-mb-050">
            <a href="https://github.com/qpi-labels/PDF-DS" target="_blank" rel="noreferrer"
              style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}>
              View on GitHub ↗
            </a>
          </div>
          <div className="pdf-text-label-14-mono pdf-text-muted">
            Made with PDF-DS
          </div>
        </div>
      </div>

      <div className="pdf-p-200 pdf-border-top pdf-flex-col pdf-gap-100" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        {showAddCat ? (
          <div className="pdf-flex-col pdf-gap-050 pdf-mb-100" style={{ width: '100%' }}>
            <input
              autoFocus
              type="text"
              className="pdf-input pdf-input-sm"
              style={{ width: '100%', padding: '6px 8px', fontSize: '13px', backgroundColor: 'var(--color-bg-primary)' }}
              placeholder="대분류명 입력"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
            />
            <div className="pdf-flex-row pdf-gap-100" style={{ marginTop: '4px' }}>
              <button className="pdf-btn-primary pdf-btn-xs" style={{ borderRadius: '4px', height: '28px' }} onClick={handleCreateCategory}>추가</button>
              <button className="pdf-secondary-btn pdf-btn-xs" style={{ borderRadius: '4px', height: '28px', padding: '0 8px' }} onClick={() => setShowAddCat(false)}>취소</button>
            </div>
          </div>
        ) : (
          <button className="pdf-secondary-btn pdf-w-full" onClick={() => setShowAddCat(true)}>
            + 새 대분류 추가
          </button>
        )}
        
        <button className="pdf-btn-primary pdf-w-full" onClick={handleAddPage}>
          + 새 페이지 추가
        </button>
        <button className="pdf-secondary-btn pdf-w-full" onClick={onPreview}>
          미리보기 모드
        </button>
        <button className="pdf-secondary-btn pdf-w-full" onClick={handleExportZip}>
          ZIP 파일로 내보내기
        </button>
        <button className="pdf-secondary-btn pdf-w-full" onClick={() => fileInputRef.current?.click()}>
          ZIP 파일 불러오기
        </button>
        <input 
          type="file" 
          accept=".zip" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleImportZip} 
        />
      </div>
    </aside>
  );
}
