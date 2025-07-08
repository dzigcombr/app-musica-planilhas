
import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import { CategoryCard } from './CategoryCard';
import { SongCard } from './SongCard';
import { LoadingSpinner } from './LoadingSpinner';
import { useQuery } from '@tanstack/react-query';

interface Category {
  name: string;
  Capa: string;
}

interface Song {
  id: string;
  Titulo: string;
  Artista: string;
  Capa: string;
  Categoria: string;
}

interface ApiResponse {
  categories: Category[];
  songs: Song[];
}

const fetchSongData = async (): Promise<ApiResponse> => {
  const response = await fetch('https://script.google.com/macros/s/AKfycbxhooHV40oi4FLDBpqUsBw51RPvjl7dBXis7dvkTlOKx6KoaylbvV3P-ec8y3Ze8qKzOw/exec');
  if (!response.ok) {
    throw new Error('Failed to fetch song data');
  }
  return response.json();
};

const SongBrowser = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const songsRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['songData'],
    queryFn: fetchSongData,
  });

  useEffect(() => {
    const savedFavorites = localStorage.getItem('songFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setTimeout(() => {
      songsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFavoriteToggle = (songId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(songId)) {
      newFavorites.delete(songId);
    } else {
      newFavorites.add(songId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('songFavorites', JSON.stringify([...newFavorites]));
  };

  const filteredSongs = data?.songs.filter(song => 
    !selectedCategory || song.Categoria === selectedCategory
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
          <h2 className="text-2xl font-bold mb-2">Error loading music data</h2>
          <p className="text-gray-300">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Music Browser
          </h1>
          <p className="text-gray-300 text-lg">Discover and explore your favorite music</p>
        </div>

        {/* Categories Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Categories</h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.categories.map((category, index) => (
              <CategoryCard
                key={index}
                category={category}
                isSelected={selectedCategory === category.name}
                onClick={() => handleCategoryClick(category.name)}
              />
            ))}
          </div>
        </section>

        {/* Songs Section */}
        <section ref={songsRef}>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {selectedCategory ? `${selectedCategory} Songs` : 'All Songs'}
            </h2>
            <p className="text-gray-300">
              {filteredSongs.length} song{filteredSongs.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                isFavorite={favorites.has(song.id)}
                onFavoriteToggle={() => handleFavoriteToggle(song.id)}
              />
            ))}
          </div>
          {filteredSongs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No songs found in this category</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SongBrowser;
