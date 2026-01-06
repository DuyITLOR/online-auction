import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ImageItem = {
  url: string;
};

interface ImageSliderProps {
  images: ImageItem[];
  className?: string;
  currentIndex?: number;
  onChange?: (index: number) => void;
  autoplay?: boolean;
  interval?: number; // milliseconds
}

const ImageSlider = ({ images, className = '', currentIndex, onChange, autoplay = false, interval = 3000 }: ImageSliderProps) => {
  const [internalCurrent, setInternalCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  const total = images?.length ?? 0;

  const isControlled = typeof currentIndex === 'number';
  const current = isControlled ? (currentIndex as number) : internalCurrent;
  const setCurrent = (idx: number) => {
    if (isControlled) {
      onChange?.(idx);
    } else {
      setInternalCurrent(idx);
      onChange?.(idx);
    }
  };

  useEffect(() => {
    if (current < 0) setCurrent(0);
    if (current > total - 1) setCurrent(Math.max(0, total - 1));
  }, [current, total]);

  useEffect(() => {
    if (!autoplay || total <= 1) return;
    const id = setInterval(() => {
      setCurrent((current + 1) % total);
    }, Math.max(1000, interval));
    return () => clearInterval(id);
  }, [autoplay, interval, total, current]);

  const goPrev = () => setCurrent((idx) => (idx - 1 + total) % total);
  const goNext = () => setCurrent((idx) => (idx + 1) % total);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    const threshold = 40; // px
    const delta = touchDeltaX.current;
    touchStartX.current = null;
    touchDeltaX.current = 0;
    if (Math.abs(delta) < threshold) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  if (!images || images.length === 0) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 rounded-xl ${className}`}>
        <span className="text-gray-500 text-sm">Không có hình ảnh</span>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full select-none outline-none ${className}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      <div
        ref={trackRef}
        className="w-full h-full overflow-hidden rounded-xl"
      >
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((img, idx) => (
            <div className="min-w-full h-full flex items-center justify-center bg-gray-200" key={idx}>
              <img
                src={img.url}
                alt={`slide-${idx + 1}`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Ảnh trước"
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Ảnh kế tiếp"
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Chuyển đến ảnh ${idx + 1}`}
                onClick={() => setCurrent(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  current === idx ? 'w-6 bg-teal-600' : 'w-2.5 bg-white/80 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {total > 1 && (
        <div className="mt-2 flex items-center gap-2 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border ${
                current === idx ? 'border-teal-500' : 'border-gray-300'
              }`}
              aria-label={`Chọn ảnh ${idx + 1}`}
            >
              <img src={img.url} alt={`thumb-${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
