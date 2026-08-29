import React, { useState } from 'react';
import GoldenRatioSandbox from './GoldenRatioSandbox';
import SplitSandbox from './SplitSandbox';

export default function LayoutSandbox() {
  const [activeTab, setActiveTab] = useState<'pc' | 'mobile'>('pc');

  return (
    <div className="pdf-panel">
      <div className="pdf-flex-row pdf-mb-300" style={{ borderBottom: '1px solid var(--color-border-default)' }}>
        <button
          onClick={() => setActiveTab('pc')}
          className="pdf-text-label-16"
          style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'pc' ? '2px solid var(--color-functional-red)' : '2px solid transparent',
            color: activeTab === 'pc' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            fontWeight: activeTab === 'pc' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          Split Screen
        </button>
        <button
          onClick={() => setActiveTab('mobile')}
          className="pdf-text-label-16"
          style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'mobile' ? '2px solid var(--color-functional-red)' : '2px solid transparent',
            color: activeTab === 'mobile' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            fontWeight: activeTab === 'mobile' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          Mobile Screen
        </button>
      </div>

      {activeTab === 'pc' && (
        <div className="pdf-animate-fade-in">
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-text-muted">
              화면 분할 철학은 대칭 분리를 타파하고 비대칭 황금비에 준하는 25:75 비율의 스플릿 스크린을 기본 표준으로 채택한다.
            </p>
          </div>
          <GoldenRatioSandbox />
          <div className="pdf-mt-300">
            <SplitSandbox defaultMode="desktop" />
          </div>
        </div>
      )}

      {activeTab === 'mobile' && (
        <div className="pdf-animate-fade-in">
          <div className="pdf-mb-300">
            <h3 className="pdf-text-label-16 pdf-mb-100">모바일 스택 및 반응형 레이아웃 복원 가이드라인</h3>
            <ul className="pdf-list-disc pdf-text-copy-14">
              <li><strong>수직 위계적 스택킹(Vertical Stacking):</strong> 뷰포트 크기가 수축함에 따라 두 면은 즉각적으로 수직 방향으로 정렬되어 위에서 아래로 스택킹된다.</li>
              <li><strong>콘텐츠 최소 크기 타겟:</strong> 스택 카드는 어떠한 경우에도 너비 또는 높이 기준 220dp 미만으로 축소되지 않도록 최소 공간 제한치를 확보한다.</li>
            </ul>
          </div>
          <SplitSandbox defaultMode="mobile" />
        </div>
      )}
    </div>
  );
}
