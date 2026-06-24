import React, { useState } from 'react';

export default function ModalSandbox() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pdf-bg-secondary pdf-border pdf-p-300">
      <h3 className="pdf-text-label-16 pdf-mb-200">Modals & Dialogs (모달 다이얼로그)</h3>
      <p className="pdf-text-copy-14 pdf-text-muted pdf-mb-300">
        모달은 사용자의 현재 작업 흐름을 강제로 차단하고, 중요한 결정을 요구할 때만 사용해야 합니다. 배경(Dimmer) 처리를 통해 백그라운드 요소와의 시각적 분리를 명확히 해야 합니다.
      </p>

      <div className="pdf-flex-col pdf-gap-200 pdf-items-start">
        <button 
          className="pdf-btn-primary" 
          onClick={() => setIsOpen(true)}
        >
          경고성 모달 시뮬레이션
        </button>

        <p className="pdf-text-copy-14 pdf-text-muted pdf-mt-100">
          - <strong>배경 딤(Dimmer):</strong> rgba(0, 0, 0, 0.4) 이상의 투명도를 적용하여 뒤쪽 맥락을 억제합니다.<br/>
          - <strong>모달 컨테이너:</strong> 최상위 Elevation인 그림자(Shadow)를 부여하여 화면 위로 확실히 떠오르게 합니다.<br/>
          - <strong>포커스 트랩(Focus Trap):</strong> 모달이 열리면 사용자의 키보드 이동(Tab)이 모달 내부로 갇혀야 합니다.<br/>
          - <strong>액션 버튼 위치:</strong> 가장 중요한 긍정/실행 버튼은 우측 하단에, 취소 버튼은 좌측 하단에 배치합니다.
        </p>
      </div>

      {/* Modal Overlay Simulation */}
      {isOpen && (
        <div 
          className="pdf-fixed pdf-inset-0 pdf-flex-row pdf-items-center pdf-justify-center"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999
          }}
        >
          {/* Modal Container */}
          <div 
            className="pdf-animate-fade-in pdf-radius-lg"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              padding: 'var(--space-400)',
              width: '90%',
              maxWidth: '400px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <h2 className="pdf-text-heading-32 pdf-mb-200">영구 삭제하시겠습니까?</h2>
            <p className="pdf-text-copy-14 pdf-text-muted pdf-mb-300">
              삭제된 프로젝트 데이터는 복구할 수 없습니다. 계속 진행하시겠습니까?
            </p>
            
            <div className="pdf-flex-row pdf-gap-200" style={{ justifyContent: 'flex-end' }}>
              <button 
                className="pdf-secondary-btn"
                onClick={() => setIsOpen(false)}
              >
                취소
              </button>
              <button 
                className="pdf-btn-primary"
                onClick={() => setIsOpen(false)}
              >
                데이터 삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
