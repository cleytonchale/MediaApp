import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PlayerContext } from '../context/PlayerContext';
import { colors, typography, spacing } from '../theme';

export default function MiniPlayer() {
  const navigation = useNavigation();
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
  } = useContext(PlayerContext);

  if (!currentTrack) {
    return null;
  }

  const openFullPlayer = () => {
    // Determinar se é música ou vídeo pela extensão do arquivo ou fileUrl
    const playerScreen = currentTrack.fileUrl?.includes('/videos/') 
      ? 'VideoPlayer' 
      : 'MusicPlayer';
    
    navigation.navigate(playerScreen, {
      videoId: currentTrack.videoId,
      title: currentTrack.title,
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={openFullPlayer}
      activeOpacity={0.9}
    >
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: '0%' }]} />
      </View>

      <View style={styles.content}>
        {/* Thumbnail */}
        {currentTrack.thumbnail ? (
          <Image
            source={{ uri: currentTrack.thumbnail }}
            style={styles.thumbnail}
          />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Ionicons name="musical-notes" size={24} color={colors.text.tertiary} />
          </View>
        )}

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {currentTrack.channel}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={(e) => {
              e.stopPropagation();
              playPrevious();
            }}
          >
            <Ionicons name="play-skip-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.playButton]}
            onPress={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
          >
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={28} 
              color={colors.primary.contrast} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={(e) => {
              e.stopPropagation();
              playNext();
            }}
          >
            <Ionicons name="play-skip-forward" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.tabBarHeight,
    left: 0,
    right: 0,
    backgroundColor: colors.background.elevated,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
    ...spacing.shadows.xl,
  },
  progressBar: {
    height: 2,
    backgroundColor: colors.ui.border,
  },
  progress: {
    height: '100%',
    backgroundColor: colors.primary.main,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: spacing.radius.sm,
    backgroundColor: colors.background.tertiary,
  },
  thumbnailPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: spacing.radius.sm,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackInfo: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.styles.subtitle2,
    color: colors.text.primary,
    marginBottom: 2,
  },
  subtitle: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: colors.primary.main,
    width: 44,
    height: 44,
    borderRadius: 22,
  },
});
