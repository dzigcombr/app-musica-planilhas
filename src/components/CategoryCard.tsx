
import React from 'react';

interface Category {
  Categoria: string;
  Capa: string;
}

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
        isSelected 
          ? 'ring-4 ring-purple-500 shadow-2xl shadow-purple-500/25' 
          : 'hover:shadow-xl shadow-lg'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={category.Capa || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'}
          alt={category.Categoria}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
            {category.Categoria}
          </h3>
        </div>
      </div>
    </div>
  );
};
