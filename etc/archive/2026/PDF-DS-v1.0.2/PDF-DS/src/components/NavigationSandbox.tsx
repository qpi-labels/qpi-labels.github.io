import React, { useState } from 'react';

export default function NavigationSandbox() {
  const [activeTab, setActiveTab] = useState('web');

  return (
    <div className="pdf-bg-secondary pdf-border pdf-p-300">
      <h3 className="pdf-text-label-16 pdf-mb-200">Navigation & Hierarchy (네비게이션 구조)</h3>
      <p className="pdf-text-copy-14 pdf-text-muted pdf-mb-300">
        시스템 내부의 깊이(Depth)와 평면적 분기(Lateral)를 관리하는 수단입니다. 현재 사용자가 시스템의 어느 계층에 위치하고 있는지 시각적으로 명확하게 지시해야 합니다.
      </p>

      <div className="pdf-flex-col pdf-gap-400">

        {/* 1. Sidebar Item */}
        <div className="pdf-flex-col pdf-gap-100">
          <label className="pdf-text-label-14-mono pdf-text-muted">1. Sidebar Navigation (사이드바 메뉴)</label>
          <div
            className="pdf-p-200 pdf-border pdf-radius-md"
            style={{
              backgroundColor: 'var(--bg-sidebar)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              backgroundImage: 'var(--blueprint-grid-pattern)',
              backgroundSize: '24px 24px',
              maxWidth: '300px'
            }}
          >
            <div className="pdf-flex-col" style={{ padding: '8px 0' }}>
              <div className="pdf-flex-row pdf-items-center pdf-justify-between pdf-cursor-pointer" style={{ padding: '4px 16px', marginBottom: '8px' }}>
                <span className="pdf-text-label-16 pdf-font-bold">Components</span>
                <svg width="12" height="12" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" fill="currentColor" /></svg>
              </div>

              <div className="pdf-nav-item">
                <div className="pdf-flex-row pdf-items-center pdf-gap-150" style={{ width: '100%' }}>
                  <span className="pdf-text-label-14-mono pdf-font-bold pdf-text-center" style={{ backgroundColor: 'var(--color-border-default)', color: 'var(--color-text-secondary)', padding: '4px 8px', borderRadius: '2px', minWidth: '32px' }}>08</span>
                  <span className="pdf-text-label-16" style={{ color: 'var(--color-text-secondary)' }}>Buttons & Morphing</span>
                </div>
              </div>
              <div className="pdf-nav-item">
                <div className="pdf-flex-row pdf-items-center pdf-gap-150" style={{ width: '100%' }}>
                  <span className="pdf-text-label-14-mono pdf-font-bold pdf-text-center" style={{ backgroundColor: 'var(--color-border-default)', color: 'var(--color-text-secondary)', padding: '4px 8px', borderRadius: '2px', minWidth: '32px' }}>09</span>
                  <span className="pdf-text-label-16" style={{ color: 'var(--color-text-secondary)' }}>Forms</span>
                </div>
              </div>
              <div className="pdf-nav-item">
                <div className="pdf-flex-row pdf-items-center pdf-gap-150" style={{ width: '100%' }}>
                  <span className="pdf-text-label-14-mono pdf-font-bold pdf-text-center" style={{ backgroundColor: 'var(--color-border-default)', color: 'var(--color-text-secondary)', padding: '4px 8px', borderRadius: '2px', minWidth: '32px' }}>010</span>
                  <span className="pdf-text-label-16" style={{ color: 'var(--color-text-secondary)' }}>Modals</span>
                </div>
              </div>
              <div className="pdf-nav-item active">
                <div className="pdf-flex-row pdf-items-center pdf-gap-150" style={{ width: '100%' }}>
                  <span className="pdf-text-label-14-mono pdf-font-bold pdf-text-center" style={{ backgroundColor: 'var(--color-functional-red)', color: 'var(--color-bg-primary)', padding: '4px 8px', borderRadius: '2px', minWidth: '32px' }}>011</span>
                  <span className="pdf-text-label-16 pdf-font-bold">Navigation</span>
                </div>
              </div>
            </div>
          </div>
          <p className="pdf-text-copy-13-mono pdf-text-muted pdf-mt-100">
            실제 사이드바와 동일하게 좌측 붉은 선(Border-left)과 번호 블록을 통해 현재 위치를 명시적으로 나타냅니다.
          </p>
        </div>

        {/* 2. Top Tabs (Contextual Segmented Control) */}
        <div className="pdf-flex-col pdf-gap-100">
          <label className="pdf-text-label-14-mono pdf-text-muted">2. Contextual Tabs (수평 탭 / 세그멘티드 컨트롤)</label>
          <div
            className="pdf-p-200 pdf-border pdf-radius-md"
            style={{
              backgroundColor: 'var(--color-bg-primary)'
            }}
          >
            <div className="pdf-flex-row" style={{ display: 'inline-flex', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-default)', borderRadius: '10px', padding: '4px', gap: '4px', width: '100%', overflowX: 'auto' }}>
              <button
                onClick={() => setActiveTab('web')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'web' ? 'var(--color-bg-primary)' : 'transparent',
                  color: activeTab === 'web' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  boxShadow: activeTab === 'web' ? 'var(--shadow-hardware-bevel)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                <span className="pdf-text-label-14-mono" style={{ fontWeight: activeTab === 'web' ? '700' : '400' }}>Web (CSS Token)</span>
              </button>
              <button
                onClick={() => setActiveTab('android')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'android' ? 'var(--color-bg-primary)' : 'transparent',
                  color: activeTab === 'android' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  boxShadow: activeTab === 'android' ? 'var(--shadow-hardware-bevel)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                <span className="pdf-text-label-14-mono" style={{ fontWeight: activeTab === 'android' ? '700' : '400' }}>Android (Kotlin Compose)</span>
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'ios' ? 'var(--color-bg-primary)' : 'transparent',
                  color: activeTab === 'ios' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  boxShadow: activeTab === 'ios' ? 'var(--shadow-hardware-bevel)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                <span className="pdf-text-label-14-mono" style={{ fontWeight: activeTab === 'ios' ? '700' : '400' }}>iOS (SwiftUI Swift)</span>
              </button>
            </div>

            <div className="pdf-p-200 pdf-mt-200" style={{ borderTop: '1px solid var(--color-border-default)' }}>
              {activeTab === 'web' && (
                <div className="pdf-flex-col pdf-gap-100 pdf-animate-fade-in">
                  <span className="pdf-text-label-14-mono pdf-text-red">Web Implementation</span>
                  <p className="pdf-text-copy-14 pdf-text-muted">
                    CSS Variables를 사용하여 웹 환경에 적합한 디자인 토큰을 유연하게 주입합니다.
                  </p>
                </div>
              )}
              {activeTab === 'android' && (
                <div className="pdf-flex-col pdf-gap-100 pdf-animate-fade-in">
                  <span className="pdf-text-label-14-mono pdf-text-red">Android Implementation</span>
                  <p className="pdf-text-copy-14 pdf-text-muted">
                    Jetpack Compose의 CompositionLocal 및 Custom Theme을 구성하여 정밀한 Kotlin 타입 토큰을 매핑합니다.
                  </p>
                </div>
              )}
              {activeTab === 'ios' && (
                <div className="pdf-flex-col pdf-gap-100 pdf-animate-fade-in">
                  <span className="pdf-text-label-14-mono pdf-text-red">iOS Implementation</span>
                  <p className="pdf-text-copy-14 pdf-text-muted">
                    SwiftUI의 EnvironmentValue 및 Asset Catalog를 연동하여 네이티브 해상도 대응과 다크모드를 완벽하게 지원합니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
