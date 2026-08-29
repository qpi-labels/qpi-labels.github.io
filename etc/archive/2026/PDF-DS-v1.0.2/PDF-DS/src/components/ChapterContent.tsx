import React from 'react';

// Import our custom interactive sandboxes
import GridSandbox from './GridSandbox';
import AlignmentSandbox from './AlignmentSandbox';
import TypographySandbox from './TypographySandbox';
import LayoutComparisonSandbox from './LayoutComparisonSandbox';
import GoldenRatioSandbox from './GoldenRatioSandbox';
import ColorSandbox from './ColorSandbox';
import ButtonSandbox from './ButtonSandbox';
import SplitSandbox from './SplitSandbox';
import MobileNavSandbox from './MobileNavSandbox';
import CodeExport from './CodeExport';
import QASandbox from './QASandbox';

// New Components
import MaterialSandbox from './MaterialSandbox';
import FormSandbox from './FormSandbox';
import ModalSandbox from './ModalSandbox';
import NavigationSandbox from './NavigationSandbox';

interface ChapterProps {
  activeChapter: number;
}

export default function ChapterContent({ activeChapter }: ChapterProps) {
  return (
    <div className="pdf-animate-fade-in">

      {/* 1. Philosophy */}
      {activeChapter === 1 && (
        <section id="ch-1">
          <div className="pdf-mb-400" style={{ textAlign: 'center', padding: 'var(--space-600) 0' }}>
            <span className="pdf-text-label-14-mono pdf-text-red pdf-mb-200" style={{ display: 'inline-block' }}>
              PHYSICAL-DIGITAL FUSION DESIGN SYSTEM
            </span>
            <h1 className="pdf-mb-300" style={{ fontSize: '64px', lineHeight: '1.1', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
              물리적 촉각을 지닌<br />디지털 설계 언어
            </h1>
            <p className="pdf-text-copy-14 pdf-text-muted" style={{ fontSize: '18px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
              디터 람스의 철학과 하드웨어적 정밀함을 웹 환경에 완벽히 이식한 통합 디자인 시스템입니다. 복잡한 스타일링 없이, 선언적인 구조와 엄격한 여백만으로 극한의 정밀함을 달성하세요.
            </p>
            <div className="pdf-mt-400 pdf-flex-row pdf-justify-center" style={{ gap: '16px' }}>
              <a href="https://github.com/qpi-labels/PDF-DS" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button className="pdf-btn-primary pdf-btn-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View on GitHub
                </button>
              </a>
              <a href="/editor/" style={{ textDecoration: 'none' }}>
                <button className="pdf-secondary-btn pdf-btn-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                  Open Editor
                </button>
              </a>
            </div>
          </div>

          <div className="pdf-mb-400">
            <div className="pdf-panel pdf-grid-bg pdf-flex-row pdf-items-center pdf-justify-center pdf-gap-300 pdf-flex-wrap" style={{ padding: 'var(--space-400)' }}>
              <div className="pdf-content-relative pdf-flex-shrink-0" style={{ width: '240px', height: '240px' }}>
                <img
                  src="/Px7S3.webp"
                  alt="Design Motif"
                  className="pdf-w-full pdf-h-full pdf-radius-lg pdf-shadow-bevel"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="pdf-content-relative">
                <p className="pdf-text-label-14-mono pdf-text-muted" style={{ lineHeight: '1.8' }}>
                  <strong className="pdf-text-red" style={{ fontSize: '12px' }}>DESIGN MOTIF</strong><br />
                  서로 다른 물리적 재료들이<br />
                  연속성 있게 조화를 이루는<br />
                  하드웨어의 미학
                </p>
              </div>
            </div>
          </div>

          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-text-muted">
              현대 소프트웨어 공학에서 사용자 인터페이스는 단순히 화면에 요소를 렌더링하는 것을 넘어, 하드웨어가 가진 물리적 인지성과 촉각적 정직성을 디지털 공간으로 확장하는 다리 역할을 수행해야 한다.
            </p>
          </div>
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14">
              본 디자인 시스템(Physical-Digital Fusion Design System, 이하 PDF-DS)은 20세기 산업 디자인의 거장 디터 람스의 설계 철학과 현대 디지털 제품 설계 방법론을 유기적으로 결합하여 탄생하였다. 디터 람스의 10대 디자인 원칙은 제품의 유용성, 심미성, 이해 가능성, 신뢰성, 지속 가능성, 그리고 불필요한 장식을 배제한 '최소한의 디자인'을 극대화하는 것에 초점을 맞춘다.
            </p>
            <br />
            <p className="pdf-text-copy-14">
              물리적 감각을 디지털 인터페이스로 전이하는 과정에서는 Bowers & Wilkins에서 엿볼 수 있는, 물리적 재료 각각의 특성을 유지하면서 조화롭게 만들어낸 고급스러움과 틴에이지 엔지니어링의 정밀한 촉각적 상호작용 방식이 핵심적인 이정표를 제공한다.
            </p>
            <br />
            <p className="pdf-text-copy-14">
              PDF-DS는 이러한 물리적 엔지니어링 사상을 디지털 디자인 언어로 계승한다. 스크린 내부의 요소들을 단순한 이미지나 가상의 레이어로 취급하지 않고, 명확한 두께를 가진 경계선과 규칙적인 격자 체계 위에 정렬된 독립적인 조작기(Manipulator)로 정의한다.
            </p>
          </div>
        </section>
      )}

      {/* 2. System Architecture */}
      {activeChapter === 2 && (
        <section id="ch-2">
          <h2 className="pdf-text-label-16 pdf-mb-200">기존 웹의 추상화 위기와 렌더링 파편화</h2>
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-text-muted">
              현대의 프론트엔드 생태계는 무수한 유틸리티 클래스와 CSS-in-JS 라이브러리들로 인해 추상화의 늪에 빠져 있습니다. 버튼 하나를 그리기 위해 수십 개의 런타임 연산이 발생하며, 이는 결과적으로 예측하기 힘든 렌더링 파편화 현상으로 이어집니다.
            </p>
          </div>

          <h2 className="pdf-text-label-16 pdf-mb-200">PDF-DS의 단일 레이어 아키텍처 (Single-Layer Architecture)</h2>
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14">
              PDF-DS는 이러한 복잡성을 완전히 제거합니다. 우리는 스타일을 컴포넌트에 종속시키거나 자바스크립트로 계산하지 않습니다. <strong>단 하나의 순수 CSS 파일(`index.css`)</strong> 내부에 모든 토큰, 스케일, 머티리얼, 레이아웃 규칙을 선언적으로 컴파일해 두었습니다.
            </p>
            <br />
            <p className="pdf-text-copy-14">
              프레임워크(React, Vue, Svelte)에 상관없이, 심지어 프레임워크가 없는 순수 HTML 환경에서도 브라우저의 네이티브 렌더링 엔진과 직접 맞닿아 100% 동일한 시각적 무결성을 보장합니다. 이것이 바로 물리적 장비의 회로 기판을 짜는 것과 같은 <strong>'설계의 정직성'</strong>입니다.
            </p>
          </div>

          <h2 className="pdf-text-label-16 pdf-mb-200">CSS Custom Properties를 통한 실시간 동역학 제어</h2>
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14">
              PDF-DS 아키텍처의 핵심은 최상단 <code>:root</code>에 정의된 수백 개의 CSS 변수(Custom Properties)입니다. 다크 모드 전환, 고대비 모드 등의 테마 변경은 자바스크립트 리렌더링 없이 브라우저의 하드웨어 가속을 받는 CSS 변수 스왑만으로 즉각적으로 처리됩니다.
            </p>
          </div>
        </section>
      )}

      {/* 3. Installation */}
      {activeChapter === 3 && (
        <section id="ch-3">
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-text-muted">
              PDF-DS의 단일 레이어 아키텍처 덕분에, 복잡한 빌드 도구 없이 단 한 줄의 CSS 링크만으로 모든 스타일과 애니메이션 규칙을 프로젝트에 즉시 주입할 수 있습니다.
            </p>
            <div className="pdf-mt-200 pdf-flex-row">
              <a href="https://github.com/qpi-labels/PDF-DS" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button className="pdf-btn-primary pdf-btn-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View on GitHub
                </button>
              </a>
            </div>
          </div>

          <h2 className="pdf-text-label-16 pdf-mb-200">📦 CDN을 통한 CSS 퀵 스타트 (권장)</h2>
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-mb-100">
              HTML 파일의 <code>&lt;head&gt;</code> 태그 내부에 아래 jsDelivr CDN 링크를 추가하면 별도의 다운로드나 설치 과정 없이 바로 PDF-DS 컴포넌트 클래스를 사용할 수 있습니다.
            </p>
            <div className="pdf-code-block pdf-selectable" style={{ whiteSpace: 'pre-wrap' }}>
              {`<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/qpi-labels/PDF-DS@main/src/index.css">`}
            </div>
          </div>

          <h2 className="pdf-text-label-16 pdf-mb-200">💻 로컬 개발 환경 구성 (선택)</h2>
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-mb-100">
              만약 이 저장소를 직접 클론하여 컴포넌트 샌드박스를 실행하거나 수정하고 싶다면 아래 과정을 따르십시오.
            </p>
            <div className="pdf-code-block pdf-selectable" style={{ whiteSpace: 'pre-wrap' }}>
              {`# 패키지 의존성 설치
npm install

# 샌드박스 개발 서버 실행 (localhost:3000)
npm run dev

# 프로덕션 빌드 출력
npm run build`}
            </div>
          </div>

          <h2 className="pdf-text-label-16 pdf-mb-200">🏷️ 선택적 출처 표시 (Optional Attribution)</h2>
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-mb-200">
              PDF-DS를 사용하여 제작된 사이트임을 명시하고 싶다면, 아래의 출처 표시 코드를 사이드바 하단이나 푸터에 자유롭게 추가할 수 있습니다.
            </p>
            
            <div className="pdf-mt-100 pdf-mb-300">
              <p className="pdf-text-label-14-mono pdf-text-muted pdf-mb-100">디자인 미리보기 (실제 사이드바 적용 예시)</p>
              <div style={{ width: '100%', maxWidth: '320px', border: '1px solid var(--color-border-default)', backgroundColor: 'var(--color-bg-primary)', position: 'relative', overflow: 'hidden' }}>
                <aside className="pdf-sidebar" style={{ width: '100%', borderRight: 'none', minHeight: '100%' }}>
                  <div className="pdf-content-relative pdf-p-300">
                    <nav>
                      <span className="pdf-text-label-14-mono pdf-text-muted pdf-border-bottom pdf-pb-100 pdf-mb-100 pdf-font-bold" style={{ display: 'block' }}>
                        GUIDELINES INDEX
                      </span>
                      <div className="pdf-mb-200">
                        <div className="pdf-nav-group-header">
                          <span>Intro & Architecture</span>
                          <svg className="pdf-chevron" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                        </div>
                        <div className="pdf-nav-item">
                          <div className="pdf-flex-row pdf-items-center pdf-gap-150 pdf-overflow-hidden pdf-w-full">
                            <span className="pdf-text-label-14-mono pdf-text-center pdf-font-bold" style={{ backgroundColor: 'var(--color-border-default)', color: 'var(--color-text-secondary)', padding: '4px 8px', borderRadius: '2px', minWidth: '32px' }}>01</span>
                            <span className="pdf-text-label-16">Philosophy</span>
                          </div>
                        </div>
                        <div className="pdf-nav-item active">
                          <div className="pdf-flex-row pdf-items-center pdf-gap-150 pdf-overflow-hidden pdf-w-full">
                            <span className="pdf-text-label-14-mono pdf-text-center pdf-font-bold" style={{ backgroundColor: 'var(--color-functional-red)', color: 'var(--color-bg-primary)', padding: '4px 8px', borderRadius: '2px', minWidth: '32px' }}>02</span>
                            <span className="pdf-text-label-16">System Architecture</span>
                          </div>
                        </div>
                      </div>
                    </nav>
                    
                    {/* 출처 표시 미리보기 */}
                    <div className="pdf-mt-400 pdf-pt-200 pdf-border-top" style={{ marginTop: '32px', paddingTop: '16px' }}>
                      <div className="pdf-text-label-14-mono pdf-text-muted pdf-mb-050">
                        <a href="https://github.com/qpi-labels/PDF-DS" target="_blank" rel="noreferrer"
                          style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}>
                          View on GitHub ↗
                        </a>
                      </div>
                      <div className="pdf-text-label-14-mono pdf-text-muted">
                        Made with PDF-DS
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>

            <p className="pdf-text-label-14-mono pdf-text-muted pdf-mb-100">적용 코드</p>
            <div className="pdf-code-block pdf-selectable" style={{ whiteSpace: 'pre-wrap' }}>
              {`<div class="pdf-mt-400 pdf-pt-200 pdf-border-top" style="margin-top: 32px; padding-top: 16px;">
  <div class="pdf-text-label-14-mono pdf-text-muted pdf-mb-050">
    <a href="https://github.com/qpi-labels/PDF-DS" target="_blank"
      style="color: var(--color-text-secondary); text-decoration: none; transition: color 0.2s;"
      onmouseover="this.style.color='var(--color-text-primary)'"
      onmouseout="this.style.color='var(--color-text-secondary)'">View on GitHub ↗</a>
  </div>
  <div class="pdf-text-label-14-mono pdf-text-muted">
    Made with PDF-DS
  </div>
</div>`}
            </div>
          </div>
        </section>
      )}

      {/* 4. Blueprint Grid & Spacing */}
      {activeChapter === 4 && (
        <section id="ch-4">
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-text-muted">
              디지털 레이아웃의 구조적 정밀도를 담보하기 위해 PDF-DS는 물리적 설계 도면에서 착안한 청사진 그리드와 수학적으로 정렬된 다중 스케일 여백 시스템을 채택한다.
            </p>
          </div>
          <div className="pdf-bg-secondary pdf-border pdf-p-300 pdf-flex-col pdf-gap-200 pdf-mb-300" style={{ backgroundImage: 'var(--blueprint-grid-pattern)', backgroundSize: 'var(--space-300) var(--space-300)' }}>
            <div className="pdf-flex-row pdf-gap-100">
              <div style={{ width: 'var(--space-100)', height: 'var(--space-400)', backgroundColor: 'var(--color-functional-red)' }}></div>
              <span className="pdf-text-label-14-mono pdf-text-red">--space-100 (8px)</span>
            </div>
            <div className="pdf-flex-row pdf-gap-200">
              <div style={{ width: 'var(--space-200)', height: 'var(--space-400)', backgroundColor: 'var(--color-functional-red)' }}></div>
              <span className="pdf-text-label-14-mono pdf-text-red">--space-200 (16px)</span>
            </div>
            <div className="pdf-flex-row pdf-gap-300">
              <div style={{ width: 'var(--space-300)', height: 'var(--space-400)', backgroundColor: 'var(--color-functional-red)' }}></div>
              <span className="pdf-text-label-14-mono pdf-text-red">--space-300 (24px)</span>
            </div>
          </div>
          <div className="pdf-mb-300">
            <GridSandbox />
          </div>
        </section>
      )}

      {/* 5. Typography */}
      {activeChapter === 5 && (
        <section id="ch-5">
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-text-muted">
              타이포그래피는 PDF-DS에서 가장 주도적인 구조체이다. 감정적인 서체를 철저히 지양하는 대신, 정교하게 조정된 네오 그로테스크 산세리프 서체인 Pretendard를 바탕으로 타이틀, 본문, 코드(고정폭)를 선언한다.
            </p>
          </div>
          <div className="pdf-mb-300">
            <TypographySandbox />
          </div>

          <details className="pdf-mt-200 pdf-cursor-pointer pdf-border-top" style={{ paddingTop: '16px' }}>
            <summary className="pdf-text-label-14-mono pdf-text-muted pdf-font-bold">[+] 타이포그래피 구현 코드 보기</summary>
            <div className="pdf-code-block pdf-selectable pdf-mt-100" style={{ whiteSpace: 'pre-wrap' }}>
              {`<!-- 1. 헤딩 타이틀 (Heading Typography) -->
<!-- 가장 눈에 띄는 제목 요소에 사용합니다. -->
<h1 class="pdf-text-heading-72">거대한 메인 타이틀 (72px)</h1>
<h1 class="pdf-text-heading-32">최상위 타이틀 (32px)</h1>
<h2 class="pdf-text-heading-24">중간 타이틀 (24px)</h2>

<!-- 2. 라벨 (UI Labels & Emphasized Text) -->
<!-- 버튼, 네비게이션, 짧은 강조 텍스트에 사용합니다. -->
<span class="pdf-text-label-16">중요 라벨 텍스트 (16px, Bold)</span>
<span class="pdf-text-label-14-mono">고정폭 메타데이터 라벨 (14px)</span>

<!-- 3. 본문 텍스트 (Copy/Body Text) -->
<!-- 긴 단락이나 일반 설명 문구에 사용합니다. -->
<p class="pdf-text-copy-14">기본 본문 텍스트입니다. (14px)</p>
<p class="pdf-text-copy-13-mono pdf-text-muted">부가적인 설명이나 작은 캡션 (13px, Muted)</p>

<!-- 4. 다국어/숫자 복합 사용 예시 -->
<!-- JetBrains Mono와 Pretendard가 자동 폴백으로 섞여 렌더링됩니다. -->
<span class="pdf-text-label-14-mono">API_KEY_12345 (생성일: 2026-05-26)</span>`}
            </div>
          </details>

          <div className="pdf-mb-300 pdf-mt-300">
            <h3 className="pdf-text-label-16 pdf-mb-100">Primary Typeface: Pretendard</h3>
            <p className="pdf-text-copy-14 pdf-text-muted pdf-mb-100">
              시스템 전반의 기본 텍스트는 <strong>Pretendard</strong>를 사용합니다. Pretendard는 본문 렌더링 시 뛰어난 가독성을 제공할 뿐만 아니라, <strong>한국어, 영어, 일본어 등 다국어 환경을 네이티브 수준으로 완벽하게 지원</strong>하여 별도의 언어별 폰트 폴백(Fallback) 지정 없이도 훌륭한 시각적 일관성을 유지합니다.
            </p>
          </div>
          <div className="pdf-mb-300">
            <h3 className="pdf-text-label-16 pdf-mb-100">Mono Typeface: JetBrains Mono</h3>
            <p className="pdf-text-copy-14 pdf-text-muted">
              코드, 숫자, 메타데이터 등 기하학적 정렬이 필요한 특수 영역에는 고정폭(Monospace) 폰트인 <strong>JetBrains Mono</strong>를 제한적으로 적용합니다. 고정폭 폰트 적용 시 영문과 숫자 기호에만 JetBrains Mono가 적용되며, 그 외의 <strong>한국어 등 기타 언어 문자는 자동으로 Pretendard 폰트로 부드럽게 폴백(Fallback)</strong>되어 다국어 혼용 환경에서도 깨짐 없는 출력 품질을 보장합니다.
            </p>
          </div>
          <div className="pdf-mb-300">
            <h3 className="pdf-text-label-16 pdf-mb-100">광학적 정렬 및 레이아웃 렌더링 규칙</h3>
            <ul className="pdf-list-disc pdf-text-copy-14">
              <li><strong>광학적 미세 보정 (Optical Alignment):</strong> 텍스트와 이형의 아이콘이 수평으로 결합할 때 기하학적 중앙 정렬 연산 결과가 어색해 보일 수 있다. 이 경우 ±1px 한도 내에서 수동으로 조정해야 한다.</li>
              <li><strong>구두점 및 표기식의 미학:</strong> 인용구는 둥근 따옴표(“ ”)를 사용하고, 줄바꿈으로 인해 숫자와 단위가 찢어지지 않도록 비줄바꿈 공백(Non-breaking Space) 처리를 선행해야 한다 (예: 10 MB).</li>
            </ul>
          </div>
          <div className="pdf-mb-300">
            <AlignmentSandbox />
          </div>
        </section>
      )}

      {/* 6. Color */}
      {activeChapter === 6 && (
        <section id="ch-6">
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-text-muted">
              PDF-DS의 색상 전술은 완전한 절제에 기반을 둔다. 형형색색의 컬러 스펙트럼과 과도한 그라디언트는 추방된다. 오직 아크로매틱(Achromatic) 토대 위에 구축된다.
            </p>
          </div>
          <div className="pdf-mb-300">
            <h3 className="pdf-text-label-16 pdf-mb-100">아크로매틱 기본 배경 및 경계선 시스템</h3>
            <div className="pdf-code-block pdf-mb-200">
              배경 1 (Background 1: #FFFFFF)<br />
              배경 2 (Background 2: #F4F4F5)<br />
              컴포넌트 Rest (Color 1: #FFFFFF)<br />
              경계선 Rest (Color 4: #E4E4E7)
            </div>
            <p className="pdf-text-copy-14">
              페이지 전체를 감싸는 최하단 도화지 영역인 '배경 1'은 순수한 백색인 #FFFFFF를 지정하며, 제한적인 수준에서 '배경 2'인 #F4F4F5를 차용하여 깊이 단계를 제어한다.
            </p>
          </div>
          <div className="pdf-mb-300">
            <h3 className="pdf-text-label-16 pdf-mb-100">펑셔널 레드(Functional Red) 액센트 설계</h3>
            <p className="pdf-text-copy-14 pdf-mb-100">
              오직 단 하나의 핵심 하이라이트 색상인 <strong>펑셔널 레드(Functional Red, #AD1D1D)</strong>가 시각적 폭발력을 획득한다. 오직 세 가지 상황에서만 제한적으로 동원된다.
            </p>
            <ul className="pdf-list-disc pdf-text-copy-14">
              <li>화면 내부에서 사용자가 즉시 실행해야만 하는 단 하나의 일차적 명령 버튼(Primary Call to Action)</li>
              <li>데이터의 영구적인 변동을 초래하는 위급한 경고성 제어 장치(Critical Destructive Action)</li>
              <li>시스템 오류나 검증 누락 상태를 실시간으로 환기해야 하는 즉각적 위기 상태 표시기(Immediate Validation State Indicator)</li>
            </ul>
          </div>
          <div className="pdf-mb-300">
            <ColorSandbox />
          </div>

          <details className="pdf-mt-200 pdf-cursor-pointer pdf-border-top" style={{ paddingTop: '16px' }}>
            <summary className="pdf-text-label-14-mono pdf-text-muted pdf-font-bold">[+] 컬러 구현 코드 보기</summary>
            <div className="pdf-code-block pdf-selectable pdf-mt-100" style={{ whiteSpace: 'pre-wrap' }}>
              {`/* 1. 디자인 시스템 토큰을 활용한 CSS 예시 (CSS Variables) */
.my-custom-panel {
  /* 배경과 텍스트 대비 */
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  
  /* 경계선 토큰 적용 */
  border: 1px solid var(--color-border-default);
}
.my-custom-panel:hover {
  border-color: var(--color-border-hover);
}

/* 2. 유틸리티 클래스를 이용한 HTML 적용 예시 */
<!-- 붉은색 액센트 텍스트 -->
<div class="pdf-text-red pdf-font-bold">Error: Connection Lost</div>

<!-- 보조 텍스트 색상 (Muted) -->
<div class="pdf-text-muted pdf-text-copy-14">마지막 업데이트: 1시간 전</div>

<!-- 붉은색 배경 (주로 알림 뱃지 등에 사용) -->
<div class="pdf-bg-red" style="color: var(--color-bg-primary);">알림</div>`}
            </div>
          </details>
        </section>
      )}

      {/* 7. Materials */}
      {activeChapter === 7 && (
        <section id="ch-7">
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-text-muted">
              하드웨어의 물리적 재질감을 디지털로 모사하는 머티리얼 시스템입니다. 단순 평면을 넘어선 고도화된 깊이(Elevation)와 빛의 투과율 규칙을 준수합니다.
            </p>
          </div>
          <div className="pdf-mb-300">
            <MaterialSandbox />
          </div>

          <details className="pdf-mt-200 pdf-cursor-pointer pdf-border-top" style={{ paddingTop: '16px' }}>
            <summary className="pdf-text-label-14-mono pdf-text-muted pdf-font-bold">[+] 머티리얼 및 표면 높이 구현 코드 보기</summary>
            <div className="pdf-code-block pdf-selectable pdf-mt-100" style={{ whiteSpace: 'pre-wrap' }}>
              {`<!-- 1. 기본 하드웨어 패널 (Standard Panel) -->
<!-- 미세한 볼륨감(Bevel)과 그림자가 포함된 기본 표면입니다. -->
<div class="pdf-panel">
  <div class="pdf-panel-header">
    <h3 class="pdf-text-label-16">패널 타이틀</h3>
  </div>
  <p class="pdf-text-copy-14 pdf-text-muted">안정적인 하드웨어 재질감</p>
</div>

<!-- 2. 프로스트 글래스 / 반투명 표면 (Frosted Glass) -->
<!-- 스크롤 오버레이나 사이드바, 네비게이션 영역에 주로 사용합니다. -->
<div style="background-color: var(--bg-sidebar); backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%); padding: var(--space-200);">
  <span class="pdf-text-label-14-mono">투과되는 유리 재질</span>
</div>

<!-- 3. 상태 표시용 글로우 이펙트 (Glow Effect) -->
<div class="pdf-shadow-glow" style="border: 1px solid var(--color-functional-red); border-radius: 8px; padding: 16px;">
  강조되어야 하는 치명적 알림 박스
</div>`}
            </div>
          </details>
        </section>
      )}

      {/* 8. Buttons & Morphing */}
      {activeChapter === 8 && (
        <section id="ch-8">
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-text-muted">
              버튼은 물리 하드웨어의 택타일 스위치를 디지털 화면 내부로 완벽하게 복제해 온 PDF-DS의 핵심 제어 컴포넌트이다. 외곽선의 예리함과 기하학적 형태 변화 메커니즘을 추가하여 정교한 피드백을 완성한다.
            </p>
          </div>
          <div className="pdf-mb-300">
            <h3 className="pdf-text-label-16 pdf-mb-100">형태 모핑(Shape Morphing) 메커니즘</h3>
            <p className="pdf-text-copy-14">
              평상시 기본 Rest 상태에서는 완전한 원형 스타일(Fully Rounded)을 유지하다가, 마우스가 진입(Hover)하거나 손가락으로 가압(Press)하는 물리적 에너지가 전달되는 순간 코너 반경을 좁히며 엣지 있는 직사각형 형태로 탈바꿈한다.
            </p>
          </div>
          <div className="pdf-mb-300">
            <ButtonSandbox />
          </div>

          <details className="pdf-mt-200 pdf-cursor-pointer pdf-border-top" style={{ paddingTop: '16px' }}>
            <summary className="pdf-text-label-14-mono pdf-text-muted pdf-font-bold">[+] 버튼 구현 코드 보기</summary>
            <div className="pdf-code-block pdf-selectable pdf-mt-100" style={{ whiteSpace: 'pre-wrap' }}>
              {`<!-- 1. 1차 액션 (Primary Button) -->
<!-- 화면당 1개 제한 권장, 가장 중요한 단일 액션 -->
<!-- Hover/Active 시 둥근 알약(Capsule) 형태에서 직사각형으로 모핑(Morphing)됩니다. -->
<button class="pdf-btn-primary">
  SUBMIT DATA
</button>

<!-- 2. 2차 액션 (Secondary Button) -->
<!-- 폼 취소, 뒤로가기 등 보조적인 동작 -->
<button class="pdf-secondary-btn">
  CANCEL
</button>

<!-- 3. 고스트 액션 (Ghost Button / Text Button) -->
<!-- 테두리 없이 텍스트만 존재, 중요도가 낮은 부가 기능 -->
<!-- pdf-secondary-btn 구조에서 border를 빼고 여백을 줄여 사용 가능 -->
<button class="pdf-secondary-btn" style="border: none; background: transparent;">
  Learn More
</button>

<!-- 4. 버튼 사이즈 토큰 (Button Sizing Modifiers) -->
<!-- XS (32px) | SM (40px) | MD (44px, 기본) | LG (48px) | XL (56px) -->
<div class="pdf-flex-row pdf-gap-100">
  <button class="pdf-btn-primary pdf-btn-xs">XS BTN</button>
  <button class="pdf-btn-primary pdf-btn-sm">SM BTN</button>
  <button class="pdf-btn-primary pdf-btn-md">MD BTN</button>
</div>`}
            </div>
          </details>
        </section>
      )}

      {/* 9. Forms */}
      {activeChapter === 9 && (
        <section id="ch-9">
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-text-muted">
              사용자의 데이터를 정밀하게 입력받고 제어하는 폼 컴포넌트 명세입니다. 입력 필드의 상태에 따라 명확하고 즉각적인 시각 피드백을 제공해야 합니다.
            </p>
          </div>
          <div className="pdf-mb-300">
            <FormSandbox />
          </div>

          <details className="pdf-mt-200 pdf-cursor-pointer pdf-border-top" style={{ paddingTop: '16px' }}>
            <summary className="pdf-text-label-14-mono pdf-text-muted pdf-font-bold">[+] 폼 입력 구현 코드 보기</summary>
            <div className="pdf-code-block pdf-selectable pdf-mt-100" style={{ whiteSpace: 'pre-wrap' }}>
              {`<!-- 1. 기본 텍스트 입력 폼 세트 -->
<div class="pdf-flex-col pdf-gap-100">
  <label class="pdf-text-label-14-mono pdf-text-muted">USERNAME</label>
  <input type="text" class="pdf-input" placeholder="Enter your name" />
</div>

<!-- 2. 드롭다운(Select) 폼 세트 -->
<div class="pdf-flex-col pdf-gap-100">
  <label class="pdf-text-label-14-mono pdf-text-muted">USER ROLE</label>
  <select class="pdf-input">
    <option value="admin">Administrator</option>
    <option value="editor">Editor</option>
    <option value="viewer">Viewer</option>
  </select>
</div>

<!-- 3. 입력 폼 사이즈 토큰 (Form Sizing Modifiers) -->
<!-- 버튼 사이즈와 1:1로 대응하여 수평 정렬을 완벽하게 맞출 수 있습니다. -->
<input type="text" class="pdf-input pdf-input-xs" placeholder="XS Input (32px)" />
<input type="text" class="pdf-input pdf-input-sm" placeholder="SM Input (40px)" />
<input type="text" class="pdf-input pdf-input-md" placeholder="MD Input (44px, Default)" />
<input type="text" class="pdf-input pdf-input-lg" placeholder="LG Input (48px)" />
<input type="text" class="pdf-input pdf-input-xl" placeholder="XL Input (56px)" />`}
            </div>
          </details>
        </section>
      )}

      {/* 10. Modals */}
      {activeChapter === 10 && (
        <section id="ch-10">
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-text-muted">
              현재의 흐름을 강제로 멈추고 사용자의 즉각적인 집중과 결정을 요구하는 모달 및 다이얼로그 시스템 명세입니다.
            </p>
          </div>
          <div className="pdf-mb-300">
            <ModalSandbox />
          </div>

          <details className="pdf-mt-200 pdf-cursor-pointer pdf-border-top" style={{ paddingTop: '16px' }}>
            <summary className="pdf-text-label-14-mono pdf-text-muted pdf-font-bold">[+] 모달 다이얼로그 구현 코드 보기</summary>
            <div className="pdf-code-block pdf-selectable pdf-mt-100" style={{ whiteSpace: 'pre-wrap' }}>
              {`<!-- 1. 전체 화면 오버레이 (Dimmed Background) -->
<!-- z-index를 높게 설정하고 화면 전체를 덮습니다. -->
<div class="pdf-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 998;"></div>

<!-- 2. 모달 다이얼로그 본체 -->
<!-- 화면 중앙에 고정시키며 입체감을 강하게 부여합니다. -->
<div class="pdf-panel" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 999; min-width: 420px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
  
  <!-- 모달 헤더 -->
  <div class="pdf-border-bottom pdf-pb-150 pdf-mb-200 pdf-flex-row pdf-justify-between pdf-items-center">
    <h3 class="pdf-text-label-16">DELETE SYSTEM DATA</h3>
    <button class="pdf-text-muted pdf-cursor-pointer" style="font-size: 18px;">✕</button>
  </div>
  
  <!-- 모달 콘텐츠 -->
  <p class="pdf-text-copy-14 pdf-text-muted pdf-mb-300">
    이 동작은 되돌릴 수 없습니다.<br/>서버에서 영구적으로 삭제하시겠습니까?
  </p>
  
  <!-- 모달 푸터 (액션 버튼) -->
  <div class="pdf-flex-row pdf-justify-end pdf-gap-100">
    <button class="pdf-secondary-btn">Cancel</button>
    <button class="pdf-btn-primary">Confirm Delete</button>
  </div>
  
</div>`}
            </div>
          </details>
        </section>
      )}

      {/* 11. Navigation */}
      {activeChapter === 11 && (
        <section id="ch-11">
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-text-muted">
              탭, 브레드크럼 등 화면 내에서 현재 위치를 파악하고 다른 계층으로 안전하게 이동할 수 있도록 돕는 네비게이션 명세입니다.
            </p>
          </div>
          <div className="pdf-mb-300">
            <NavigationSandbox />
          </div>

          <details className="pdf-mt-200 pdf-cursor-pointer pdf-border-top" style={{ paddingTop: '16px' }}>
            <summary className="pdf-text-label-14-mono pdf-text-muted pdf-font-bold">[+] 네비게이션 구현 코드 보기</summary>
            <div className="pdf-code-block pdf-selectable pdf-mt-100" style={{ whiteSpace: 'pre-wrap' }}>
              {`<!-- 1. 사이드바 네비게이션 그룹 헤더 -->
<!-- 클릭하여 하위 메뉴를 접고 펼칠 수 있는 인터페이스용 -->
<div class="pdf-nav-group-header">
  <span>LAYOUT & GRID</span>
  <!-- 화살표 아이콘 (상태에 따라 .collapsed 클래스 토글) -->
  <svg class="pdf-chevron collapsed" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
</div>

<!-- 2. 네비게이션 메뉴 아이템 -->
<!-- .active 클래스 부여 시 좌측에 붉은 인디케이터가 활성화됨 -->
<div class="pdf-nav-item active">
  <div class="pdf-flex-row pdf-items-center pdf-gap-100">
    <span class="pdf-text-label-14-mono pdf-bg-secondary pdf-p-050" style="border-radius:2px;">01</span>
    <span class="pdf-text-label-16">PC Split Screen</span>
  </div>
</div>

<!-- 3. 비활성(Disabled) 아이템 -->
<div class="pdf-nav-item disabled">
  <span class="pdf-text-label-16">Mobile Screen (준비중)</span>
</div>`}
            </div>
          </details>
        </section>
      )}

      {/* 12. Split Screen */}
      {activeChapter === 12 && (
        <section id="ch-12">
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-text-muted">
              화면 분할 철학은 대칭 분리를 타파하고 비대칭 황금비에 준하는 25:75 비율의 스플릿 스크린을 기본 표준으로 채택한다.
            </p>
          </div>
          <div className="pdf-mb-300">
            <GoldenRatioSandbox />
          </div>
          <div className="pdf-mb-300">
            <SplitSandbox defaultMode="desktop" />
          </div>

          <details className="pdf-mt-200 pdf-cursor-pointer pdf-border-top" style={{ paddingTop: '16px' }}>
            <summary className="pdf-text-label-14-mono pdf-text-muted pdf-font-bold">[+] 스플릿 스크린 구현 코드 보기</summary>
            <div className="pdf-code-block pdf-selectable pdf-mt-100" style={{ whiteSpace: 'pre-wrap' }}>
              {`<!-- 25:75 비율의 황금비 스플릿 스크린 전체 구조 -->
<div class="pdf-app">
  
  <!-- 좌측 25% 사이드바 영역 -->
  <!-- 블러 효과와 그리드 패턴이 포함된 PDF-DS 특유의 사이드바 클래스 -->
  <aside class="pdf-sidebar" style="width: 25%;">
    <nav>네비게이션 메뉴</nav>
  </aside>
  
  <!-- 드래그 가능한 중앙 스플리터 막대 -->
  <div class="pdf-splitter"></div>
  
  <!-- 우측 75% 메인 콘텐츠 영역 -->
  <main class="pdf-main-view" style="width: 75%;">
    <!-- 실제 콘텐츠가 담기는 중앙 정렬된 컨테이너 -->
    <div class="pdf-main-content">
      <h1 class="pdf-text-heading-32">Main Title</h1>
      <p class="pdf-text-copy-14">Main content goes here.</p>
    </div>
  </main>

</div>`}
            </div>
          </details>
        </section>
      )}

      {/* 13. Mobile Screen */}
      {activeChapter === 13 && (
        <section id="ch-13">
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-text-muted">
              모바일 환경에서는 비대칭 가로 분할이 무력화되고 위아래 100% 수직 스택으로 재배치된다.
            </p>
          </div>
          <div className="pdf-mb-300">
            <MobileNavSandbox />
          </div>
          <div className="pdf-mb-300">
            <h3 className="pdf-text-label-16 pdf-mb-100">모바일 스택 및 반응형 레이아웃 복원 가이드라인</h3>
            <ul className="pdf-list-disc pdf-text-copy-14">
              <li><strong>수직 위계적 스택킹(Vertical Stacking):</strong> 뷰포트 크기가 수축함에 따라 두 면은 즉각적으로 수직 방향으로 정렬되어 위에서 아래로 스택킹된다.</li>
              <li><strong>콘텐츠 최소 크기 타겟:</strong> 스택 카드는 어떠한 경우에도 너비 또는 높이 기준 220dp 미만으로 축소되지 않도록 최소 공간 제한치를 확보한다.</li>
            </ul>
          </div>
          <div className="pdf-mb-300">
            <SplitSandbox defaultMode="mobile" />
          </div>
        </section>
      )}

      {/* 14. QA & Checklist */}
      {activeChapter === 14 && (
        <section id="ch-14">
          <div className="pdf-mb-300">
            <p className="pdf-text-copy-14 pdf-text-muted">
              이 디자인 가이드라인이 프로젝트 소스코드에서 정상적으로 완수되고 있는지 판단하기 위한 전방위 디자인 검수(QA) 기준 목록이다.
            </p>
          </div>
          <div className="pdf-mb-300">
            <ul className="pdf-list-disc pdf-text-copy-14">
              <li><strong>하드코딩 배제 검수:</strong> 모든 여백 및 내부 패딩 코드가 기하학적인 정수형 픽셀 단위로 선언되어 있지 않고, 반드시 $space- 계열의 토큰으로 대체되었는지 확인한다.</li>
              <li><strong>청사진 그리드 대비:</strong> 배경 격자선의 명도 투명도 수치가 10% - 20% 임계를 넘지 않는지 검측한다.</li>
              <li><strong>터치 영역 확보:</strong> 48x48dp 이상을 확보하여 모바일 터치 누락을 방지한다.</li>
              <li><strong>펑셔널 레드 위계 통제:</strong> 펑셔널 레드 색상이 적용된 컴포넌트가 과도하게 남발되지 않고 화면당 최대 3개 이하로 통제되고 있는지 체크한다.</li>
            </ul>
          </div>
          <div className="pdf-mb-300">
            <QASandbox />
          </div>
        </section>
      )}

      {/* 15. Credits */}
      {activeChapter === 15 && (
        <section id="ch-15">
          <div className="pdf-mb-400" style={{ textAlign: 'center', padding: 'var(--space-400) 0' }}>
            <span className="pdf-text-label-14-mono pdf-text-red pdf-mb-150" style={{ display: 'inline-block' }}>
              PDF-DS CO-CREATION LABS
            </span>
            <h2 className="pdf-text-heading-32 pdf-mb-200">
              System Creators & Inspirations
            </h2>
            <p className="pdf-text-copy-14 pdf-text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
              물리 하드웨어의 감각을 디지털 스크린으로 확장하는 여정을 함께한 기여자입니다.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>

            {/* User Card */}
            <div className="pdf-panel pdf-grid-bg pdf-relative" style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'var(--space-300)' }}>
              <div className="pdf-content-relative">
                <div className="pdf-flex-row pdf-justify-between pdf-items-start pdf-mb-200">
                  <span className="pdf-text-label-14-mono pdf-text-red" style={{ backgroundColor: 'var(--color-red-light)', padding: '4px 8px', borderRadius: '4px' }}>LEAD ARCHITECT</span>
                  <span className="pdf-text-label-14-mono pdf-text-muted">01</span>
                </div>
                <h3 className="pdf-text-heading-32 pdf-font-bold pdf-mb-100" style={{ fontSize: '24px' }}>Jaewon Lee</h3>
                <p className="pdf-text-copy-14 pdf-text-muted">
                  시스템 기획 및 검증 총괄.
                </p>
              </div>
              <div className="pdf-content-relative pdf-border-top pdf-pt-150 pdf-mt-200 pdf-flex-row pdf-justify-between pdf-items-center">
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
