import React, { useState } from 'react';
import { Terminal, Copy, Check, ShieldCheck } from 'lucide-react';
import { CodePlatform } from '../types';

export default function CodeExport() {
  const [platform, setPlatform] = useState<CodePlatform>('web');
  const [copied, setCopied] = useState(false);

  const codeBlocks = {
    web: `/* PDF-DS Core Web-Token Stylesheet */
:root {
  --space-025: 2px;
  --space-050: 4px;
  --space-100: 8px;
  --space-150: 12px;
  --space-200: 16px;
  --space-300: 24px;
  --space-400: 32px;
  --space-600: 48px;
  --space-800: 64px;

  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f4f4f5;
  --color-border-default: #e4e4e7;
  --color-border-hover: #a1a1aa;
  --color-text-primary: #09090b;
  --color-text-secondary: #71717a;
  
  --color-functional-red: #ad1d1d;
  --color-red-hover: #c21f1f;
  --color-red-active: #941a1a;
  
  /* 초정밀 청사진 그리드 가설 */
  --blueprint-grid-pattern: linear-gradient(to right, rgba(229, 231, 235, 0.15) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(229, 231, 235, 0.15) 1px, transparent 1px);
}

/* 형태 모핑 컴포넌트 제어 */
.pdf-btn-primary {
  height: 40px;
  padding: 0 var(--space-150);
  background-color: var(--color-functional-red);
  color: var(--color-bg-primary);
  border: none;
  font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
  font-weight: 500;
  border-radius: 20px; /* 완전 둥근 상태 (높이 40px의 절반으로 설정하여 부드러운 형태 모핑 애니메이션 보장) */
  transition: border-radius 0.28s cubic-bezier(0.4, 0, 0.2, 1),
              background-color 0.2s ease;
}

.pdf-btn-primary:hover {
  background-color: var(--color-red-hover);
  border-radius: 12px; /* Soft Square 모핑 */
}

.pdf-btn-primary:active {
  background-color: var(--color-red-active);
  border-radius: 8px; /* Sharp Square 모핑 */
}`,
    android: `package com.pdf.designsystem.theme

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

// PDF-DS Kotlin Token Mapping
object PdfDsTokens {
    val Space100 = 8.dp
    val Space150 = 12.dp
    val Space200 = 16.dp
    
    val ColorFunctionalRed = Color(0xFFAD1D1D)
    val ColorRedHover = Color(0xFFC21F1F)
    val ColorRedActive = Color(0xFF941A1A)
    val ColorBgPrimary = Color(0xFFFFFFFF)
}

@Composable
fun PdfMorphingButton(
    onClick: () -> Unit,
    textLabel: String,
    modifier: Modifier = Modifier
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val isHovered by interactionSource.collectIsHoveredAsState()

    // 정교한 하드웨어 가압 피드백을 모사하기 위한 스프링 모핑 물리엔진 설정
    val animatedCornerRadius by animateDpAsState(
        targetValue = when {
            isPressed -> 8.dp   // Sharp Square
            isHovered -> 12.dp  // Soft Square
            else -> 20.dp      // Fully Rounded (Height 40.dp / 2)
        },
        animationSpec = spring(dampingRatio = 0.65f, stiffness = 400f)
    )

    val buttonColor = when {
        isPressed -> PdfDsTokens.ColorRedActive
        isHovered -> PdfDsTokens.ColorRedHover
        else -> PdfDsTokens.ColorFunctionalRed
    }

    Button(
        onClick = onClick,
        shape = RoundedCornerShape(animatedCornerRadius),
        colors = ButtonDefaults.buttonColors(
            containerColor = buttonColor,
            contentColor = PdfDsTokens.ColorBgPrimary
        ),
        interactionSource = interactionSource,
        modifier = modifier.height(40.dp)
    ) {
        Text(
            text = textLabel,
            style = TypographyScale.ButtonLabelStyle
        )
    }
}`,
    ios: `import SwiftUI

// PDF-DS iOS Swift Token Extensions
public struct PdfDsSpacing {
    public static let space100: CGFloat = 8
    public static let space150: CGFloat = 12
    public static let space200: CGFloat = 16
    public static let space300: CGFloat = 24
}

public struct PdfDsColors {
    public static let functionalRed = Color(red: 173/255, green: 29/255, blue: 29/255)
    public static let redHover = Color(red: 194/255, green: 31/255, blue: 31/255)
    public static let redActive = Color(red: 148/255, green: 26/255, blue: 26/255)
    public static let bgPrimary = Color.white
}

// SwiftUI Custom Morphing Style Modifier
public struct PdfMorphingButtonStyle: ButtonStyle {
    public func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.custom("Pretendard-Medium", size: 14))
            .frame(height: 40)
            .padding(.horizontal, PdfDsSpacing.space150)
            .background(
                configuration.isPressed ? PdfDsColors.redActive : PdfDsColors.functionalRed
            )
            .foregroundColor(PdfDsColors.bgPrimary)
            // SwiftUI 엔진의 스프링 보간을 통한 형태 모핑 물리 연산 구사
            .cornerRadius(configuration.isPressed ? 8 : 20) // Height 40 / 2
            .animation(.spring(response: 0.25, dampingFraction: 0.62), value: configuration.isPressed)
    }
}

// iOS 사용 모범 사례 단락
// .buttonStyle(PdfMorphingButtonStyle()) 모디파이어를 통해 전역 선언하여 
// 이형 디바이스 기하학적 형태를 즉시 펑셔널 레드로 무결 보정함.`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeBlocks[platform]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabChange = (plat: CodePlatform) => {
    setPlatform(plat);
  };

  return (
    <div className="pdf-panel">
      <div className="pdf-panel-header pdf-flex-row pdf-justify-between pdf-items-center">
        <div>
          <span className="pdf-text-label-14-mono pdf-text-red pdf-mb-100" style={{ display: 'block', fontWeight: 'bold' }}>
            CH.7 INTERACTIVE SANDBOX
          </span>
          <h4 className="pdf-text-label-16" style={{ fontWeight: 'bold' }}>
            크로스플랫폼 통합 토큰 및 코드 명세 보드 (JSON & Code Exporter)
          </h4>
        </div>
        <Terminal className="pdf-text-muted" style={{ width: 16, height: 16 }} />
      </div>

      <p className="pdf-text-copy-14 pdf-text-muted pdf-mb-300">
        이종 플랫폼(Web, Jetpack Compose, SwiftUI)에서 단 하나의 물리 디자인 규칙을 준수하여 가동되도록 작성된 <strong>피지컬 통합 컴파일 서식</strong>입니다. 탭을 변경하면 각각의 프레임워크 명세에 일체가 맞춰집니다.
      </p>

      {/* Code exporter platform selector tabs */}
      <div className="pdf-flex-row pdf-items-center pdf-justify-between pdf-gap-150 pdf-mb-200" style={{ flexWrap: 'wrap' }}>
        <div className="pdf-flex-row pdf-bg-secondary pdf-p-050 pdf-border" style={{ borderRadius: 8 }}>
          <button
            onClick={() => handleTabChange('web')}
            className="pdf-text-label-14-mono"
            style={{
              padding: '6px 16px', borderRadius: 4, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
              backgroundColor: platform === 'web' ? 'var(--color-bg-primary)' : 'transparent',
              color: platform === 'web' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontWeight: platform === 'web' ? '800' : 'normal',
              boxShadow: platform === 'web' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            Web (CSS Token)
          </button>
          <button
            onClick={() => handleTabChange('android')}
            className="pdf-text-label-14-mono"
            style={{
              padding: '6px 16px', borderRadius: 4, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
              backgroundColor: platform === 'android' ? 'var(--color-bg-primary)' : 'transparent',
              color: platform === 'android' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontWeight: platform === 'android' ? '800' : 'normal',
              boxShadow: platform === 'android' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            Android (Kotlin Compose)
          </button>
          <button
            onClick={() => handleTabChange('ios')}
            className="pdf-text-label-14-mono"
            style={{
              padding: '6px 16px', borderRadius: 4, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
              backgroundColor: platform === 'ios' ? 'var(--color-bg-primary)' : 'transparent',
              color: platform === 'ios' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontWeight: platform === 'ios' ? '800' : 'normal',
              boxShadow: platform === 'ios' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            iOS (SwiftUI Swift)
          </button>
        </div>

        {/* Copy trigger button */}
        <button
          onClick={handleCopy}
          className="pdf-text-label-14-mono pdf-flex-row pdf-items-center pdf-gap-050"
          style={{
            padding: '6px 14px', borderRadius: 4, cursor: 'pointer', border: 'none',
            backgroundColor: 'var(--color-text-primary)', color: 'var(--color-bg-primary)'
          }}
        >
          {copied ? (
            <>
              <Check style={{ width: 14, height: 14, color: '#4ade80' }} />
              복사 완료!
            </>
          ) : (
            <>
              <Copy style={{ width: 14, height: 14 }} />
              클립보드 복사
            </>
          )}
        </button>
      </div>

      {/* Editor view screen pane */}
      <div className="pdf-p-200 pdf-border" style={{ backgroundColor: '#09090b', color: 'var(--color-text-secondary)', borderRadius: 8, fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.6, position: 'relative', overflowX: 'auto', maxHeight: 340 }}>
        <div className="pdf-border" style={{ position: 'sticky', top: 0, right: 0, textAlign: 'right', backgroundColor: 'rgba(9, 9, 11, 0.8)', padding: '4px 8px', borderRadius: 4, display: 'inline-block', float: 'right', fontSize: 9, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
          {platform === 'web' ? 'CSS / Variables' : platform === 'android' ? 'KOTLIN / COMPOSE' : 'SWIFT / SWIFTUI'}
        </div>
        <pre className="pdf-selectable" style={{ whiteSpace: 'pre', margin: 0, paddingBottom: 16 }}>{codeBlocks[platform]}</pre>
      </div>

      <div className="pdf-flex-row pdf-items-center pdf-gap-100 pdf-mt-200" style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', borderStyle: 'solid', borderWidth: 1, padding: 12, borderRadius: 8, color: '#065f46' }}>
        <ShieldCheck style={{ width: 20, height: 20, color: '#047857', flexShrink: 0 }} />
        <span className="pdf-text-copy-14" style={{ fontSize: 11, fontWeight: 500 }}>
          ✓ 본 코드는 각 하드웨어 플랫폼의 그래픽 파이프라인(Web GPU/Skia/CoreGraphics) 및 인터랙션 상태 인디케이터 스펙에 부합하게 자동 변환된 피지컬 모핑 스펙입니다.
        </span>
      </div>
    </div>
  );
}
