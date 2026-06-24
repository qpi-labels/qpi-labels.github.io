import React, { useState } from 'react';

export default function LayoutComparisonSandbox() {
  const [viewMode, setViewMode] = useState<'legacy' | 'pdfds'>('legacy');

  return (
    <div className="pdf-bg-secondary pdf-border pdf-p-200 pdf-flex-col pdf-justify-center pdf-relative pdf-overflow-hidden" style={{ flexShrink: 0, borderRadius: 8, margin: '32px 0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
      <div className="pdf-flex-row pdf-justify-between pdf-items-center pdf-mb-300">
        <div>
          <span className="pdf-text-label-14-mono pdf-text-red pdf-mb-100" style={{ display: 'block', fontWeight: 'bold' }}>
            CH.2 STRUCTURAL ANALYSIS
          </span>
          <h4 className="pdf-text-label-16" style={{ fontWeight: 'bold', marginTop: 4 }}>
            주류 웹 레이아웃 vs PDF-DS 블루프린트
          </h4>
        </div>
        <div className="pdf-flex-row" style={{ backgroundColor: 'var(--color-border-default)', padding: 4, borderRadius: 6, flexShrink: 0 }}>
          <button
            onClick={() => setViewMode('legacy')}
            className="pdf-text-label-14-mono"
            style={{
              padding: '6px 12px', fontWeight: 'bold', borderRadius: 4, cursor: 'pointer', border: 'none', transition: 'background-color 0.2s',
              backgroundColor: viewMode === 'legacy' ? 'var(--color-bg-primary)' : 'transparent',
              color: viewMode === 'legacy' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              boxShadow: viewMode === 'legacy' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            LEGACY WEB
          </button>
          <button
            onClick={() => setViewMode('pdfds')}
            className="pdf-text-label-14-mono"
            style={{
              padding: '6px 12px', fontWeight: 'bold', borderRadius: 4, cursor: 'pointer', border: 'none', transition: 'background-color 0.2s',
              backgroundColor: viewMode === 'pdfds' ? 'var(--color-functional-red)' : 'transparent',
              color: viewMode === 'pdfds' ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)',
              boxShadow: viewMode === 'pdfds' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            PDF-DS
          </button>
        </div>
      </div>

      <div className="pdf-text-copy-14 pdf-text-muted pdf-mb-300" style={{ lineHeight: 1.6 }}>
        {viewMode === 'legacy' ? (
            <p><strong>윈도우 데스크톱 환경(16:9)의 수직 압축:</strong> 브라우저 탭, URL 바, 작업표시줄 등 OS 레벨의 UI에 의해 이미 화면의 수직 공간이 소모된 상태에서, 웹사이트 자체의 헤더와 푸터까지 더해지면 실제 콘텐츠 영역은 극도로 비좁아집니다. 동시에 좌우 레터박스는 방치됩니다.</p>
        ) : (
            <p><strong>PDF-DS 비대칭 블루프린트 전환:</strong> 상하로 낭비되던 헤더/푸터를 제거하고, 낭비되던 좌우 레터박스 영역을 38% 통제 패널과 62% 콘텐츠 캔버스로 치환하여 스크린 전체의 면적 효율을 극대화합니다.</p>
        )}
      </div>

      {/* 16:9 윈도우 모니터 프레임 */}
      <div className="pdf-flex-col pdf-relative pdf-overflow-hidden pdf-w-full" style={{ margin: '0 auto', maxWidth: '896px', aspectRatio: '16/9', backgroundColor: '#09090b', borderRadius: 6, border: '6px solid var(--color-border-hover)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', transition: 'all 0.5s' }}>
        
        {/* OS Top: Browser Tabs & URL Bar */}
        <div style={{ backgroundColor: 'var(--color-border-default)', width: '100%', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', alignItems: 'flex-end', height: 32, padding: '0 8px', gap: 4, paddingTop: 8, backgroundColor: 'var(--color-border-default)' }}>
            <div style={{ width: 128, height: '100%', backgroundColor: 'var(--color-bg-primary)', borderTopLeftRadius: 6, borderTopRightRadius: 6, display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: 8, fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)' }}>
              New Tab
            </div>
            <div style={{ width: 32, height: 24, backgroundColor: 'var(--color-border-default)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--color-text-secondary)' }}>+</div>
          </div>
          {/* URL Bar */}
          <div style={{ height: 40, backgroundColor: 'var(--color-bg-primary)', display: 'flex', alignItems: 'center', padding: '0 8px', gap: 8, borderBottom: '1px solid var(--color-border-hover)' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: 'var(--color-border-default)' }}></div>
              <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: 'var(--color-border-default)' }}></div>
              <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: 'var(--color-border-default)' }}></div>
            </div>
            <div style={{ flex: 1, height: 24, backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-hover)', borderRadius: 9999, fontSize: 8, display: 'flex', alignItems: 'center', padding: '0 12px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
              https://legacy.web/
            </div>
          </div>
        </div>

        {/* Website Content Area */}
        <div className="pdf-flex-row pdf-relative pdf-overflow-hidden" style={{ flex: 1, backgroundColor: 'var(--color-bg-primary)', transition: 'all 0.5s' }}>
          
          {viewMode === 'legacy' ? (
            /* LEGACY LAYOUT */
            <div className="pdf-w-full pdf-flex-col pdf-items-center pdf-relative" style={{ flex: 1, animation: 'fadeIn 0.5s' }}>
              {/* Header */}
              <div style={{ width: '100%', height: 56, borderBottom: '1px solid var(--color-border-default)', backgroundColor: 'var(--color-bg-primary)', flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', zIndex: 20 }}>
                <div style={{ width: 96, height: 16, backgroundColor: 'var(--color-border-default)', borderRadius: 4 }}></div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 40, height: 8, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4 }}></div>
                  <div style={{ width: 40, height: 8, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4 }}></div>
                  <div style={{ width: 40, height: 8, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4 }}></div>
                </div>
              </div>
              
              {/* Layout Wrapper */}
              <div className="pdf-flex-row pdf-w-full pdf-relative" style={{ flex: 1, backgroundColor: 'var(--color-bg-primary)', zIndex: 10 }}>
                {/* Left Letterbox */}
                <div className="pdf-flex-col pdf-justify-center pdf-items-center pdf-text-center" style={{ flex: 1, backgroundColor: 'rgba(173, 29, 29, 0.1)', borderRight: '2px dashed var(--color-functional-red)' }}>
                  <span style={{ color: 'var(--color-functional-red)', fontSize: 10, fontWeight: 'bold' }}>낭비되는</span>
                  <span style={{ color: 'var(--color-functional-red)', fontSize: 10, fontWeight: 'bold' }}>여백</span>
                </div>
                
                {/* Main Content (Narrow and Stretched) */}
                <div style={{ width: '50%', backgroundColor: 'var(--color-bg-primary)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 32, paddingLeft: 24, paddingRight: 24, paddingBottom: 8, overflow: 'hidden', position: 'relative' }}>
                  <span style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--color-functional-red)', border: '1px solid var(--color-functional-red)', lineHeight: 1, backgroundColor: 'var(--color-bg-primary)', padding: '4px 8px', borderRadius: 4, position: 'absolute', top: 8, right: 8 }}>
                    수직 압축됨
                  </span>
                  <div style={{ width: '75%', height: 24, backgroundColor: 'var(--color-border-default)', borderRadius: 4, marginBottom: 16 }}></div>
                  <div style={{ width: '100%', height: 12, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4, marginBottom: 8 }}></div>
                  <div style={{ width: '90%', height: 12, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4, marginBottom: 8 }}></div>
                  <div style={{ width: '95%', height: 12, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4, marginBottom: 24 }}></div>
                  <div style={{ width: '100%', height: 128, backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-default)', borderRadius: 4, flexShrink: 0 }}></div>
                  
                  <div style={{ width: '100%', height: 64, background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.8), rgba(255,255,255,1))', position: 'absolute', bottom: 0, left: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 8, pointerEvents: 'none' }}>
                     <span style={{ fontSize: 9, backgroundColor: '#09090b', color: 'var(--color-bg-primary)', padding: '4px 8px', borderRadius: 9999, display: 'flex', gap: 4 }}>▼ 무한 스크롤</span>
                  </div>
                </div>

                {/* Right Letterbox */}
                <div className="pdf-flex-col pdf-justify-center pdf-items-center pdf-text-center" style={{ flex: 1, backgroundColor: 'rgba(173, 29, 29, 0.1)', borderLeft: '2px dashed var(--color-functional-red)' }}>
                  <span style={{ color: 'var(--color-functional-red)', fontSize: 10, fontWeight: 'bold' }}>낭비되는</span>
                  <span style={{ color: 'var(--color-functional-red)', fontSize: 10, fontWeight: 'bold' }}>여백</span>
                </div>
              </div>

               {/* Footer */}
               <div style={{ width: '100%', height: 48, backgroundColor: '#09090b', flexShrink: 0, zIndex: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 <div style={{ width: 128, height: 8, backgroundColor: 'var(--color-border-default)', borderRadius: 4 }}></div>
               </div>
            </div>
          ) : (
            /* PDF-DS LAYOUT */
            <div className="pdf-w-full pdf-flex-row pdf-relative" style={{ flex: 1, animation: 'fadeIn 0.5s' }}>
              {/* PDF-DS LEFT 38% */}
              <div style={{ width: '38%', backgroundColor: 'var(--color-bg-primary)', borderRight: '1px solid var(--color-border-hover)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* PDF-DS Header Area */}
                <div style={{ height: 56, borderBottom: '1px solid var(--color-border-default)', display: 'flex', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
                  <div style={{ width: 16, height: 16, backgroundColor: 'var(--color-functional-red)' }}></div>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', fontWeight: 'bold', marginLeft: 8 }}>PDF-DS SYSTEM</span>
                </div>
                {/* PDF-DS Controls */}
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto' }}>
                   <div style={{ width: '100%', height: 24, backgroundColor: 'var(--color-border-default)', borderRadius: 2 }}></div>
                   <div style={{ display: 'flex', gap: 8 }}>
                     <div style={{ width: '50%', height: 32, backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-default)', borderRadius: 2 }}></div>
                     <div style={{ width: '50%', height: 32, backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-default)', borderRadius: 2 }}></div>
                   </div>
                   <div style={{ width: '100%', height: 96, backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-default)', borderRadius: 2, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8, padding: 12 }}>
                     <div style={{ width: '75%', height: 8, backgroundColor: 'var(--color-bg-primary)' }}></div>
                     <div style={{ width: '50%', height: 8, backgroundColor: 'var(--color-bg-primary)' }}></div>
                   </div>
                      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                     <div style={{ width: '100%', height: 40, borderRadius: 9999, backgroundColor: 'var(--color-functional-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 16, height: 16, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', marginRight: 8 }}></div>
                        <span style={{ width: 48, height: 8, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 4 }}></span>
                     </div>
                   </div>
                </div>
              </div>

              {/* PDF-DS RIGHT 62% */}
              <div className="pdf-flex-col pdf-h-full" style={{ width: '62%', backgroundColor: 'var(--color-bg-primary)', borderLeft: '1px solid rgba(226, 232, 240, 0.5)' }}>
                 {/* 62 Canvas Header */}
                 <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 32px', flexShrink: 0, justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>DATA CANVAS VIEW</span>
                 </div>
                 {/* 62 Canvas Body */}
                 <div style={{ flex: 1, padding: 32, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
                    <div style={{ gridColumn: 'span 2 / span 2', height: 48, display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--color-border-default)' }}>
                      <div style={{ width: 192, height: 24, backgroundColor: 'var(--color-border-default)', borderRadius: 4 }}></div>
                    </div>
                    <div style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-default)', height: 128, borderRadius: 8, padding: 16 }}>
                      <div style={{ width: '33%', height: 16, backgroundColor: 'var(--color-border-default)', borderRadius: 4, marginBottom: 16 }}></div>
                      <div style={{ width: '100%', height: 8, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4, marginBottom: 8 }}></div>
                      <div style={{ width: '100%', height: 8, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4, marginBottom: 8 }}></div>
                      <div style={{ width: '66%', height: 8, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4 }}></div>
                    </div>
                    <div style={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-default)', height: 128, borderRadius: 8, padding: 16 }}>
                      <div style={{ width: '33%', height: 16, backgroundColor: 'var(--color-border-default)', borderRadius: 4, marginBottom: 16 }}></div>
                      <div style={{ width: '100%', height: 8, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4, marginBottom: 8 }}></div>
                      <div style={{ width: '100%', height: 8, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4, marginBottom: 8 }}></div>
                      <div style={{ width: '66%', height: 8, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4 }}></div>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* OS Bottom: Windows Taskbar */}
        <div style={{ height: 40, backgroundColor: '#09090b', width: '100%', flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 8px', justifyContent: 'space-between', zIndex: 30, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.5)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
             <div style={{ width: 24, height: 24, borderRadius: 4, backgroundColor: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontSize: 10 }}>W</div>
             <div style={{ width: 24, height: 24, borderRadius: 4, backgroundColor: '#09090b' }}></div>
             <div style={{ width: 24, height: 24, borderRadius: 4, backgroundColor: '#09090b', borderBottom: '2px solid #60a5fa', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}></div>
           </div>
           <div style={{ display: 'flex', gap: 12, fontSize: 8, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', alignItems: 'center' }}>
             <span>ENG</span>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
               <span>12:00 PM</span>
               <span>2024-05-23</span>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
