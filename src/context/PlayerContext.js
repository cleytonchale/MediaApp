import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  // Save favorites and history when they change
  useEffect(() => {
    AsyncStorage.setItem('@favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    AsyncStorage.setItem('@history', JSON.stringify(history));
  }, [history]);

  const loadSavedData = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('@favorites');
      const savedHistory = await AsyncStorage.getItem('@history');
      
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  // Play a track immediately
  const playNow = (track) => {
    console.log('PlayNow:', track.title);
    setCurrentTrack(track);
    setQueue([track]);
    setCurrentIndex(0);
    setIsPlaying(true);
    addToHistory(track);
  };

  // Set full queue and play from specific index
  const setFullQueue = (tracks, startIndex = 0) => {
    console.log(`Setting queue with ${tracks.length} tracks, starting at ${startIndex}`);
    setQueue(tracks);
    setCurrentIndex(startIndex);
    setCurrentTrack(tracks[startIndex]);
    setIsPlaying(true);
    addToHistory(tracks[startIndex]);
  };

  // Add track to end of queue
  const addToQueue = (track) => {
    console.log('Adding to queue:', track.title);
    setQueue(prev => [...prev, track]);
  };

  // Play next track
  const playNext = () => {
    if (queue.length === 0) return;

    let nextIndex;
    
    if (repeatMode === 'one') {
      // Repeat current track
      nextIndex = currentIndex;
    } else if (isShuffled) {
      // Random next track
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (currentIndex < queue.length - 1) {
      // Normal next
      nextIndex = currentIndex + 1;
    } else if (repeatMode === 'all') {
      // Repeat from beginning
      nextIndex = 0;
    } else {
      // End of queue
      setIsPlaying(false);
      return;
    }

    setCurrentIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
    setIsPlaying(true);
    addToHistory(queue[nextIndex]);
  };

  // Play previous track
  const playPrevious = () => {
    if (queue.length === 0) return;

    let prevIndex;
    
    if (currentIndex > 0) {
      prevIndex = currentIndex - 1;
    } else if (repeatMode === 'all') {
      prevIndex = queue.length - 1;
    } else {
      prevIndex = 0;
    }

    setCurrentIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
    setIsPlaying(true);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffled(prev => !prev);
  };

  // Cycle repeat mode
  const cycleRepeatMode = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  // Clear queue
  const clearQueue = () => {
    setQueue([]);
    setCurrentIndex(0);
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  // Favorites management
  const toggleFavorite = (track) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.videoId === track.videoId);
      if (exists) {
        return prev.filter(f => f.videoId !== track.videoId);
      } else {
        return [...prev, track];
      }
    });
  };

  const isFavorite = (videoId) => {
    return favorites.some(f => f.videoId === videoId);
  };

  const removeFavorite = (videoId) => {
    setFavorites(prev => prev.filter(f => f.videoId !== videoId));
  };

  // History management
  const addToHistory = (track) => {
    setHistory(prev => {
      // Remove if already exists
      const filtered = prev.filter(h => h.videoId !== track.videoId);
      // Add to beginning
      return [track, ...filtered].slice(0, 50); // Keep last 50
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const value = {
    // State
    currentTrack,
    queue,
    currentIndex,
    favorites,
    history,
    isPlaying,
    isShuffled,
    repeatMode,
    
    // Playback controls
    playNow,
    setFullQueue,
    addToQueue,
    playNext,
    playPrevious,
    togglePlayPause,
    toggleShuffle,
    cycleRepeatMode,
    clearQueue,
    
    // Favorites
    toggleFavorite,
    isFavorite,
    removeFavorite,
    
    // History
    addToHistory,
    clearHistory,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}
