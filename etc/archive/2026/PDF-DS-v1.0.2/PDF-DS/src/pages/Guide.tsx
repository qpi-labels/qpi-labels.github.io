import React, { useState, useEffect, useRef } from 'react';
import ChapterContent from '../components/ChapterContent';

export default function Guide() {
  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [sidebarWidth, setSidebarWidth] = useState<number>(25); // Standard 25%
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleGroup = (category: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1200);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChapterSwitch = (num: number) => {
    setActiveChapter(num);
    setIsMobileNavOpen(false);
    const scrollableDiv = document.getElementById('documentation-scroller');
    if (scrollableDiv) {
      scrollableDiv.scrollTop = 0;
    }
  };

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - containerRect.left;
      const percentage = (relativeX / containerRect.width) * 100;

      // Enforce 20% to 50% boundary caps in Section 6
      if (percentage >= 20 && percentage <= 50) {
        setSidebarWidth(percentage);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
      }
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Chapter mapping metadata from PDF (Storytelling Order)
  const chapters = [
    { num: 1, title: 'Philosophy', sub: '철학적 토대와 시스템 미학의 융합' },
    { num: 2, title: 'System Architecture', sub: '통합 소프트웨어 아키텍처 및 토큰 구현' },
    { num: 3, title: 'Installation', sub: 'PDF-DS 시작하기 및 설치 가이드' },
    { num: 4, title: 'Blueprint Grid & Spacing', sub: '청사진 그리드와 멀티 스케일 여백 시스템' },
    { num: 5, title: 'Typography', sub: '정밀 타이포그래피 및 레이아웃 정렬 명세' },
    { num: 6, title: 'Color', sub: '아크로매틱 컬러 체계와 펑셔널 레드' },
    { num: 7, title: 'Materials', sub: '머티리얼 디자인 및 물리적 재질감' },
    { num: 8, title: 'Buttons & Morphing', sub: '초정밀 버튼 설계 및 형태 모핑 상호작용' },
    { num: 9, title: 'Forms', sub: '입력 폼 및 데이터 제어 UI' },
    { num: 10, title: 'Modals', sub: '모달 및 다이얼로그 시스템' },
    { num: 11, title: 'Navigation', sub: '네비게이션 및 계층 이동 구조' },
    { num: 12, title: 'Split Screen', sub: '비대칭 황금 분할 25:75 스크린' },
    { num: 13, title: 'Mobile Screen', sub: '모바일 스택 및 반응형 레이아웃 복원' },
    { num: 14, title: 'QA & Checklist', sub: '최종 통합 실무 체크리스트 및 검수 수칙' },
    { num: 15, title: 'Credits', sub: 'PDF-DS 디자인 시스템 제작 공로자 및 기여자' }
  ];

  // Categorized chapter mapping for HIG style sidebar
  const navigationGroups = [
    {
      category: 'Intro & Architecture',
      items: [
        { num: 1, title: 'Philosophy', sub: '철학적 토대와 시스템 미학의 융합' },
        { num: 2, title: 'System Architecture', sub: '통합 소프트웨어 아키텍처 및 토큰 구현' },
        { num: 3, title: 'Installation', sub: 'PDF-DS 시작하기 및 설치 가이드' },
      ]
    },
    {
      category: 'Foundations',
      items: [
        { num: 4, title: 'Blueprint Grid & Spacing', sub: '청사진 그리드와 멀티 스케일 여백 시스템' },
        { num: 5, title: 'Typography', sub: '정밀 타이포그래피 및 레이아웃 정렬 명세' },
        { num: 6, title: 'Color', sub: '아크로매틱 컬러 체계와 펑셔널 레드' },
        { num: 7, title: 'Materials', sub: '머티리얼 디자인 및 물리적 재질감' },
      ]
    },
    {
      category: 'Layout',
      items: [
        { num: 12, title: 'Split Screen', sub: '비대칭 황금 분할 25:75 스크린' },
        { num: 13, title: 'Mobile Screen', sub: '모바일 스택 및 반응형 레이아웃 복원' },
      ]
    },
    {
      category: 'Components',
      items: [
        { num: 8, title: 'Buttons & Morphing', sub: '초정밀 버튼 설계 및 형태 모핑 상호작용' },
        { num: 9, title: 'Forms', sub: '입력 폼 및 데이터 제어 UI' },
        { num: 10, title: 'Modals', sub: '모달 및 다이얼로그 시스템' },
        { num: 11, title: 'Navigation', sub: '네비게이션 및 계층 이동 구조' },
      ]
    },
    {
      category: 'QA & Credits',
      items: [
        { num: 14, title: 'QA & Checklist', sub: '최종 통합 실무 체크리스트 및 검수 수칙' },
        { num: 15, title: 'Credits', sub: 'PDF-DS 디자인 시스템 제작 공로자 및 기여자' },
      ]
    }
  ];

  return (
    <div className="pdf-app" ref={containerRef}>

      {/* SIDEBAR */}
      <aside
        className={`pdf-sidebar ${isMobileNavOpen ? 'mobile-nav-open' : ''}`}
        style={{ width: isMobile ? '100%' : `${sidebarWidth}%` }}
      >
        <div className="pdf-content-relative pdf-p-300">
          <div className="pdf-mb-300">
            <span className="pdf-text-label-14-mono pdf-text-red pdf-mb-100" style={{ display: 'block' }}>
              물리-디지털 융합 디자인 가이드라인
            </span>
            <div className="pdf-flex-row pdf-justify-between pdf-items-center pdf-mb-100">
              <h1 className="pdf-text-heading-32">
                PDF-DS System
              </h1>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="pdf-secondary-btn pdf-flex-row pdf-items-center pdf-justify-center"
                style={{ padding: '6px 12px', whiteSpace: 'nowrap', gap: '6px', minWidth: '85px' }}
                aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
              >
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
            <p className="pdf-text-copy-14 pdf-text-muted">
              철학적 기능주의의 10대 원칙과 물리적 구조의 명료함을 담은 하드웨어급 디지털 조작기 디자인 규격.
            </p>
            <div className="pdf-mt-200">
              {/* Removed Editor Link */}
            </div>
          </div>

          <nav>
            <span className="pdf-text-label-14-mono pdf-text-muted pdf-border-bottom pdf-pb-100 pdf-mb-100 pdf-font-bold" style={{ display: 'block' }}>
              GUIDELINES INDEX
            </span>

            {navigationGroups.map((group, gIdx) => (
              <div key={gIdx} className="pdf-mb-200">
                <div
                  className="pdf-nav-group-header"
                  onClick={() => toggleGroup(group.category)}
                >
                  <span>{group.category}</span>
                  <svg
                    className={`pdf-chevron ${collapsedGroups[group.category] ? 'collapsed' : ''}`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </div>
                {!collapsedGroups[group.category] && group.items.map((item) => {
                  const isSelected = activeChapter === item.num;
                  return (
                    <div
                      key={item.num}
                      onClick={() => !item.disabled && handleChapterSwitch(item.num as number)}
                      className={`pdf-nav-item ${isSelected ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
                    >
                      <div className="pdf-flex-row pdf-items-center pdf-gap-150 pdf-overflow-hidden pdf-w-full">
                        {item.disabled ? (
                          <div className="pdf-flex-row pdf-items-center pdf-justify-center pdf-bg-secondary" style={{ width: '32px', height: '24px', borderRadius: '2px' }}>
                            <span className="pdf-text-label-14-mono pdf-text-muted" style={{ fontSize: '10px' }}>-</span>
                          </div>
                        ) : (
                          <span className="pdf-text-label-14-mono pdf-text-center pdf-font-bold" style={{
                            backgroundColor: isSelected ? 'var(--color-functional-red)' : 'var(--color-border-default)',
                            color: isSelected ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)',
                            padding: '4px 8px',
                            borderRadius: '2px',
                            minWidth: '32px'
                          }}>
                            0{item.num}
                          </span>
                        )}
                        <div className="pdf-flex-col pdf-overflow-hidden" style={{ flex: 1 }}>
                          <span className="pdf-text-label-16 pdf-flex-row pdf-items-center pdf-overflow-hidden" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            {item.title}
                            {item.disabled && <span className="pdf-badge">준비 중</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Nav Overlay & Bottom Toggle */}
      {isMobile && isMobileNavOpen && (
        <div
          className="pdf-fixed pdf-inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }}
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      {isMobile && (
        <div className="pdf-mobile-bottom-bar pdf-fixed pdf-flex-row pdf-justify-center" style={{ bottom: 16, left: 16, right: 16, zIndex: 1000 }}>
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="pdf-btn-primary"
            style={{ borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: '12px 24px' }}
          >
            {isMobileNavOpen ? '닫기' : '목차 열기'}
          </button>
        </div>
      )}

      {/* SPLITTER DRAGGABLE BAR */}
      {!isMobile && (
        <div
          onMouseDown={startResizing}
          onDoubleClick={() => setSidebarWidth(38)}
          className={`pdf-splitter ${isResizing ? 'active' : ''}`}
          title="더블클릭시 38% 표준 비율로 리셋"
        />
      )}

      {/* MAIN CONTENT VIEW */}
      <main
        id="documentation-scroller"
        className="pdf-main-view"
      >
        <div className="pdf-main-content">
          <div className="pdf-panel pdf-grid-bg">
            <div className="pdf-content-relative">
              <span className="pdf-text-label-14-mono pdf-text-red pdf-mb-100" style={{ display: 'block' }}>
                CHAPTER {activeChapter < 10 ? `0${activeChapter}` : activeChapter}
              </span>
              <div className="pdf-flex-row pdf-justify-between" style={{ alignItems: 'baseline' }}>
                <h2 className="pdf-text-heading-32">
                  {chapters[activeChapter - 1].title}
                </h2>
                <div className="pdf-text-label-14-mono pdf-text-muted">
                  {Math.round((activeChapter / 15) * 100)}% PROGRESS
                </div>
              </div>
            </div>
          </div>

          <ChapterContent activeChapter={activeChapter} />

          <div className="pdf-footer">
            <button
              disabled={activeChapter === 1}
              onClick={() => handleChapterSwitch(activeChapter - 1)}
              className="pdf-secondary-btn"
            >
              ← PREV
            </button>
            <span className="pdf-text-label-14-mono pdf-text-muted">
              STAGE {activeChapter < 10 ? `0${activeChapter}` : activeChapter} / 15
            </span>
            <button
              disabled={activeChapter === 15}
              onClick={() => handleChapterSwitch(activeChapter + 1)}
              className="pdf-secondary-btn"
            >
              NEXT →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
