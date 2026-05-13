/*** VoicePlayer - plays mp3 alerts from /api/voice path ***/
import { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import cx from '../../lib/classnames';

interface VoicePlayerProps {
  mindset: string;
  category: string;
  index: number;
  title?: string;
  className?: string;
}

export default function VoicePlayer({
  mindset,
  category,
  index,
  title,
  className,
}: VoicePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const padded = String(index).padStart(2, '0');
  const src = `/api/voice/alerts/${encodeURIComponent(mindset)}/${encodeURIComponent(category)}/${padded}`;

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnd = () => setPlaying(false);
    a.addEventListener('ended', onEnd);
    return () => a.removeEventListener('ended', onEnd);
  }, []);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  return (
    <div
      className={cx(
        'panel grid grid-cols-[40px_1fr] items-center gap-3 p-3',
        className
      )}
    >
      <button
        type="button"
        onClick={toggle}
        className="grid place-items-center w-10 h-10 rounded-full bg-falcon-blue text-white"
        aria-label={playing ? 'Pause alert' : 'Play alert'}
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <div className="grid gap-1">
        <span className="text-sm font-medium truncate">
          {title ?? `${mindset} / ${category} #${padded}`}
        </span>
        <audio ref={audioRef} src={src} preload="none" />
      </div>
    </div>
  );
}
