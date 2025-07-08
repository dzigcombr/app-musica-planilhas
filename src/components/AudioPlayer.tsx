
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface Song {
  id: string;
  Titulo: string;
  Artista: string;
  Capa: string;
  Link: string;
}

interface AudioPlayerProps {
  song: Song;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [song.Link]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 text-white">
      <audio
        ref={audioRef}
        src={song.Link}
        preload="metadata"
      />
      
      {/* Song Info */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={song.Capa || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300'}
          alt={song.Titulo}
          className="w-16 h-16 rounded-lg object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300';
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{song.Titulo}</h3>
          <p className="text-gray-300 text-sm truncate">{song.Artista}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Seek Bar */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Play/Pause Button */}
        <div className="flex justify-center">
          <button
            onClick={togglePlayPause}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
