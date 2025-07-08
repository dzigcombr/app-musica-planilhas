
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-3 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <FullPlayer
        song={currentSong}
        playlist={playlist}
        onSongChange={handleSongChange}
      />
    </div>
  );
};

export default MusicPlayer;
