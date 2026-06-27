import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiCheck, FiRotateCw, FiZoomIn } from 'react-icons/fi';

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef(null);
  const imgRef = useRef(null);

  // Reset when image changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  }, [imageSrc]);

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageSize({ width: naturalWidth, height: naturalHeight });
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleCrop = () => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    // We target a standard 4:5 fashion product image aspect ratio
    const targetWidth = 600;
    const targetHeight = 750;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill background with white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Get current container bounds to scale correctly
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const cropWidth = containerRect.width;
    const cropHeight = containerRect.height;

    ctx.save();
    // Move to canvas center to apply rotation and translation
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Calculate source and draw size relative to crop preview box
    const ratioX = targetWidth / cropWidth;
    const ratioY = targetHeight / cropHeight;

    // Render scaled and offset image onto target high-quality canvas
    const drawWidth = img.width * zoom * ratioX;
    const drawHeight = img.height * zoom * ratioY;
    const drawX = offset.x * ratioX;
    const drawY = offset.y * ratioY;

    ctx.drawImage(
      img,
      drawX - drawWidth / 2,
      drawY - drawHeight / 2,
      drawWidth,
      drawHeight
    );
    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `cropped-${Date.now()}.webp`, {
            type: 'image/webp',
          });
          onCropComplete(file);
        }
      },
      'image/webp',
      0.95
    );
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-purple-950/95 p-4 sm:p-6 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-lg border border-purple-100 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-purple-50 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-display font-extrabold text-purple-950 text-base">Crop Product Photo</h3>
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wide mt-0.5">Drag to adjust, slide to zoom</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-purple-400 hover:text-purple-900 border border-purple-100 rounded-xl hover:bg-purple-50 transition-colors"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Cropper Viewport */}
        <div className="relative flex-grow flex items-center justify-center p-6 bg-purple-50/20 overflow-hidden">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative w-64 aspect-[4/5] bg-purple-950 rounded-2xl overflow-hidden border border-purple-100/70 shadow-inner select-none cursor-grab active:cursor-grabbing"
          >
            {/* Draggable scaled image */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Source preview"
              onLoad={handleImageLoad}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              }}
              className="absolute max-w-none max-h-none pointer-events-none object-contain"
            />
            
            {/* Helper grid border overlay */}
            <div className="absolute inset-0 border-2 border-white/80 pointer-events-none rounded-2xl flex flex-col justify-between p-4">
              <div className="flex justify-between w-full opacity-35">
                <div className="border-t border-l border-white w-4 h-4" />
                <div className="border-t border-r border-white w-4 h-4" />
              </div>
              <div className="flex justify-between w-full opacity-35">
                <div className="border-b border-l border-white w-4 h-4" />
                <div className="border-b border-r border-white w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-purple-50 space-y-4 bg-white shrink-0">
          
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <FiZoomIn size={16} className="text-purple-400" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-grow accent-primary cursor-pointer h-1.5 bg-purple-50 rounded-lg appearance-none"
            />
            <span className="text-xs text-purple-950 font-bold w-10 text-right">{Math.round(zoom * 100)}%</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={rotateImage}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-purple-100 hover:border-purple-300 text-purple-950 text-xs font-bold rounded-xl transition-all w-1/3"
            >
              <FiRotateCw />
              <span>Rotate</span>
            </button>

            <button
              onClick={handleCrop}
              className="flex-grow flex items-center justify-center gap-1.5 py-2.5 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              <FiCheck />
              <span>Crop & Save Photo</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
