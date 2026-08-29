import React from 'react';
import { useEditorStore } from '../store';
import { Blocks } from '../blocks';

export default function ComponentPalette() {
  const { addNode, selectedNodeId, setSelectedNodeId, undo, redo, canUndo, canRedo } = useEditorStore();

  const handleAdd = (generator: () => any) => {
    addNode(generator(), selectedNodeId || undefined);
  };

  return (
    <div className="pdf-p-200 pdf-border-bottom pdf-bg-secondary" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <span className="pdf-text-label-14-mono pdf-text-muted pdf-mr-100">기본 요소 (태그):</span>
      <button className="pdf-secondary-btn pdf-btn-sm" title="빈 컨테이너 박스 (div)" onClick={() => handleAdd(Blocks.Div)}>박스 (Div)</button>
      <button className="pdf-secondary-btn pdf-btn-sm" title="일반 텍스트 단락 (p)" onClick={() => handleAdd(Blocks.Text)}>텍스트</button>
      <button className="pdf-secondary-btn pdf-btn-sm" title="큰 제목 (h2)" onClick={() => handleAdd(Blocks.Heading)}>제목</button>
      <button className="pdf-secondary-btn pdf-btn-sm" title="이미지 요소 (img)" onClick={() => handleAdd(Blocks.Image)}>이미지</button>
      <button className="pdf-secondary-btn pdf-btn-sm" title="클릭 가능한 버튼 (button)" onClick={() => handleAdd(Blocks.Button)}>버튼</button>
      <button className="pdf-secondary-btn pdf-btn-sm" title="하이퍼링크 (a)" onClick={() => handleAdd(Blocks.Link)}>링크</button>

      <span className="pdf-text-label-14-mono pdf-text-muted pdf-mx-100">| 가이드라인 블록:</span>
      <button className="pdf-secondary-btn pdf-btn-sm" title="배경색과 여백이 있는 컨테이너 패널" onClick={() => handleAdd(Blocks.Panel)}>패널</button>
      <button className="pdf-secondary-btn pdf-btn-sm" title="25:75 비율의 좌우 분할 레이아웃" onClick={() => handleAdd(Blocks.SplitLayout)}>분할 레이아웃</button>
      <button className="pdf-secondary-btn pdf-btn-sm" title="가장 상단에 들어가는 히어로 섹션" onClick={() => handleAdd(Blocks.HeroSection)}>히어로 섹션</button>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          className="pdf-secondary-btn pdf-btn-sm"
          title="실행 취소 (Ctrl+Z)"
          onClick={undo}
          disabled={!canUndo}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: canUndo ? 1 : 0.4 }}
        >
          <span style={{ fontSize: '14px' }}>↩</span> 실행 취소
        </button>
        <button
          className="pdf-secondary-btn pdf-btn-sm"
          title="다시 실행 (Ctrl+Y / Ctrl+Shift+Z)"
          onClick={redo}
          disabled={!canRedo}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: canRedo ? 1 : 0.4 }}
        >
          다시 실행 <span style={{ fontSize: '14px' }}>↪</span>
        </button>
        {selectedNodeId && (
          <button 
            className="pdf-btn-primary pdf-btn-sm" 
            title="현재 선택된 요소 안에 넣지 않고 바깥으로 뺍니다"
            onClick={() => setSelectedNodeId(null)} 
          >
            선택 해제 (최상위에 추가)
          </button>
        )}
      </div>
    </div>
  );
}
