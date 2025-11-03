-import React, { useState, useRef, useCallback } from 'react';

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

const Loader = () => <div className="loader" />;

const App = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [extractedColor, setExtractedColor] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const imageRef = useRef(null);

    const componentToHex = (c) => c.toString(16).padStart(2, '0');
    const rgbToHex = (r, g, b) => `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;

    const processImage = useCallback(() => {
        if (!imageRef.current || !canvasRef.current) return;

        setIsLoading(true);
        setError(null);
        setExtractedColor(null);

        const image = imageRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
            setError('이미지를 처리할 수 없습니다. 다른 브라우저를 사용해 보세요.');
            setIsLoading(false);
            return;
        }

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

        const sampleSize = Math.min(30, image.naturalWidth, image.naturalHeight);
        const centerX = Math.floor(image.naturalWidth / 2 - sampleSize / 2);
        const centerY = Math.floor(image.naturalHeight / 2 - sampleSize / 2);

        try {
            const imageData = ctx.getImageData(centerX, centerY, sampleSize, sampleSize).data;
            let r = 0, g = 0, b = 0;

            for (let i = 0; i < imageData.length; i += 4) {
                r += imageData[i];
                g += imageData[i + 1];
                b += imageData[i + 2];
            }

            const pixelCount = imageData.length / 4;
            const avgR = Math.round(r / pixelCount);
            const avgG = Math.round(g / pixelCount);
            const avgB = Math.round(b / pixelCount);

            setExtractedColor({
                hex: rgbToHex(avgR, avgG, avgB),
                rgb: `rgb(${avgR}, ${avgG}, ${avgB})`,
            });
        } catch (e) {
            console.error(e);
            setError('이미지 색상을 추출하는 데 실패했습니다. 다른 이미지를 시도해 보세요.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            setExtractedColor(null);
            setError(null);
            setImageSrc(URL.createObjectURL(file));
        } else {
            setError('이미지 파일만 업로드할 수 있습니다.');
        }
    };
    
    const handleImageChange = (event) => {
        handleFile(event.target.files?.[0] || null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFile(e.dataTransfer.files?.[0] || null);
    };
    
    const handleDragEvents = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    };

    const resetState = () => {
        setImageSrc(null);
        setExtractedColor(null);
        setError(null);
        setIsLoading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };
    
    const UploadView = () => (
        <>
            <h1 className="title">이미지 색상 추출기</h1>
            <p className="subtitle">이미지를 업로드하여 중앙의 평균 색상 값을 알아보세요.</p>
            <div 
                className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragEvents}
                onDragEnter={handleDragEvents}
                onDragLeave={handleDragEvents}
            >
                <UploadIcon />
                <p>클릭 또는 파일을 드래그하여 업로드</p>
                <span>(카메라로 바로 촬영 가능)</span>
            </div>
            {error && <p className="error-message">{error}</p>}
        </>
    );

    const ResultView = () => (
        <>
             <div className="image-preview-container">
                <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Uploaded preview"
                    onLoad={processImage}
                    className="image-preview"
                />
                {isLoading && <div className="loader-overlay"><Loader/></div>}
            </div>
            {error && <p className="error-message">{error}</p>}
            {extractedColor && !isLoading && (
                <div className="result-container">
                    <div className="color-display">
                        <div className="color-swatch" style={{ backgroundColor: extractedColor.hex }} />
                        <div className="color-details">
                            <p><strong>HEX:</strong> {extractedColor.hex}</p>
                            <p><strong>RGB:</strong> {extractedColor.rgb}</p>
                        </div>
                    </div>
                    <button className="button" onClick={() => copyToClipboard(extractedColor.hex)}>
                        {isCopied ? '복사됨!' : 'HEX 코드 복사'}
                    </button>
                </div>
            )}
             <button className="button-secondary" onClick={resetState}>다른 이미지 분석</button>
        </>
    );

    return (
        <main className="container">
            <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
                aria-hidden="true"
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />
            
            {imageSrc ? <ResultView /> : <UploadView />}
        </main>
    );
};

export default App;