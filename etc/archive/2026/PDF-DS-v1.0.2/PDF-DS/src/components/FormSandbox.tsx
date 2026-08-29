import React from 'react';

export default function FormSandbox() {
  return (
    <div className="pdf-bg-secondary pdf-border pdf-p-300">
      <h3 className="pdf-text-label-16 pdf-mb-200">Forms & Inputs (입력 폼 컴포넌트)</h3>
      <p className="pdf-text-copy-14 pdf-text-muted pdf-mb-300">
        입력 폼은 시스템과 사용자가 대화하는 가장 기초적인 수단입니다. 상태(Normal, Focus, Error, Disabled)에 따라 명확하고 즉각적인 시각적 피드백을 제공해야 합니다.
      </p>

      <div className="pdf-flex-col pdf-gap-300">
        
        {/* 1. Normal State */}
        <div className="pdf-flex-col pdf-gap-100">
          <label className="pdf-text-label-14-mono pdf-text-muted">1. Default State (기본 상태)</label>
          <input 
            type="text" 
            placeholder="이메일을 입력하세요" 
            className="pdf-w-full pdf-radius-md pdf-border"
            style={{ 
              padding: '12px 16px', 
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              maxWidth: '400px',
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)'
            }} 
          />
          <p className="pdf-text-copy-13-mono pdf-text-muted">도움말 텍스트는 좌측 하단에 배치하며 은은한 색상을 사용합니다.</p>
        </div>

        {/* 2. Focus State */}
        <div className="pdf-flex-col pdf-gap-100">
          <label className="pdf-text-label-14-mono pdf-text-muted">2. Focus State (포커스 상태)</label>
          <input 
            type="text" 
            defaultValue="focusing@example.com"
            className="pdf-w-full pdf-radius-md"
            style={{ 
              padding: '12px 16px', 
              border: '1px solid var(--color-text-primary)', 
              outline: '2px solid var(--color-border-hover)',
              outlineOffset: '2px',
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              maxWidth: '400px',
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)'
            }} 
          />
          <p className="pdf-text-copy-13-mono pdf-text-muted">입력 중일 때는 윤곽선을 강하게 대비시켜 사용자 위치를 안내합니다.</p>
        </div>

        {/* 3. Error State */}
        <div className="pdf-flex-col pdf-gap-100">
          <label className="pdf-text-label-14-mono pdf-text-muted">3. Validation Error (검증 오류 상태)</label>
          <input 
            type="text" 
            defaultValue="invalid-email"
            className="pdf-w-full pdf-radius-md pdf-shadow-glow"
            style={{ 
              padding: '12px 16px', 
              border: '1px solid var(--color-functional-red)', 
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              maxWidth: '400px',
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)'
            }} 
          />
          <p className="pdf-text-copy-13-mono pdf-text-red">유효한 이메일 주소 형식이 아닙니다.</p>
          <p className="pdf-text-copy-14 pdf-text-muted pdf-mt-100">오류 시에는 강렬한 Functional Red 색상과 함께 텍스트로 명확한 원인을 설명해야 합니다.</p>
        </div>

        {/* 4. Disabled State */}
        <div className="pdf-flex-col pdf-gap-100">
          <label className="pdf-text-label-14-mono pdf-text-muted">4. Disabled State (비활성 상태)</label>
          <input 
            type="text" 
            disabled
            value="수정할 수 없는 데이터"
            className="pdf-w-full pdf-radius-md pdf-border"
            style={{ 
              padding: '12px 16px', 
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              maxWidth: '400px',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-secondary)',
              cursor: 'not-allowed',
              opacity: 0.7
            }} 
          />
        </div>

      </div>
    </div>
  );
}
