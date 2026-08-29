# PDF-DS

**Physical-Digital Fusion Design System**

[![Release](https://img.shields.io/github/v/release/qpi-labels/PDF-DS?label=Latest%20Release&style=flat-square)](https://github.com/qpi-labels/PDF-DS/releases/latest)
[![CSS](https://img.shields.io/badge/Pure%20CSS-No%20Build%20Tools-blue?style=flat-square)]()
[![Runtime](https://img.shields.io/badge/JS%20Runtime-Not%20Required-lightgrey?style=flat-square)]()

> PDF-DS는 물리적 제품의 촉각적 피드백(tactile feedback)과 디지털 인터페이스의 구조적 미니멀리즘을 단일 CSS 디자인 언어로 통합한 유틸리티-퍼스트 디자인 시스템이다. `<link>` 태그 하나로 어떠한 프레임워크, 어떠한 환경에서든 즉시 적용된다.

<a href="http://pdf-ds.qpi.digital">Interactive Sandbox &rarr;</a>

---

## Download 안내

> **주의**: `git clone`으로 본 리포지토리를 복제하면 원격 origin이 자동으로 연결되어 로컬 환경이 의도치 않게 source control에 편입된다. 순수 파일만 필요한 경우 ZIP 아카이브를 사용할 것을 권장한다.
>
> **[Releases 페이지에서 ZIP 다운로드](https://github.com/qpi-labels/PDF-DS/releases/latest)**

---

## Quick Start

PDF-DS를 사용하기 위해 필요한 것은 `<link>` 태그 하나뿐이다. 빌드 도구, JavaScript 런타임, 패키지 매니저 모두 불필요하다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PDF-DS Quick Start</title>
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/qpi-labels/PDF-DS@main/src/index.css">
</head>
<body>
  <div style="max-width: 400px; margin: 64px auto;">
    <div class="pdf-panel">
      <div class="pdf-panel-header">
        <h3 class="pdf-text-label-16">System Status</h3>
      </div>
      <p class="pdf-text-copy-14 pdf-text-muted pdf-mb-200">
        모든 서브시스템이 정상 작동 중이다.
      </p>
      <div class="pdf-flex-row pdf-gap-100">
        <button class="pdf-btn-primary pdf-btn-sm">Confirm</button>
        <button class="pdf-secondary-btn pdf-btn-sm">Cancel</button>
      </div>
    </div>
  </div>
</body>
</html>
```

위 파일을 `.html`로 저장하고 브라우저에서 열면, 하드웨어 베벨 그림자가 적용된 패널과 버튼이 즉시 렌더링된다.

---

## Installation

### Method 1 -- CDN (권장)

외부 의존성 없이 전체 디자인 시스템을 로드한다.

```html
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/qpi-labels/PDF-DS@main/src/index.css">
```

### Method 2 -- Local Import

CSS 파일을 프로젝트에 직접 포함한다. 디자인 토큰의 커스터마이징이 필요한 경우에 적합하다.

```javascript
// 진입점 파일 (main.tsx, App.vue, main.js 등)
import './styles/pdf-ds.css';
```

### Method 3 -- Development Server

샌드박스 환경을 로컬에서 실행한다.

```bash
npm install
npm run dev        # http://localhost:3000
```

---

## Utility Reference

PDF-DS의 모든 클래스는 `pdf-` 접두사 네임스페이스를 사용한다. 아래는 카테고리별 유틸리티 클래스 목록이다.

### Display

| Class | CSS Property | Value |
|---|---|---|
| `pdf-flex-row` | `display; flex-direction` | `flex; row` |
| `pdf-flex-col` | `display; flex-direction` | `flex; column` |

### Flexbox

| Class | CSS Property | Value |
|---|---|---|
| `pdf-items-center` | `align-items` | `center` |
| `pdf-items-start` | `align-items` | `flex-start` |
| `pdf-justify-between` | `justify-content` | `space-between` |
| `pdf-justify-center` | `justify-content` | `center` |
| `pdf-flex-wrap` | `flex-wrap` | `wrap` |
| `pdf-flex-shrink-0` | `flex-shrink` | `0` |

### Gap

사용 가능한 토큰: `050`, `100`, `150`, `200`, `300`

| Pattern | CSS Property | Example |
|---|---|---|
| `pdf-gap-{token}` | `gap` | `pdf-gap-200` &rarr; `gap: 16px` |

### Spacing -- Margin

| Pattern | CSS Property | 사용 가능한 토큰 |
|---|---|---|
| `pdf-mt-{token}` | `margin-top` | `100`, `200`, `300`, `400` |
| `pdf-mb-{token}` | `margin-bottom` | `100`, `150`, `200`, `300`, `400` |

### Spacing -- Padding

| Pattern | CSS Property | 사용 가능한 토큰 |
|---|---|---|
| `pdf-p-{token}` | `padding` | `050`, `100`, `150`, `200`, `300` |
| `pdf-px-{token}` | `padding-left; padding-right` | `200` |
| `pdf-py-{token}` | `padding-top; padding-bottom` | `200` |

토큰 값의 매핑은 아래 [Token System](#token-system) 섹션을 참조한다.

### Sizing

| Class | CSS Property | Value |
|---|---|---|
| `pdf-w-full` | `width` | `100%` |
| `pdf-h-full` | `height` | `100%` |

### Typography

#### 프리셋 스케일

| Class | Font Size | Line Height | Weight |
|---|---|---|---|
| `pdf-text-heading-72` | 72px | 1.1 | 800 |
| `pdf-text-heading-32` | 32px | 1.25 | 700 |
| `pdf-text-heading-24` | 24px | 1.3 | 700 |
| `pdf-text-label-16` | 16px | 1.0 | 600 |
| `pdf-text-copy-14` | 14px | 1.5 | inherit |
| `pdf-text-label-14-mono` | 14px (mono) | 1.0 | inherit |
| `pdf-text-copy-13-mono` | 13px (mono) | 1.4 | inherit |

#### 수식자(Modifier)

| Class | CSS Property | Value |
|---|---|---|
| `pdf-font-bold` | `font-weight` | `bold` |
| `pdf-font-mono` | `font-family` | JetBrains Mono |
| `pdf-text-center` | `text-align` | `center` |
| `pdf-text-right` | `text-align` | `right` |

### Colors

| Class | CSS Property | Value |
|---|---|---|
| `pdf-text-red` | `color` | `#ad1d1d` (functional red) |
| `pdf-text-muted` | `color` | secondary text color |
| `pdf-bg-secondary` | `background-color` | secondary background |
| `pdf-bg-red` | `background-color` | `#ad1d1d` (functional red) |

텍스트와 배경의 기본색(`primary`)은 `:root` 토큰에 의해 자동 적용되므로 별도 클래스가 불필요하다.

### Borders

| Class | CSS Property | Value |
|---|---|---|
| `pdf-border` | `border` | `1px solid` (default border color) |
| `pdf-border-bottom` | `border-bottom` | `1px solid` |
| `pdf-border-top` | `border-top` | `1px solid` |
| `pdf-border-left` | `border-left` | `1px solid` |

### Border Radius

| Class | CSS Property | Value |
|---|---|---|
| `pdf-radius-sm` | `border-radius` | `4px` |
| `pdf-radius-md` | `border-radius` | `8px` |
| `pdf-radius-lg` | `border-radius` | `16px` |
| `pdf-radius-full` | `border-radius` | `50%` |

### Shadows

| Class | Description |
|---|---|
| `pdf-shadow-bevel` | 하드웨어 베벨: 상단 하이라이트 + 하단 암부. 볼록한 기본 상태 |
| `pdf-shadow-bevel-active` | 광원 방향 반전. 눌린 오목한 상태 |
| `pdf-shadow-glow` | Red 기능색의 확산 광(diffuse glow). 주요 액션 강조 |
| `pdf-shadow-glow-active` | 축소된 광원 반경. 액션 활성화 상태 |

### Position

| Class | CSS Property | Value |
|---|---|---|
| `pdf-relative` | `position` | `relative` |
| `pdf-absolute` | `position` | `absolute` |
| `pdf-fixed` | `position` | `fixed` |
| `pdf-inset-0` | `top; right; bottom; left` | `0` |
| `pdf-inset-center` | `top; left; transform` | `50%; 50%; translate(-50%, -50%)` |

### Overflow

| Class | CSS Property | Value |
|---|---|---|
| `pdf-overflow-hidden` | `overflow` | `hidden` |

### Interaction

| Class | CSS Property | Value |
|---|---|---|
| `pdf-cursor-pointer` | `cursor` | `pointer` |
| `pdf-pointer-events-none` | `pointer-events` | `none` |
| `pdf-selectable` | `user-select` | `text` (기본값 `none` 해제) |

### Animations

| Class | Effect | Duration |
|---|---|---|
| `pdf-animate-pulse` | 불투명도 순환(1 &rarr; 0.5 &rarr; 1) | 2s, infinite |
| `pdf-animate-fade-in` | 아래에서 위로 페이드 인 (5px 이동) | 0.32s, forwards |

### Lists

| Class | Description |
|---|---|
| `pdf-list-disc` | `disc` 스타일 목록. 좌측 패딩 및 항목 간 간격 자동 적용 |

---

## Components

PDF-DS는 유틸리티 클래스 외에 즉시 사용 가능한 프리빌트 컴포넌트를 제공한다.

### Button

```html
<button class="pdf-btn-primary pdf-btn-md">Primary Action</button>
<button class="pdf-secondary-btn">Secondary Action</button>
```

크기 수식자: `pdf-btn-xs` (32px), `pdf-btn-sm` (40px), `pdf-btn-md` (44px), `pdf-btn-lg` (48px), `pdf-btn-xl` (56px)

Primary 버튼은 호버 시 `border-radius`가 캡슐에서 라운드 사각형으로 변형(shape-morphing)되어 물리적 버튼의 조작감을 재현한다.

### Panel

```html
<div class="pdf-panel">
  <div class="pdf-panel-header">
    <h3 class="pdf-text-label-16">Section Title</h3>
  </div>
  <p class="pdf-text-copy-14 pdf-text-muted">Content area.</p>
</div>
```

### Input

```html
<input type="text" class="pdf-input pdf-input-md" placeholder="Enter value" />
```

크기 수식자: `pdf-input-xs`, `pdf-input-sm`, `pdf-input-md`, `pdf-input-lg`, `pdf-input-xl`

### Navigation

```html
<div class="pdf-nav-group-header">Category</div>
<div class="pdf-nav-item active">Active Item</div>
<div class="pdf-nav-item">Default Item</div>
<div class="pdf-nav-item disabled">Disabled Item</div>
```

### Badge

```html
<span class="pdf-badge">v1.0</span>
```

### Layout -- App Shell

사이드바-메인 뷰 이중 구조를 기본 레이아웃 패턴으로 제공한다. 1200px 이하에서 사이드바는 하단 시트로 전환된다.

```html
<div class="pdf-app">
  <aside class="pdf-sidebar">
    <nav>
      <div class="pdf-nav-item active">Dashboard</div>
      <div class="pdf-nav-item">Settings</div>
    </nav>
  </aside>
  <main class="pdf-main-view">
    <div class="pdf-main-content">
      <!-- Content -->
    </div>
  </main>
</div>
```

### Other Components

| Class | Description |
|---|---|
| `pdf-table` | 기본 테이블 스타일 (`th` 배경색, 보더, 패딩 자동 적용) |
| `pdf-code-block` | 인라인 코드 블록 (모노스페이스 폰트, 배경색) |
| `pdf-footer` | 상단 보더 + 좌우 정렬 푸터 |
| `pdf-splitter` | 리사이즈 가능한 수직 분할선 (1200px 이상에서만 표시) |
| `pdf-indicator-dot` | 6px 원형 적색 표시자 |
| `pdf-grid-bg` | Blueprint 그리드 배경 패턴 (pseudo-element) |

---

## Responsive Design

PDF-DS의 레이아웃 시스템은 다음 분기점(breakpoint)을 기준으로 반응형 전환을 처리한다.

| Breakpoint | Condition | Behavior |
|---|---|---|
| Desktop | `min-width: 1200px` | 사이드바-메인 뷰 수평 배치, 좌측 25% / 우측 75% |
| Mobile | `max-width: 1199px` | 사이드바 숨김, 하단 시트 전환. 메인 뷰 전폭 |

App Shell(`pdf-app`)을 사용하면 반응형 처리가 자동으로 적용된다. 모바일 환경에서 사이드바를 표시하려면 `pdf-sidebar` 요소에 `mobile-nav-open` 클래스를 추가한다.

```html
<!-- JavaScript에서 토글 -->
<aside class="pdf-sidebar mobile-nav-open">
  <!-- 모바일에서 하단 시트로 슬라이드 업 -->
</aside>
```

---

## Theming

PDF-DS는 Light/Dark 이중 테마를 지원한다. 최상위 컨테이너 또는 `<body>`에 `data-theme` 속성을 선언하여 전환한다.

```html
<!-- Light Mode (기본값) -->
<body>
  <div class="pdf-app">...</div>
</body>

<!-- Dark Mode -->
<body data-theme="dark">
  <div class="pdf-app">...</div>
</body>
```

모든 디자인 토큰이 `:root`와 `[data-theme='dark']` 선택자에 이중 선언되어 있으므로, 테마 전환 시 컴포넌트 수준의 코드 변경은 불필요하다. JavaScript에서 `document.body.dataset.theme`을 토글하는 것만으로 런타임 전환이 가능하다.

```javascript
// 다크 모드 토글
function toggleTheme() {
  const body = document.body;
  body.dataset.theme = body.dataset.theme === 'dark' ? '' : 'dark';
}
```

---

## Token System

모든 시각적 속성은 CSS Custom Properties로 선언되며, 테마 전환 시 변수 값만 교체된다.

### Spacing Tokens

| Token | CSS Variable | Value | Usage |
|---|---|---|---|
| `025` | `--space-025` | 2px | 미세 간격, 아이콘 내부 패딩 |
| `050` | `--space-050` | 4px | 인접 요소 간 최소 간격 |
| `100` | `--space-100` | 8px | 기본 단위 |
| `150` | `--space-150` | 12px | 중간 간격 |
| `200` | `--space-200` | 16px | 컴포넌트 내부 패딩 |
| `300` | `--space-300` | 24px | 섹션 간 간격 |
| `400` | `--space-400` | 32px | 카드/패널 내부 여백 |
| `600` | `--space-600` | 48px | 페이지 레벨 섹션 구분 |
| `800` | `--space-800` | 64px | 최상위 레이아웃 마진 |

### Color Tokens

| Token | Light Mode | Dark Mode |
|---|---|---|
| `--color-bg-primary` | `#ffffff` | `#09090b` |
| `--color-bg-secondary` | `#f4f4f5` | `#18181b` |
| `--color-border-default` | `#e4e4e7` | `#27272a` |
| `--color-border-hover` | `#a1a1aa` | `#52525b` |
| `--color-text-primary` | `#09090b` | `#ffffff` |
| `--color-text-secondary` | `#71717a` | `#a1a1aa` |
| `--color-functional-red` | `#ad1d1d` | `#ad1d1d` |
| `--color-red-hover` | `#c21f1f` | `#c21f1f` |
| `--color-red-active` | `#941a1a` | `#941a1a` |
| `--color-red-light` | `#fef2f2` | `#2c0b0b` |

### Elevation Tokens

| Token | Description |
|---|---|
| `--shadow-hardware-bevel` | 볼록한 버튼의 기본 상태. 상단 하이라이트 + 하단 암부 |
| `--shadow-hardware-bevel-active` | 눌린 오목한 상태. 광원 방향 반전 |
| `--shadow-functional-glow` | Red 기능색의 확산 광. 주요 액션 강조 |
| `--shadow-functional-glow-active` | 축소된 광원 반경. 액션 활성화 상태 |

### Typography Tokens

| Token | Font Stack |
|---|---|
| `--font-sans` | Pretendard Variable &rarr; Geist Sans &rarr; system |
| `--font-mono` | JetBrains Mono |

커스터마이징이 필요한 경우, 프로젝트의 CSS에서 `:root` 블록 내의 변수를 재선언하여 시스템 전체의 시각적 속성을 일괄 변경할 수 있다.

```css
:root {
  /* 기본 단위를 6px로 변경 */
  --space-100: 6px;
  /* 기능색을 Blue로 교체 */
  --color-functional-red: #1d4ead;
}
```

---

## Complete Example

아래는 PDF-DS CDN만으로 구성된 독립 실행 가능한 완전한 HTML 파일이다. 대시보드 카드 레이아웃을 구현하며, 하드웨어 베벨 그림자, 타이포그래피 스케일, 유틸리티 클래스의 조합을 시연한다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PDF-DS Dashboard Example</title>
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/qpi-labels/PDF-DS@main/src/index.css">
  <style>
    .demo-container {
      max-width: 960px;
      margin: 0 auto;
      padding: var(--space-400) var(--space-300);
    }
    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-300);
    }
    .demo-stat {
      font-size: 36px;
      font-weight: 800;
      font-family: var(--font-sans);
      letter-spacing: -0.02em;
    }
    .demo-header {
      border-bottom: 1px solid var(--color-border-default);
      padding-bottom: var(--space-300);
      margin-bottom: var(--space-400);
    }
  </style>
</head>
<body data-theme="dark">

  <div class="demo-container">

    <!-- Header -->
    <div class="demo-header">
      <div class="pdf-flex-row pdf-items-center pdf-justify-between">
        <div>
          <h1 class="pdf-text-heading-32 pdf-mb-100">Operations Dashboard</h1>
          <p class="pdf-text-copy-14 pdf-text-muted">
            실시간 시스템 모니터링 및 성능 지표 개요
          </p>
        </div>
        <div class="pdf-flex-row pdf-gap-100">
          <button class="pdf-secondary-btn pdf-btn-sm">Export</button>
          <button class="pdf-btn-primary pdf-btn-sm">New Report</button>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="demo-grid pdf-mb-400">

      <div class="pdf-panel">
        <p class="pdf-text-copy-14 pdf-text-muted pdf-mb-100">Total Requests</p>
        <p class="demo-stat">1,284,903</p>
        <p class="pdf-text-copy-14 pdf-text-red pdf-mt-100">
          +12.5% from last period
        </p>
      </div>

      <div class="pdf-panel">
        <p class="pdf-text-copy-14 pdf-text-muted pdf-mb-100">Avg. Response</p>
        <p class="demo-stat">42<span class="pdf-text-muted" style="font-size: 18px;">ms</span></p>
        <p class="pdf-text-copy-14 pdf-text-muted pdf-mt-100">
          Within target threshold
        </p>
      </div>

      <div class="pdf-panel">
        <p class="pdf-text-copy-14 pdf-text-muted pdf-mb-100">Error Rate</p>
        <p class="demo-stat">0.03<span class="pdf-text-muted" style="font-size: 18px;">%</span></p>
        <div class="pdf-flex-row pdf-items-center pdf-gap-100 pdf-mt-100">
          <span class="pdf-indicator-dot"></span>
          <span class="pdf-text-copy-14 pdf-text-muted">Nominal</span>
        </div>
      </div>

    </div>

    <!-- Detail Panel -->
    <div class="pdf-panel">
      <div class="pdf-panel-header pdf-flex-row pdf-items-center pdf-justify-between">
        <h3 class="pdf-text-label-16">Recent Events</h3>
        <span class="pdf-badge">LIVE</span>
      </div>
      <div class="pdf-flex-col pdf-gap-150">
        <div class="pdf-flex-row pdf-items-center pdf-justify-between pdf-py-200 pdf-border-bottom">
          <div>
            <p class="pdf-text-copy-14 pdf-font-bold">Deployment Completed</p>
            <p class="pdf-text-copy-13-mono pdf-text-muted">service-api v2.4.1</p>
          </div>
          <span class="pdf-text-copy-13-mono pdf-text-muted">14:32:08</span>
        </div>
        <div class="pdf-flex-row pdf-items-center pdf-justify-between pdf-py-200 pdf-border-bottom">
          <div>
            <p class="pdf-text-copy-14 pdf-font-bold">Certificate Renewed</p>
            <p class="pdf-text-copy-13-mono pdf-text-muted">*.qpi.digital</p>
          </div>
          <span class="pdf-text-copy-13-mono pdf-text-muted">13:15:44</span>
        </div>
        <div class="pdf-flex-row pdf-items-center pdf-justify-between pdf-py-200">
          <div>
            <p class="pdf-text-copy-14 pdf-font-bold">Scaling Event</p>
            <p class="pdf-text-copy-13-mono pdf-text-muted">worker-pool: 4 → 8 instances</p>
          </div>
          <span class="pdf-text-copy-13-mono pdf-text-muted">12:01:22</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="pdf-footer">
      <span class="pdf-text-copy-14 pdf-text-muted">PDF-DS Dashboard Example</span>
      <span class="pdf-text-copy-13-mono pdf-text-muted">Built with PDF-DS</span>
    </div>

  </div>

</body>
</html>
```

위 파일을 `dashboard.html`로 저장하고 브라우저에서 열면, 빌드 도구 없이 완성된 대시보드 레이아웃을 확인할 수 있다.

---

<sub>PDF-DS is maintained by <a href="https://github.com/qpi-labels">qpi-labels</a>.</sub>
