
import { useState } from 'react';

interface LikeToggleResult {
  isLiking: boolean;
  toggleLike: (songTitle: string, currentLikes: number) => Promise<number>;
}

export const useLikeToggle = (): LikeToggleResult => {
  const [isLiking, setIsLiking] = useState(false);

  const toggleLike = async (songTitle: string, currentLikes: number): Promise<number> => {
    setIsLiking(true);
    
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbyC29pi2qCgO4hRIQQgRXOX1VBRvfGE5C0uV-Z-gt90pjJc4ZxaJ53mS3kto4T6XXAMow/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Titulo: songTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      // Return optimistic update
      return currentLikes + 1;
    } catch (error) {
      console.error('Error toggling like:', error);
      // Return original count on error
      return currentLikes;
    } finally {
      setIsLiking(false);
    }
  };

  return { isLiking, toggleLike };
};
