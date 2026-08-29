import { EditorElement } from '../pages/Editor';

const getCombinedClasses = (node: EditorElement, baseClass: string) => {
  const s = node.styles || {};
  const classes = [baseClass];
  if (s.typography) classes.push(s.typography);
  if (s.margin) classes.push(s.margin);
  if (s.padding) classes.push(s.padding);
  if (s.align) classes.push(s.align);
  if (node.className) classes.push(node.className);
  return classes.filter(Boolean).join(' ');
};

const renderHtml = (nodes: EditorElement[], indent = '      '): string => {
  return nodes.map(node => {
    switch (node.type) {
      case 'panel':
        return `${indent}<div class="${getCombinedClasses(node, 'pdf-panel')}">\n${renderHtml(node.children, indent + '  ')}\n${indent}</div>`;
      case 'split-layout':
        return `${indent}<div class="${getCombinedClasses(node, 'pdf-flex-row')}">\n${renderHtml(node.children, indent + '  ')}\n${indent}</div>`;
      case 'split-left':
        return `${indent}<div class="${getCombinedClasses(node, '')}" style="width: 38%;">\n${renderHtml(node.children, indent + '  ')}\n${indent}</div>`;
      case 'split-right':
        return `${indent}<div class="${getCombinedClasses(node, '')}" style="width: 62%;">\n${renderHtml(node.children, indent + '  ')}\n${indent}</div>`;
      case 'heading':
        return `${indent}<h2 class="${getCombinedClasses(node, 'pdf-text-heading-32')}">${node.content}</h2>`;
      case 'paragraph':
        return `${indent}<p class="${getCombinedClasses(node, 'pdf-text-copy-14')}">${node.content}</p>`;
      case 'primary-btn':
        return `${indent}<button class="${getCombinedClasses(node, 'pdf-btn-primary')}">${node.content}</button>`;
      case 'secondary-btn':
        return `${indent}<button class="${getCombinedClasses(node, 'pdf-secondary-btn')}">${node.content}</button>`;
      default:
        return '';
    }
  }).join('\n');
};

export const exportToZip = async (elements: EditorElement[]) => {
  try {
    const JSZipModule = await import('https://esm.sh/jszip@3.10.1');
    const FileSaverModule = await import('https://esm.sh/file-saver@2.0.5');
    
    const JSZip = JSZipModule.default;
    const saveAs = FileSaverModule.default.saveAs || FileSaverModule.saveAs || FileSaverModule.default;

    const zip = new JSZip();

    const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PDF-DS Exported Page</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/antigravity/PDF-DS@main/src/index.css" />
</head>
<body>
  <div class="pdf-app">
    <main class="pdf-main-view" style="width: 100%; height: 100vh;">
${renderHtml(elements)}
    </main>
  </div>
</body>
</html>`;

    zip.file("index.html", htmlContent);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "pdf-ds-project.zip");

  } catch (error) {
    console.error("Failed to export ZIP:", error);
    alert("ZIP 변환 중 오류가 발생했습니다. 라이브러리 로드를 확인해주세요.");
  }
};
