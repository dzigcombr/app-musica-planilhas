
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Music } from 'lucide-react';
import { FullPlayer } from '@/components/FullPlayer';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface Song {
  id: string;
  Titulo: string;
  Artista: string;
  Capa: string;
  Link: string;
  Curtida: number;
}

const MusicPlayer = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);

  useEffect(() => {
    // Get song and playlist from navigation state
    const { song, playlist: playlistData } = location.state || {};
    
    if (song && playlistData) {
      setCurrentSong(song);
      setPlaylist(playlistData);
    } else {
      // If no state, redirect back to browser
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleSongChange = (newSong: Song) => {
    setCurrentSong(newSong);
    // Update URL without adding to history
    navigate(`/player/${newSong.id}`, { 
      replace: true, 
      state: { song: newSong, playlist } 
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!currentSong || !playlist.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side - Logo and Back */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-full">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xl font-bold">MusicStream</span>
            </div>
            <div className="w-px h-8 bg-white/20 mx-2" />
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Voltar</span>
            </button>
          </div>

          {/* Right side - Currently playing info */}
          <div className="hidden md:flex items-center gap-3 text-right">
            <div>
              <p className="text-sm text-gray-400">Tocando agora</p>
              <p className="text-white font-medium">{currentSong.Titulo}</p>
            </div>
          </div>
        </div>
      </div>

      <FullPlayer
        song={currentSong}
        playlist={playlist}
        onSongChange={handleSongChange}
      />
    </div>
  );
};

export default MusicPlayer;
