import React from 'react';

export default function MaterialSandbox() {
  return (
    <div className="pdf-bg-secondary pdf-border pdf-p-300">
      <h3 className="pdf-text-label-16 pdf-mb-200">Material & Elevation (머티리얼 및 표면 높이)</h3>
      <p className="pdf-text-copy-14 pdf-text-muted pdf-mb-300">
        플랫(Flat) 디자인의 한계를 넘기 위해, 빛의 방향과 그림자를 활용하여 UI 요소가 화면 위에 떠 있거나 파여 있는 듯한 물리적인 질감을 부여합니다.
      </p>

      <div className="pdf-panel pdf-grid-bg pdf-mb-300">
        <h4 className="pdf-text-label-16 pdf-mb-100">Bowers & Wilkins Design Inspiration</h4>
        <p className="pdf-text-copy-14 pdf-text-muted">
          각각의 물리적 재료가 고유의 질감과 특성을 온전히 유지하면서도, 서로 끊김 없이 이어지며 하나의 거대한 조화로운 형태를 이루는 <strong>Bowers & Wilkins의 오디오 하드웨어 미학</strong>에서 직접적인 영감을 받아 설계되었습니다.
        </p>
      </div>

      <div className="pdf-flex-col pdf-gap-300">

        {/* Layer 1 */}
        <div className="pdf-flex-col pdf-gap-100">
          <div className="pdf-text-label-14-mono pdf-text-muted">1. Flat Surface (평면)</div>
          <div className="pdf-p-200 pdf-border" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            <span className="pdf-text-label-16">기본 패널 (Base Panel)</span>
            <p className="pdf-text-copy-14 pdf-text-muted pdf-mt-100">가장 하단에 위치하는 패널입니다. 그림자 없이 단색 배경과 테두리로만 구분됩니다.</p>
          </div>
        </div>

        {/* Layer 2 */}
        <div className="pdf-flex-col pdf-gap-100">
          <div className="pdf-text-label-14-mono pdf-text-muted">2. Hardware Bevel (하드웨어 베벨 / 돌출형)</div>
          <div className="pdf-p-200 pdf-radius-md" style={{ backgroundColor: 'var(--color-bg-primary)', boxShadow: 'var(--shadow-hardware-bevel)' }}>
            <span className="pdf-text-label-16">독립적인 제어 컨테이너 (Control Container)</span>
            <p className="pdf-text-copy-14 pdf-text-muted pdf-mt-100">상단에 미세한 하이라이트(1px 흰색)와 하단에 미세한 섀도우를 부여하여 버튼이나 중요 카드가 살짝 튀어나온 듯한 질감을 만듭니다.</p>
          </div>
        </div>

        {/* Layer 3 */}
        <div className="pdf-flex-col pdf-gap-100">
          <div className="pdf-text-label-14-mono pdf-text-muted">3. Hardware Bevel Active (가압 상태 / 함몰형)</div>
          <div className="pdf-p-200 pdf-radius-md" style={{ backgroundColor: 'var(--color-bg-secondary)', boxShadow: 'var(--shadow-hardware-bevel-active)' }}>
            <span className="pdf-text-label-16">눌린 상태 (Pressed / Active State)</span>
            <p className="pdf-text-copy-14 pdf-text-muted pdf-mt-100">상단 그림자와 하단 하이라이트로 반전시켜 요소가 눌려 들어간 형태를 완벽하게 모사합니다.</p>
          </div>
        </div>

        {/* Layer 4 */}
        <div className="pdf-flex-col pdf-gap-100">
          <div className="pdf-text-label-14-mono pdf-text-muted">4. Frosted Glass (반투명 유리 / 블러)</div>
          <div
            className="pdf-p-300 pdf-border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              backgroundImage: 'var(--blueprint-grid-pattern)',
              backgroundSize: '24px 24px'
            }}
          >
            <span className="pdf-text-label-16">사이드바 및 네비게이션 표면 (Navigation Surface)</span>
            <p className="pdf-text-copy-14 pdf-text-muted pdf-mt-100">뒤에 있는 콘텐츠의 형태를 부드럽게 투과시키면서도 가독성을 유지하는 소재입니다. 주로 플로팅 네비게이션바 등에 사용됩니다.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
