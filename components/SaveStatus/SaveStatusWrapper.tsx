'use client';

import { useGames } from '@/contexts/GameContext';
import SaveStatus from './SaveStatus';

export default function SaveStatusWrapper() {
  const { saveStatus, lastSaved } = useGames();
  return <SaveStatus status={saveStatus} lastSaved={lastSaved} />;
} 