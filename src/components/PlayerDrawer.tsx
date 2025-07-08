
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { AudioPlayer } from './AudioPlayer';

interface Song {
  id: string;
  Titulo: string;
  Artista: string;
  Capa: string;
  Link: string;
}

interface PlayerDrawerProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerDrawer: React.FC<PlayerDrawerProps> = ({ song, isOpen, onClose }) => {
  if (!song) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-t border-purple-500/20">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-white text-center">Now Playing</DrawerTitle>
        </DrawerHeader>
        <div className="px-0 pb-8">
          <AudioPlayer song={song} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
