import React, { useState } from 'react';
import { EditorProvider } from './store';
import PageSidebar from './components/PageSidebar';
import ComponentPalette from './components/ComponentPalette';
import CanvasArea from './components/CanvasArea';
import PropertyPanel from './components/PropertyPanel';
import PreviewViewer from './components/PreviewViewer';

function EditorLayout() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <div className="pdf-app" style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {isPreviewMode ? (
        <PreviewViewer onExit={() => setIsPreviewMode(false)} />
      ) : (
        <>
          <PageSidebar onPreview={() => setIsPreviewMode(true)} />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, borderRight: '1px solid var(--color-border-default)' }}>
            <ComponentPalette />
            <CanvasArea />
          </div>
          <PropertyPanel />
        </>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  );
}
