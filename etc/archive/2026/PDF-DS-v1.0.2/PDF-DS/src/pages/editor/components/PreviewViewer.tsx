import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../store';
import { EditorNode } from '../types';

export default function PreviewViewer({ onExit }: { onExit: () => void }) {
  const { pages, appTitle, appDescription } = useEditorStore();
  const [activePreviewPageId, setActivePreviewPageId] = useState(pages[0]?.id || null);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1200);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activePage = pages.find(p => p.id === activePreviewPageId) || pages[0];

  const renderNode = (node: EditorNode) => {
    const elAttributes = { ...node.attributes, className: node.classes.join(' '), style: node.styles };
    
    let inner: any = node.content ? node.content.split('\\n').map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    )) : '';
    
    if (node.children.length > 0) {
      inner = node.children.map(renderNode);
    }

    switch (node.type) {
      case 'div': return <div key={node.id} {...elAttributes}>{inner}</div>;
      case 'span': return <span key={node.id} {...elAttributes}>{inner}</span>;
      case 'p': return <p key={node.id} {...elAttributes}>{inner}</p>;
      case 'h1': return <h1 key={node.id} {...elAttributes}>{inner}</h1>;
      case 'h2': return <h2 key={node.id} {...elAttributes}>{inner}</h2>;
      case 'h3': return <h3 key={node.id} {...elAttributes}>{inner}</h3>;
      case 'button': return <button key={node.id} {...elAttributes}>{inner}</button>;
      case 'a': return <a key={node.id} {...elAttributes} href={node.attributes.href || '#'}>{inner}</a>;
      case 'img': return <img key={node.id} {...elAttributes} src={node.attributes.src} alt={node.attributes.alt} />;
      case 'input': return <input key={node.id} {...elAttributes} type="text" placeholder={node.attributes.placeholder} />;
      default: return <div key={node.id} {...elAttributes}>{inner}</div>;
    }
  };

  // Group pages by category
  const categoriesMap: Record<string, typeof pages> = {};
  pages.forEach(page => {
    const cat = page.category || '';
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = [];
    }
    categoriesMap[cat].push(page);
  });

  // Sort categories: Uncategorized ('') last, others alphabetically
  const sortedCategories = Object.keys(categoriesMap).sort((a, b) => {
    if (a === '') return 1;
    if (b === '') return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="pdf-app" style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      
      {/* 모바일 암전 오버레이 레이어 */}
      {isMobile && isMobileNavOpen && (
        <div 
          onClick={() => setIsMobileNavOpen(false)}
          className="pdf-fixed pdf-inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, animation: 'pdfFadeIn 0.2s ease forwards' }}
        />
      )}

      {/* 모바일 전용 상단 Exit 플로팅 버튼 */}
      {isMobile && !isMobileNavOpen && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 999 }}>
          <button 
            className="pdf-secondary-btn pdf-btn-sm" 
            onClick={onExit} 
            style={{ 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
              backgroundColor: 'var(--color-bg-primary)', 
              borderRadius: '20px', 
              padding: '0 16px' 
            }}
          >
            나가기 (Exit)
          </button>
        </div>
      )}

      {/* 사이드바 */}
      <aside 
        className={`pdf-sidebar ${isMobileNavOpen ? 'mobile-nav-open' : ''}`} 
        style={{ 
          width: isMobile ? '100%' : '25%', 
          borderRight: isMobile ? 'none' : '1px solid var(--color-border-default)',
          display: isMobile && !isMobileNavOpen ? 'none' : 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="pdf-content-relative pdf-p-300">
          <div className="pdf-mb-300">
            <div className="pdf-flex-row pdf-justify-between pdf-items-center pdf-mb-100">
              <span className="pdf-text-label-14-mono pdf-text-red pdf-mb-100" style={{ display: 'block' }}>
                PREVIEW MODE
              </span>
              {!isMobile && (
                <button className="pdf-secondary-btn" onClick={onExit} style={{ padding: '4px 8px' }}>Exit</button>
              )}
            </div>
            <div className="pdf-flex-row pdf-justify-between pdf-items-center pdf-mb-100">
              <h1 className="pdf-text-heading-32">{appTitle || '사이트 제목'}</h1>
            </div>
            <p className="pdf-text-copy-14 pdf-text-muted">
              {appDescription || '사이트 설명을 입력하세요'}
            </p>
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

                return (
                  <div key={cat} className="pdf-mb-150">
                    {/* Category Header */}
                    <div 
                      className="pdf-nav-group-header" 
                      onClick={() => setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }))}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        margin: '12px 0 6px 0', 
                        padding: '4px 8px',
                        backgroundColor: 'var(--color-bg-secondary)',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <div className="pdf-flex-row pdf-items-center pdf-gap-100">
                        <span className="pdf-text-label-14-mono" style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          📁 {catDisplayName}
                        </span>
                        <span className="pdf-text-label-14-mono pdf-text-muted" style={{ fontSize: '11px' }}>
                          ({catPages.length})
                        </span>
                      </div>
                      <svg 
                        className={`pdf-chevron ${isCollapsed ? 'collapsed' : ''}`} 
                        viewBox="0 0 24 24"
                        style={{ width: '12px', height: '12px', fill: 'currentColor' }}
                      >
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </div>

                    {/* Pages list under category */}
                    {!isCollapsed && (
                      <div className="pdf-flex-col pdf-gap-050" style={{ paddingLeft: '8px', borderLeft: '1px solid var(--color-border-default)', marginLeft: '8px' }}>
                        {catPages.map(page => {
                          const isSelected = activePreviewPageId === page.id;
                          const globalIdx = pages.findIndex(p => p.id === page.id);
                          const num = globalIdx + 1;

                          return (
                            <div 
                              key={page.id} 
                              className={`pdf-nav-item ${isSelected ? 'active' : ''}`}
                              onClick={() => {
                                setActivePreviewPageId(page.id);
                                if (isMobile) setIsMobileNavOpen(false); // Close sidebar on switch on mobile
                              }}
                              style={{ marginBottom: '4px', cursor: 'pointer', borderRadius: '4px' }}
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
                                  <span className="pdf-text-label-16 pdf-flex-row pdf-items-center pdf-overflow-hidden" style={{ fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    {page.title}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
      </aside>

      <main className="pdf-main-view" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="pdf-main-content">
          <div className="pdf-panel pdf-grid-bg">
            <div className="pdf-content-relative">
              <span className="pdf-text-label-14-mono pdf-text-red pdf-mb-100" style={{ display: 'block' }}>
                PAGE {pages.findIndex(p => p.id === activePreviewPageId) + 1 < 10 ? `0${pages.findIndex(p => p.id === activePreviewPageId) + 1}` : pages.findIndex(p => p.id === activePreviewPageId) + 1}
              </span>
              <div className="pdf-flex-row pdf-justify-between" style={{ alignItems: 'baseline' }}>
                <h2 className="pdf-text-heading-32">
                  {activePage?.title}
                </h2>
              </div>
            </div>
          </div>
          {activePage ? activePage.rootNode.children.map(renderNode) : null}
        </div>
      </main>

      {/* 모바일 하단 플로팅 목차 열기 바 (FAB) */}
      {isMobile && (
        <div className="pdf-mobile-bottom-bar pdf-fixed pdf-flex-row pdf-justify-center" style={{ bottom: 16, left: 16, right: 16, zIndex: 1002 }}>
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="pdf-btn-primary"
            style={{ borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: '12px 24px', fontSize: '14px', fontWeight: 600 }}
          >
            {isMobileNavOpen ? '닫기' : '📂 목차 열기'}
          </button>
        </div>
      )}
    </div>
  );
}
