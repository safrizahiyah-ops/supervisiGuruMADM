import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Trash2, Check, X, Upload, RotateCcw } from 'lucide-react';

interface SignaturePadModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
  existingSignature?: string;
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  title,
  onClose,
  onSave,
  existingSignature,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#0f172a');
  const [lineWidth, setLineWidth] = useState(2.5);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If there is an existing signature, draw it
    if (existingSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setHasContent(true);
      };
      img.src = existingSignature;
    } else {
      setHasContent(false);
    }
  }, [isOpen, existingSignature]);

  if (!isOpen) return null;

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setIsDrawing(true);
    setHasContent(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // preserve aspect ratio
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        setHasContent(true);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
              <p className="text-xs text-slate-500">Tanda tangani langsung dengan sentuhan/mouse atau upload file</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="my-4">
          <div className="relative rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-2 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={460}
              height={180}
              className="w-full h-44 cursor-crosshair touch-none bg-white rounded-lg shadow-inner"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {!hasContent && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 text-sm font-medium">
                Goreskan tanda tangan di sini
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Tebal Goresan:</span>
            <input
              type="range"
              min="1.5"
              max="5"
              step="0.5"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseFloat(e.target.value))}
              className="w-20 accent-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700">
              <Upload className="w-3.5 h-3.5" />
              Upload Gambar
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={clearCanvas}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Hapus
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-sm"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasContent}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium text-sm text-white shadow-md ${
              hasContent
                ? 'bg-emerald-700 hover:bg-emerald-800'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            Simpan Tanda Tangan
          </button>
        </div>
      </div>
    </div>
  );
};
