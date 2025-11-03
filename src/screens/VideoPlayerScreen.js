import React, { useState, useContext, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { PlayerContext } from '../context/PlayerContext';
import { AuthContext } from '../context/AuthContext';
import { colors, typography, spacing } from '../theme';
import API_BASE from '../config';
const { width, height } = Dimensions.get('window');

export default function VideoPlayerScreen({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const {
    currentTrack,
    queue,
    isPlaying,
    isShuffled,
    repeatMode,
    togglePlayPause,
    playNext,
    playPrevious,
    toggleShuffle,
    cycleRepeatMode,
    isFavorite,
    toggleFavorite,
  } = useContext(PlayerContext);

  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto hide controls after 5 seconds
    if (showControls) {
      const timer = setTimeout(() => setShowControls(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showControls]);

  useEffect(() => {
    if (isPlaying && status.isLoaded) {
      videoRef.current?.playAsync();
    } else if (!isPlaying && status.isLoaded) {
      videoRef.current?.pauseAsync();
    }
  }, [isPlaying, status.isLoaded]);

  const formatTime = (milliseconds) => {
    if (!milliseconds) return '0:00';
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!status.isLoaded || !status.durationMillis) return 0;
    return status.positionMillis / status.durationMillis;
  };

  const seekTo = async (position) => {
    if (!videoRef.current || !status.durationMillis) return;
    const positionMillis = position * status.durationMillis;
    await videoRef.current.setPositionAsync(positionMillis);
  };

  const handlePlaybackStatusUpdate = (status) => {
    setStatus(status);
    if (status.didJustFinish && repeatMode !== 'all') {
      togglePlayPause();
    }
  };

  const isCurrentFavorite = currentTrack ? isFavorite(currentTrack.videoId) : false;

  const getRepeatIcon = () => {
    if (repeatMode === 'off') return 'repeat-outline';
    if (repeatMode === 'all') return 'repeat';
    return 'repeat-outline';
  };

  const getRepeatColor = () => {
    return repeatMode !== 'off' ? colors.primary.main : colors.text.tertiary;
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  if (!currentTrack) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="play-circle-outline" size={80} color={colors.text.tertiary} />
        <Text style={styles.emptyText}>Nenhum vídeo selecionado</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.primary.contrast} />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentTrack.fileUrl) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="alert-circle-outline" size={80} color={colors.ui.error} />
        <Text style={styles.emptyText}>URL do vídeo inválido</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.primary.contrast} />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Video Player */}
      <TouchableOpacity 
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={toggleControls}
      >
        <Video
          ref={videoRef}
          source={{ uri: currentTrack.fileUrl }}
          style={styles.video}
          shouldPlay={isPlaying}
          isLooping={repeatMode === 'all'}
          resizeMode="contain"
          useNativeControls={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          onError={(error) => {
            console.error('Video Error:', error);
            Alert.alert('Erro', 'Não foi possível carregar o vídeo');
            setLoading(false);
          }}
        />

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            <Text style={styles.loadingText}>Carregando vídeo...</Text>
          </View>
        )}

        {/* Controls Overlay */}
        {showControls && (
          <View style={styles.controlsOverlay}>
            {/* Top Bar */}
            <View style={styles.topBar}>
              <TouchableOpacity 
                style={styles.backControlButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={28} color={colors.primary.contrast} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.backControlButton}
                onPress={() => currentTrack && toggleFavorite(currentTrack)}
              >
                <Ionicons 
                  name={isCurrentFavorite ? "heart" : "heart-outline"} 
                  size={28} 
                  color={isCurrentFavorite ? colors.ui.error : colors.primary.contrast} 
                />
              </TouchableOpacity>
            </View>

            {/* Center Play Button */}
            <TouchableOpacity 
              style={styles.centerPlayButton}
              onPress={togglePlayPause}
            >
              <Ionicons 
                name={isPlaying ? "pause-circle" : "play-circle"} 
                size={80} 
                color={colors.primary.contrast}
                style={styles.playIconShadow}
              />
            </TouchableOpacity>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              {/* Progress Bar */}
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${getProgress() * 100}%` }]} />
              </View>

              {/* Time and Controls */}
              <View style={styles.bottomControlsRow}>
                <Text style={styles.timeText}>
                  {status.isLoaded ? formatTime(status.positionMillis) : '0:00'}
                </Text>
                <Text style={styles.timeText}>
                  {status.isLoaded ? formatTime(status.durationMillis) : '0:00'}
                </Text>
              </View>

              {/* Control Buttons */}
              <View style={styles.controlButtonsRow}>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={toggleShuffle}
                >
                  <Ionicons 
                    name="shuffle" 
                    size={24} 
                    color={isShuffled ? colors.primary.main : colors.primary.contrast} 
                  />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={playPrevious}
                >
                  <Ionicons name="play-skip-back" size={32} color={colors.primary.contrast} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={playNext}
                >
                  <Ionicons name="play-skip-forward" size={32} color={colors.primary.contrast} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={cycleRepeatMode}
                >
                  <Ionicons 
                    name={getRepeatIcon()} 
                    size={24} 
                    color={getRepeatColor()} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Info Section */}
      <ScrollView style={styles.infoSection} showsVerticalScrollIndicator={false}>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {currentTrack.title}
          </Text>
          <Text style={styles.videoChannel} numberOfLines={1}>
            {currentTrack.channel}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => currentTrack && toggleFavorite(currentTrack)}
          >
            <Ionicons 
              name={isCurrentFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isCurrentFavorite ? colors.ui.error : colors.text.primary} 
            />
            <Text style={styles.actionButtonText}>Favoritar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Compartilhar', 'Funcionalidade em breve!')}
          >
            <Ionicons name="share-outline" size={24} color={colors.text.primary} />
            <Text style={styles.actionButtonText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>

        {/* Queue */}
        {queue.length > 1 && (
          <View style={styles.queueSection}>
            <Text style={styles.queueTitle}>
              Próximos na fila ({queue.length - 1})
            </Text>
            {queue.slice(1, 10).map((track, index) => (
              <TouchableOpacity 
                key={`${track.videoId}-${index}`} 
                style={styles.queueItem}
                onPress={playNext}
              >
                <Ionicons name="play-circle-outline" size={20} color={colors.text.secondary} />
                <View style={styles.queueInfo}>
                  <Text style={styles.queueItemTitle} numberOfLines={1}>
                    {track.title}
                  </Text>
                  <Text style={styles.queueItemChannel} numberOfLines={1}>
                    {track.channel}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  videoContainer: {
    width: width,
    height: (width * 9) / 16,
    backgroundColor: colors.background.primary,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  loadingText: {
    ...typography.styles.body2,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  backControlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerPlayButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconShadow: {
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: 2,
  },
  bottomControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  timeText: {
    ...typography.styles.caption,
    color: colors.primary.contrast,
  },
  controlButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
  },
  controlButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  videoInfo: {
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.lg,
  },
  videoTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  videoChannel: {
    ...typography.styles.body2,
    color: colors.text.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  actionButton: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionButtonText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  queueSection: {
    padding: spacing.screenPadding,
  },
  queueTitle: {
    ...typography.styles.subtitle1,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  queueInfo: {
    flex: 1,
  },
  queueItemTitle: {
    ...typography.styles.subtitle2,
    color: colors.text.primary,
    marginBottom: 2,
  },
  queueItemChannel: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
  },
  bottomSpacer: {
    height: spacing.xxxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.xxxl,
  },
  emptyText: {
    ...typography.styles.h4,
    color: colors.text.secondary,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  backButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: spacing.radius.full,
    gap: spacing.sm,
    ...spacing.shadows.md,
  },
  backButtonText: {
    ...typography.styles.button,
    color: colors.primary.contrast,
    textTransform: 'none',
    fontWeight: '600',
  },
});

