
import React from 'react';
import { Heart } from 'lucide-react';

interface Song {
  id: string;
  Titulo: string;
  Artista: string;
  Capa: string;
  Categoria: string;
}

interface SongCardProps {
  song: Song;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, isFavorite, onFavoriteToggle }) => {
  return (
    <div className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:transform hover:scale-105 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={song.Capa || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300'}
          alt={song.Titulo}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300';
          }}
        />
        <button
          onClick={onFavoriteToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
            isFavorite
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-black/50 text-white hover:bg-black/70'
          }`}
        >
          <Heart
            size={20}
            className={`transition-all duration-300 ${
              isFavorite ? 'fill-current scale-110' : 'hover:scale-110'
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white text-lg mb-1 line-clamp-1 group-hover:text-purple-300 transition-colors">
          {song.Titulo}
        </h3>
        <p className="text-gray-300 text-sm line-clamp-1">
          {song.Artista}
        </p>
      </div>
    </div>
  );
};
