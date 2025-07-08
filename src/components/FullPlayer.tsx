
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useLikeToggle } from '@/hooks/useLikeToggle';

interface Song {
  id: string;
  Titulo: string;
  Artista: string;
  Capa: string;
  Link: string;
  Curtida: number;
}

interface FullPlayerProps {
  song: Song;
  playlist: Song[];
  onSongChange: (song: Song) => void;
}

export const FullPlayer: React.FC<FullPlayerProps> = ({ song, playlist, onSongChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [likes, setLikes] = useState(song.Curtida || 0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isLiking, toggleLike } = useLikeToggle();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [song.Link]);

  useEffect(() => {
    setLikes(song.Curtida || 0);
  }, [song.Curtida]);

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

  const handleNext = () => {
    const currentIndex = playlist.findIndex(s => s.id === song.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    onSongChange(playlist[nextIndex]);
  };

  const handlePrevious = () => {
    const currentIndex = playlist.findIndex(s => s.id === song.id);
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    onSongChange(playlist[prevIndex]);
  };

  const handleLike = async () => {
    const newLikes = await toggleLike(song.Titulo, likes);
    setLikes(newLikes);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      <audio
        ref={audioRef}
        src={song.Link}
        preload="metadata"
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        {/* Album Art */}
        <div className="w-80 h-80 md:w-96 md:h-96 mb-8 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={song.Capa || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'}
            alt={song.Titulo}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400';
            }}
          />
        </div>

        {/* Song Info */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{song.Titulo}</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">{song.Artista}</p>
          
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
          >
            <Heart className={`w-5 h-5 ${likes > 0 ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            <span>{likes} likes</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-2xl mb-8">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="w-full mb-2"
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button
            onClick={handlePrevious}
            className="text-gray-300 hover:text-white transition-colors p-2"
          >
            <SkipBack className="w-8 h-8" />
          </button>
          
          <button
            onClick={togglePlayPause}
            className="bg-white text-black rounded-full p-4 hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>
          
          <button
            onClick={handleNext}
            className="text-gray-300 hover:text-white transition-colors p-2"
          >
            <SkipForward className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};
