
import React, { useState, useRef } from 'react';
import { CategoryCard } from './CategoryCard';
import { SongCard } from './SongCard';
import { LoadingSpinner } from './LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import { Music, Search } from 'lucide-react';

interface Category {
  Categoria: string;
  Capa: string;
}

interface Song {
  id: string;
  Titulo: string;
  Artista: string;
  Capa: string;
  Categoria: string;
  Link: string;
  Curtida: number;
}

interface ApiResponse {
  genres: Category[];
  songs: Song[];
}

const fetchSongData = async (): Promise<ApiResponse> => {
  const response = await fetch('https://script.google.com/macros/s/AKfycbxhooHV40oi4FLDBpqUsBw51RPvjl7dBXis7dvkTlOKx6KoaylbvV3P-ec8y3Ze8qKzOw/exec');
  if (!response.ok) {
    throw new Error('Failed to fetch song data');
  }
  const data = await response.json();
  
  // Validate that both required arrays exist
  if (!data.genres || !Array.isArray(data.genres)) {
    throw new Error('Invalid API response: genres array is missing or invalid');
  }
  if (!data.songs || !Array.isArray(data.songs)) {
    throw new Error('Invalid API response: songs array is missing or invalid');
  }
  
  return data;
};

const SongBrowser = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const songsRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['songData'],
    queryFn: fetchSongData,
  });

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setTimeout(() => {
      songsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const filteredSongs = data?.songs.filter(song => 
    (!selectedCategory || song.Categoria === selectedCategory) &&
    (!searchTerm || song.Titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
     song.Artista.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Erro ao carregar dados musicais</h2>
          <p className="text-gray-300">Tente novamente mais tarde</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full">
              <Music className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MusicStream
              </h1>
              <p className="text-gray-300">Descubra sua próxima música favorita</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar músicas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-500/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Categorias</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {data?.genres.map((category) => (
            <CategoryCard
              key={category.Categoria}
              category={category}
              isSelected={selectedCategory === category.Categoria}
              onClick={() => setSelectedCategory(selectedCategory === category.Categoria ? '' : category.Categoria)}
            />
          ))}
        </div>

        {/* Songs Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory ? `${selectedCategory} - ${filteredSongs.length} música${filteredSongs.length !== 1 ? 's' : ''}` : `Todas as Músicas - ${filteredSongs.length} música${filteredSongs.length !== 1 ? 's' : ''}`}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSongs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  playlist={filteredSongs}
                />
              ))}
            </div>

            {filteredSongs.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Nenhuma música encontrada</h3>
                <p className="text-gray-400">Tente ajustar seus filtros ou termo de busca</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SongBrowser;
