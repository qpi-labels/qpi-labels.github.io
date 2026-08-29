import React from 'react';

export default function GoldenRatioSandbox() {
  return (
    <div className="pdf-bg-secondary pdf-border pdf-p-200 pdf-flex-col pdf-justify-center pdf-radius-md pdf-relative pdf-overflow-hidden" style={{ flexShrink: 0, margin: '32px 0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
      <div className="pdf-flex-row pdf-justify-between pdf-items-center pdf-mb-300">
        <div>
          <span className="pdf-text-label-14-mono pdf-text-red pdf-mb-100 pdf-font-bold" style={{ display: 'block' }}>
            CH.5 BLUEPRINT FORMAT
          </span>
          <h4 className="pdf-text-label-16 pdf-font-bold" style={{ marginTop: 4 }}>
            25:75 비대칭 황금 분할 (Asymmetric Golden Ratio)
          </h4>
        </div>
      </div>

      {/* 16:9 윈도우 모니터 프레임 */}
      <div className="pdf-w-full pdf-relative pdf-overflow-hidden pdf-flex-col" style={{ margin: '0 auto', maxWidth: '896px', aspectRatio: '16/9', backgroundColor: '#09090b', borderRadius: 6, border: '6px solid var(--color-border-hover)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', transition: 'all 0.5s' }}>

        {/* OS Top: Browser Tabs & URL Bar */}
        <div className="pdf-w-full pdf-flex-shrink-0 pdf-flex-col" style={{ backgroundColor: 'var(--color-border-default)' }}>
          {/* Tabs */}
          <div className="pdf-flex-row pdf-items-end" style={{ height: 32, padding: '0 8px', gap: 4, paddingTop: 8, backgroundColor: 'var(--color-border-default)' }}>
            <div className="pdf-flex-row pdf-items-center" style={{ width: 128, height: '100%', backgroundColor: 'var(--color-bg-primary)', borderTopLeftRadius: 6, borderTopRightRadius: 6, padding: '0 8px', fontSize: 8, fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)' }}>
              PDF-DS System
            </div>
            <div className="pdf-radius-sm pdf-flex-row pdf-items-center pdf-justify-center" style={{ width: 32, height: 24, backgroundColor: 'var(--color-border-default)', fontSize: 10, color: 'var(--color-text-secondary)', borderRadius: '4px 4px 0 0' }}>+</div>
          </div>
          {/* URL Bar */}
          <div className="pdf-flex-row pdf-items-center pdf-border-bottom" style={{ height: 40, backgroundColor: 'var(--color-bg-primary)', padding: '0 8px', gap: 8, borderBottomColor: 'var(--color-border-hover)' }}>
            <div className="pdf-flex-row" style={{ gap: 4 }}>
              <div className="pdf-radius-sm" style={{ width: 16, height: 16, backgroundColor: 'var(--color-border-default)', borderRadius: '4px' }}></div>
              <div className="pdf-radius-sm" style={{ width: 16, height: 16, backgroundColor: 'var(--color-border-default)', borderRadius: '4px' }}></div>
              <div className="pdf-radius-sm" style={{ width: 16, height: 16, backgroundColor: 'var(--color-border-default)', borderRadius: '4px' }}></div>
            </div>
            <div className="pdf-border pdf-radius-sm pdf-flex-row pdf-items-center" style={{ flex: 1, height: 24, backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-hover)', fontSize: 8, padding: '0 12px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
              https://pdf-ds.system/
            </div>
          </div>
        </div>

        {/* Website Content Area */}
        <div className="pdf-relative pdf-overflow-hidden pdf-flex-row" style={{ flex: 1, backgroundColor: 'var(--color-bg-primary)', transition: 'all 0.5s' }}>

          {/* PDF-DS LAYOUT */}
          <div className="pdf-w-full pdf-flex-row pdf-relative" style={{ flex: 1, animation: 'fadeIn 0.5s' }}>
            {/* PDF-DS LEFT 25% */}
            <div className="pdf-golden-ratio-panel pdf-flex-col pdf-relative" style={{ width: '25%', backgroundColor: 'var(--color-bg-primary)', borderRight: '1px solid var(--color-border-hover)', height: '100%' }}>
              {/* Overlay Annotation */}
              <div className="pdf-absolute pdf-inset-0 pdf-flex-col pdf-items-center pdf-justify-center" style={{ backgroundColor: 'rgba(173, 29, 29, 0.05)', border: '2px solid rgba(173, 29, 29, 0.5)', zIndex: 20, pointerEvents: 'none' }}>
                <div style={{ backgroundColor: 'var(--color-functional-red)', color: 'var(--color-bg-primary)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: 12, padding: '6px 12px', borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                  25% CONTROL PANEL
                </div>
                <div className="pdf-radius-sm" style={{ fontSize: 10, color: 'var(--color-functional-red)', fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 8px', marginTop: 8, border: '1px solid var(--color-functional-red)', borderRadius: '4px' }}>
                  Geist Mono / #F4F4F5 / Fixed
                </div>
              </div>

              {/* PDF-DS Header Area */}
              <div className="pdf-flex-row pdf-items-center pdf-border-bottom pdf-flex-shrink-0" style={{ height: 56, padding: '0 16px' }}>
                <div style={{ width: 16, height: 16, backgroundColor: 'var(--color-functional-red)' }}></div>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', fontWeight: 'bold', marginLeft: 8 }}>PDF-DS SYSTEM</span>
              </div>
              {/* PDF-DS Controls */}
              <div className="pdf-flex-col" style={{ padding: 16, gap: 12, flex: 1, overflowY: 'auto' }}>
                <div style={{ width: '100%', height: 24, backgroundColor: 'var(--color-border-default)', borderRadius: 2 }}></div>
                <div className="pdf-flex-row" style={{ gap: 8 }}>
                  <div style={{ width: '50%', height: 32, backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-default)', borderRadius: 2 }}></div>
                  <div style={{ width: '50%', height: 32, backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-default)', borderRadius: 2 }}></div>
                </div>
                <div className="pdf-w-full pdf-border pdf-flex-col" style={{ height: 96, backgroundColor: 'var(--color-bg-primary)', borderRadius: 2, marginTop: 8, gap: 8, padding: 12, fontSize: 8, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  [SYSTEM_METADATA_BLOCK]
                  <div style={{ width: '75%', height: 6, backgroundColor: 'var(--color-border-default)', marginTop: 4 }}></div>
                  <div style={{ width: '50%', height: 6, backgroundColor: 'var(--color-border-default)', marginTop: 4 }}></div>
                  <div style={{ width: '66%', height: 6, backgroundColor: 'var(--color-border-default)', marginTop: 4 }}></div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                  <div className="pdf-w-full pdf-radius-sm pdf-flex-row pdf-items-center pdf-justify-center pdf-overflow-hidden" style={{ height: 40, backgroundColor: 'var(--color-functional-red)', borderRadius: '4px' }}>
                    <div style={{ width: 16, height: 16, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px', marginRight: 8 }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* PDF-DS RIGHT 75% */}
            <div className="pdf-flex-col pdf-relative" style={{ width: '75%', height: '100%', backgroundColor: 'var(--color-bg-primary)', borderLeft: '1px solid rgba(226, 232, 240, 0.5)' }}>
              {/* Overlay Annotation */}
              <div className="pdf-absolute pdf-inset-0 pdf-flex-col pdf-items-center pdf-justify-center" style={{ backgroundColor: 'rgba(29, 78, 216, 0.05)', border: '2px solid rgba(59, 130, 246, 0.5)', zIndex: 20, pointerEvents: 'none' }}>
                <div style={{ backgroundColor: '#1d4ed8', color: 'var(--color-bg-primary)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: 12, padding: '6px 12px', borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                  75% CONTENT CANVAS
                </div>
                <div className="pdf-radius-sm" style={{ fontSize: 10, color: '#1d4ed8', fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 8px', marginTop: 8, border: '1px solid #bfdbfe', borderRadius: '4px' }}>
                  Pretendard / #FFFFFF / Scrollable
                </div>
              </div>

              {/* 75 Canvas Header */}
              <div className="pdf-flex-row pdf-items-center pdf-flex-shrink-0 pdf-border-bottom" style={{ height: 56, padding: '0 32px', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>DATA CANVAS VIEW</span>
              </div>
              {/* 75 Canvas Body */}
              <div style={{ flex: 1, padding: '32px 15% 32px 32px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
                <div className="pdf-flex-row pdf-items-center pdf-border-bottom" style={{ gridColumn: 'span 2 / span 2', height: 48 }}>
                  <div style={{ width: 192, height: 24, backgroundColor: 'var(--color-border-default)', borderRadius: 4 }}></div>
                </div>
                <div className="pdf-border pdf-flex-col pdf-relative pdf-overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', height: 128, borderRadius: 8, padding: 16 }}>
                  <div style={{ width: '33%', height: 16, backgroundColor: 'var(--color-border-default)', borderRadius: 4, marginBottom: 16 }}></div>
                  <div style={{ width: '100%', borderBottom: '1px solid var(--color-border-default)', margin: '8px 0' }}></div>
                  <div style={{ width: '100%', height: 8, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4, marginBottom: 8 }}></div>
                  <div style={{ width: '100%', height: 8, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4, marginBottom: 8 }}></div>
                  <div style={{ width: '66%', height: 8, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4 }}></div>
                </div>
                <div className="pdf-border pdf-flex-col pdf-relative pdf-overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', height: 128, borderRadius: 8, padding: 16 }}>
                  <div style={{ width: '33%', height: 16, backgroundColor: 'var(--color-border-default)', borderRadius: 4, marginBottom: 16 }}></div>
                  <div style={{ width: '100%', borderBottom: '1px solid var(--color-border-default)', margin: '8px 0' }}></div>
                  <div style={{ width: '100%', height: 8, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4, marginBottom: 8 }}></div>
                  <div style={{ width: '100%', height: 8, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4, marginBottom: 8 }}></div>
                  <div style={{ width: '66%', height: 8, backgroundColor: 'var(--color-bg-primary)', borderRadius: 4 }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OS Bottom: Windows Taskbar */}
        <div className="pdf-w-full pdf-flex-shrink-0 pdf-flex-row pdf-items-center pdf-justify-between" style={{ height: 40, backgroundColor: '#09090b', padding: '0 8px', zIndex: 30, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.5)' }}>
          <div className="pdf-flex-row pdf-items-center" style={{ gap: 8 }}>
            <div className="pdf-flex-row pdf-items-center pdf-justify-center" style={{ width: 24, height: 24, borderRadius: 4, backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', fontSize: 10 }}>W</div>
            <div style={{ width: 24, height: 24, borderRadius: 4, backgroundColor: '#09090b' }}></div>
            <div style={{ width: 24, height: 24, borderRadius: 4, backgroundColor: '#09090b', borderBottom: '2px solid #60a5fa', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}></div>
          </div>
          <div className="pdf-flex-row pdf-items-center" style={{ gap: 12, fontSize: 8, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
            <span>ENG</span>
            <div className="pdf-flex-col pdf-items-end" style={{ lineHeight: 1.2 }}>
              <span>12:00 PM</span>
              <span>2024-05-23</span>
            </div>
          </div>
        </div>
      </div>
      <p className="pdf-text-copy-14 pdf-text-muted pdf-mt-200" style={{ fontSize: '10px', textAlign: 'center' }}>
        * 25:75 정밀 할당 영역을 나타냅니다.
      </p>
    </div>
  );
}
