import React from 'react';

export default function TypographySandbox() {
  return (
    <div className="pdf-bg-secondary pdf-border pdf-p-300">
      <h3 className="pdf-text-label-16 pdf-mb-200">Typography Scale</h3>

      <div className="pdf-flex-col pdf-gap-300">
        <div>
          <div className="pdf-text-label-14-mono pdf-text-muted pdf-mb-050">Heading 72 (Display)</div>
          <div className="pdf-text-heading-72">PDF-DS System</div>
        </div>

        <div className="pdf-border-bottom" style={{ borderColor: 'var(--color-border-hover)' }}></div>

        <div>
          <div className="pdf-text-label-14-mono pdf-text-muted pdf-mb-050">Heading 32 (Title)</div>
          <div className="pdf-text-heading-32">Physical-Digital Fusion</div>
        </div>

        <div className="pdf-border-bottom" style={{ borderColor: 'var(--color-border-hover)' }}></div>

        <div>
          <div className="pdf-text-label-14-mono pdf-text-muted pdf-mb-050">Label 16 (UI Elements)</div>
          <div className="pdf-text-label-16">System Architecture Architecture</div>
        </div>

        <div className="pdf-border-bottom" style={{ borderColor: 'var(--color-border-hover)' }}></div>

        <div>
          <div className="pdf-text-label-14-mono pdf-text-muted pdf-mb-050">Copy 14 (Body Text)</div>
          <div className="pdf-text-copy-14" style={{ maxWidth: '600px' }}>
            이번 프로젝트의 핵심 Concept은 각국의 매력을 담는 것입니다. C'est la vie라는 말처럼, 일본 파트너사인 'ものがたり'와 함께 다양성 속에서 진정한 Aura가 느껴지는 디자인을 구체화하고 싶습니다.
          </div>
        </div>

        <div className="pdf-border-bottom" style={{ borderColor: 'var(--color-border-hover)' }}></div>

        <div>
          <div className="pdf-text-label-14-mono pdf-text-muted pdf-mb-050">Mono 14 / Mono 13 (Code / Data)</div>
          <div className="pdf-text-label-14-mono pdf-mb-050">
            JetBrains Mono • 0123456789 • {`{ border-radius: 4px; }`}
          </div>
          <div className="pdf-text-copy-13-mono">
            $ git commit -m "update typography tokens"
          </div>
        </div>

        <div className="pdf-border-bottom" style={{ borderColor: 'var(--color-border-hover)' }}></div>

        <div>
          <div className="pdf-text-label-14-mono pdf-text-muted pdf-mb-150">Font Import Specifications (폰트 불러오기 명세)</div>
          <div className="pdf-flex-col pdf-gap-200">
            <div>
              <span className="pdf-text-label-14-mono" style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '8px' }}>Option A: HTML Tag (&lt;head&gt; in index.html)</span>
              <pre className="pdf-code-block pdf-selectable" style={{ margin: 0, padding: '16px', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{`<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css" />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800&display=swap" rel="stylesheet" />`}
              </pre>
            </div>
            <div>
              <span className="pdf-text-label-14-mono" style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '8px' }}>Option B: CSS @import (style.css)</span>
              <pre className="pdf-code-block pdf-selectable" style={{ margin: 0, padding: '16px', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{`@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800&display=swap');`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
