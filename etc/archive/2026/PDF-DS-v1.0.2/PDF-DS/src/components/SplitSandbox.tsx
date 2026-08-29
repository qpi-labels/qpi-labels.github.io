import React, { useState } from 'react';
import { Columns, Maximize2, Monitor, Tablet, Smartphone } from 'lucide-react';

export default function SplitSandbox({ defaultMode = 'desktop' }: { defaultMode?: 'desktop' | 'tablet' | 'mobile' }) {
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>(defaultMode);
  const [splitRatio, setSplitRatio] = useState<number>(25);
  const [isSidebarHidden, setIsSidebarHidden] = useState<boolean>(false);
  const [savedRatio, setSavedRatio] = useState<number>(25);

  const changeRatioDirectly = (val: number) => {
    setSplitRatio(val);
    setIsSidebarHidden(false);
  };

  const toggleSidebarCollapse = () => {
    if (isSidebarHidden) {
      setSplitRatio(savedRatio);
      setIsSidebarHidden(false);
    } else {
      setSavedRatio(splitRatio);
      setSplitRatio(0);
      setIsSidebarHidden(true);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    if (newVal >= 20 && newVal <= 50) {
      setSplitRatio(newVal);
      setIsSidebarHidden(false);
    }
  };

  return (
    <div className="pdf-panel">
      <div className="pdf-panel-header pdf-flex-row pdf-justify-between pdf-items-center">
        <div>
          <span className="pdf-text-label-14-mono pdf-text-red pdf-mb-100 pdf-font-bold" style={{ display: 'block' }}>
            CH.6 INTERACTIVE SANDBOX
          </span>
          <h4 className="pdf-text-label-16 pdf-font-bold">
            비대칭 스플릿 스크린(Asymmetric Split Screen) 가변 조율 시뮬레이터
          </h4>
        </div>
        <Columns className="pdf-text-muted" style={{ width: 16, height: 16 }} />
      </div>

      <p className="pdf-text-copy-14 pdf-text-muted pdf-mb-300">
        PDF-DS 규격에 따른 황금 비대칭 배치(25:75)를 시뮬레이션할 수 있습니다. <strong>스플리터 제어바</strong>를 사용해 슬라이스 비율을 조율해 보세요. 드래그 조율 범위는 <strong>시스템 제한 수칙(20% ~ 50%)</strong> 내부로 자동 제약됩니다. 더블 클릭하여 사이드바의 완전 축소(Collapse) 상태를 점진 도약시킬 수도 있습니다.
      </p>

      <div className="pdf-flex-row pdf-items-center pdf-justify-between pdf-border-bottom pdf-pb-200 pdf-mb-200 pdf-flex-wrap pdf-gap-200">
        <div className="pdf-flex-row pdf-bg-secondary pdf-p-050 pdf-border pdf-radius-md">
          <button
            onClick={() => setViewportMode('desktop')}
            className="pdf-text-label-14-mono pdf-cursor-pointer pdf-radius-sm"
            style={{
              padding: '4px 14px', border: 'none',
              backgroundColor: viewportMode === 'desktop' ? 'var(--color-bg-primary)' : 'transparent',
              fontWeight: viewportMode === 'desktop' ? 'bold' : 'normal',
              color: viewportMode === 'desktop' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'
            }}
          >
            <Monitor style={{ width: 12, height: 12, marginRight: 4 }} /> Desktop
          </button>
          <button
            onClick={() => setViewportMode('tablet')}
            className="pdf-text-label-14-mono pdf-cursor-pointer pdf-radius-sm"
            style={{
              padding: '4px 14px', border: 'none',
              backgroundColor: viewportMode === 'tablet' ? 'var(--color-bg-primary)' : 'transparent',
              fontWeight: viewportMode === 'tablet' ? 'bold' : 'normal',
              color: viewportMode === 'tablet' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'
            }}
          >
            <Tablet style={{ width: 12, height: 12, marginRight: 4 }} /> Tablet
          </button>
          <button
            onClick={() => setViewportMode('mobile')}
            className="pdf-text-label-14-mono pdf-cursor-pointer pdf-radius-sm"
            style={{
              padding: '4px 14px', border: 'none',
              backgroundColor: viewportMode === 'mobile' ? 'var(--color-bg-primary)' : 'transparent',
              fontWeight: viewportMode === 'mobile' ? 'bold' : 'normal',
              color: viewportMode === 'mobile' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'
            }}
          >
            <Smartphone style={{ width: 12, height: 12, marginRight: 4 }} /> Mobile
          </button>
        </div>

        <button 
          onClick={toggleSidebarCollapse}
          className="pdf-secondary-btn"
        >
          📂 {isSidebarHidden ? '사이드 패널 팽창 (Restore)' : '사이드 패널 완전 축소 (Collapse)'}
        </button>
      </div>

      <div className="pdf-border pdf-p-150 pdf-radius-sm pdf-relative" style={{ backgroundColor: '#09090b' }}>
        <div className="pdf-text-label-14-mono pdf-text-muted pdf-absolute" style={{ fontSize: '8px', top: '4px', left: '8px' }}>
          VIRTUAL DEVICE VIEWPORT — {viewportMode.toUpperCase()} VIEW
        </div>

        <div className="pdf-border" style={{
          marginTop: '20px',
          height: '220px',
          backgroundColor: 'var(--color-bg-primary)',
          display: 'flex',
          flexDirection: viewportMode === 'mobile' ? 'column' : 'row',
          margin: '20px auto 0 auto',
          maxWidth: viewportMode === 'desktop' ? '100%' : viewportMode === 'tablet' ? '600px' : '320px',
          transition: 'max-width 0.5s ease'
        }}>
          {viewportMode !== 'mobile' ? (
            <>
              <div style={{
                width: `${splitRatio}%`,
                borderRight: '1px solid var(--color-border-default)',
                padding: '12px',
                display: splitRatio === 0 ? 'none' : 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: 'var(--color-bg-primary)',
                opacity: splitRatio === 0 ? 0 : 1,
                transition: 'all 0.3s'
              }}>
                <div>
                  <div style={{ width: 16, height: 16, backgroundColor: 'var(--color-functional-red)', borderRadius: 4, marginBottom: 8 }} />
                  <span className="pdf-text-copy-14" style={{ fontWeight: 'bold' }}>메타 컨트롤 ({splitRatio}%)</span>
                  <div style={{ height: 4, width: '50%', backgroundColor: 'var(--color-border-default)', borderRadius: 2, margin: '4px 0' }} />
                  <div style={{ height: 4, width: '75%', backgroundColor: 'var(--color-border-default)', borderRadius: 2 }} />
                </div>
                <div className="pdf-text-label-14-mono pdf-text-muted" style={{ fontSize: '9px' }}>사이드 정보판</div>
              </div>

              <div 
                onDoubleClick={toggleSidebarCollapse}
                className="pdf-flex-row pdf-items-center pdf-justify-center"
                style={{ width: 6, backgroundColor: 'var(--color-border-default)', cursor: 'col-resize' }}
                title="더블클릭시 축소/팽창 토글"
              >
                <div className="pdf-radius-sm" style={{ width: 2, height: 24, backgroundColor: 'var(--color-border-hover)' }} />
              </div>

              <div className="pdf-flex-col pdf-justify-between pdf-overflow-hidden" style={{ flex: 1, padding: '12px 15% 12px 12px', backgroundColor: 'var(--color-bg-primary)' }}>
                <div>
                  <span className="pdf-text-copy-14 pdf-font-bold">코어 캔버스 ({100 - splitRatio}%)</span>
                  <p className="pdf-text-copy-14 pdf-text-muted" style={{ fontSize: '10px', marginTop: 4 }}>
                    이곳은 주 작업 스페이스 영역으로 스플릿 비율에 따라 유동적인 반응형 리플로우가 적용됩니다. 황금 분할인 25:75 상태에서 가장 이상적인 가독 호흡을 보장합니다.
                  </p>
                </div>
                <div className="pdf-flex-row pdf-justify-between pdf-border-top pdf-pt-100 pdf-text-label-14-mono pdf-text-muted" style={{ fontSize: '9px' }}>
                  <span>REF: {100 - splitRatio}% Width</span>
                  <span>상태: 안정화</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ flex: '0 0 40%', borderBottom: '1px solid var(--color-border-default)', padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span className="pdf-text-copy-14" style={{ fontWeight: 'bold' }}>상단 제어 레이어</span>
                  <div style={{ height: 4, width: '66%', backgroundColor: 'var(--color-border-default)', borderRadius: 2, margin: '4px 0' }} />
                </div>
                <span className="pdf-text-label-14-mono pdf-text-muted" style={{ fontSize: '8px', textAlign: 'right' }}>TOP LAYER</span>
              </div>
              <div style={{ flex: '0 0 60%', padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <span className="pdf-text-copy-14" style={{ fontWeight: 'bold' }}>코어 주 영역 (100% 면적 확장)</span>
                <p className="pdf-text-copy-14 pdf-text-muted" style={{ fontSize: '9px', lineHeight: 1.2 }}>
                  모바일에서는 비대칭 가로 분할이 무력화되고 위아래 100% 수직 스택으로 재배치됩니다. 터치 충돌 방지 법칙을 수호하기 위해 가로 스와이프 제스처는 자동 중단됩니다.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {viewportMode !== 'mobile' && (
        <div className="pdf-bg-secondary pdf-p-200 pdf-border pdf-mt-200 pdf-radius-md">
          <div className="pdf-flex-row pdf-items-center pdf-justify-between pdf-mb-150">
            <span className="pdf-text-label-14-mono pdf-flex-row pdf-items-center pdf-gap-100">
              <Maximize2 style={{ width: 14, height: 14, color: 'var(--color-functional-red)' }} />
              비대칭 스플릿 수동 분할바 조율 
              <span className="pdf-text-muted" style={{ fontSize: '10px' }}>(상한선 제한: 20% ~ 50%)</span>
            </span>
            <span className="pdf-text-label-14-mono pdf-font-bold">{splitRatio}% / {100 - splitRatio}%</span>
          </div>

          <div className="pdf-flex-row pdf-items-center pdf-gap-150">
            <span className="pdf-text-label-14-mono pdf-text-muted" style={{ fontSize: '10px' }}>20% 최소</span>
            <input 
              type="range"
              min="20"
              max="50"
              value={splitRatio}
              onChange={handleSliderChange}
              style={{ flex: 1, height: 4, backgroundColor: 'var(--color-border-default)', borderRadius: 2, cursor: 'pointer', appearance: 'none' }}
            />
            <span className="pdf-text-label-14-mono pdf-text-muted" style={{ fontSize: '10px' }}>50% 최대</span>
          </div>

          <div className="pdf-flex-row pdf-justify-center pdf-gap-100 pdf-mt-200">
            <button 
              onClick={() => changeRatioDirectly(25)}
              className="pdf-text-label-14-mono pdf-radius-sm pdf-cursor-pointer"
              style={{
                padding: '4px 8px', border: '1px solid', fontSize: '10px',
                backgroundColor: splitRatio === 25 ? 'var(--color-functional-red)' : 'var(--color-bg-primary)',
                color: splitRatio === 25 ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)',
                borderColor: splitRatio === 25 ? 'var(--color-functional-red)' : 'var(--color-border-default)'
              }}
            >
              황금 가이드 25:75 적용
            </button>
            <button 
              onClick={() => changeRatioDirectly(30)}
              className="pdf-text-label-14-mono pdf-radius-sm pdf-cursor-pointer"
              style={{
                padding: '4px 8px', border: '1px solid', fontSize: '10px',
                backgroundColor: splitRatio === 30 ? 'var(--color-functional-red)' : 'var(--color-bg-primary)',
                color: splitRatio === 30 ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)',
                borderColor: splitRatio === 30 ? 'var(--color-functional-red)' : 'var(--color-border-default)'
              }}
            >
              대칭형에 가까운 30:70 적용
            </button>
            <button 
              onClick={() => changeRatioDirectly(20)}
              className="pdf-text-label-14-mono pdf-radius-sm pdf-cursor-pointer"
              style={{
                padding: '4px 8px', border: '1px solid', fontSize: '10px',
                backgroundColor: splitRatio === 20 ? 'var(--color-functional-red)' : 'var(--color-bg-primary)',
                color: splitRatio === 20 ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)',
                borderColor: splitRatio === 20 ? 'var(--color-functional-red)' : 'var(--color-border-default)'
              }}
            >
              미니멀 밴드형 20:80 적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
