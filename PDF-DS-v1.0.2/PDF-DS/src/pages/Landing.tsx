import React, { useEffect, useState } from 'react';

export default function Landing() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  return (
    <div className="pdf-app pdf-flex-col">
      {/* Top Header */}
      <header className="pdf-content-relative pdf-flex-row pdf-justify-between pdf-items-center pdf-p-200 pdf-border-bottom">
        <div className="pdf-text-label-16 pdf-font-bold">
          PDF-DS
        </div>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="pdf-secondary-btn"
          style={{ padding: '4px 8px' }}
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      {/* Main Hero Area (100% width) */}
      <main className="pdf-grid-bg pdf-flex-col pdf-items-center pdf-justify-center pdf-text-center" style={{ flex: 1, padding: 'var(--space-600)' }}>
        <div style={{ maxWidth: '800px' }}>
          <span className="pdf-text-label-14-mono pdf-text-red pdf-mb-200" style={{ display: 'inline-block' }}>
            PHYSICAL-DIGITAL FUSION DESIGN SYSTEM
          </span>
          <h1 className="pdf-text-heading-72 pdf-mb-300">
            물리적 촉각을 지닌<br />디지털 설계 언어
          </h1>
          <p className="pdf-text-copy-14 pdf-text-muted pdf-mb-300" style={{ fontSize: '18px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 48px auto' }}>
            디터 람스의 철학과 하드웨어적 정밀함을 웹 환경에 완벽히 이식한 통합 디자인 시스템입니다.
            복잡한 스타일링 없이, 선언적인 구조와 엄격한 여백만으로 극한의 정밀함을 달성하세요.
          </p>

          <div className="pdf-flex-row pdf-justify-center pdf-gap-200">
            <a href="#/guide" className="pdf-btn-primary" style={{ padding: '0 32px' }}>
              가이드라인 열람
            </a>
            <a href="#/editor" className="pdf-secondary-btn" style={{ padding: '0 32px' }}>
              시각적 편집기 시작
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pdf-p-200 pdf-text-label-14-mono pdf-text-muted pdf-text-center pdf-border-top">
        © 2026 PDF-DS Architecture Team.
      </footer>
    </div>
  );
}
