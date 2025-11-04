import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { PlayerContext } from '../context/PlayerContext';
import { AuthContext } from '../context/AuthContext';
import { colors, typography, spacing } from '../theme';
import API_BASE from '../config';

export default function MusicPlayerScreen({ route, navigation }) {
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

  const [sound, setSound] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setupAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentTrack]);

  useEffect(() => {
    if (sound && isPlaying) {
      sound.playAsync();
    } else if (sound && !isPlaying) {
      sound.pauseAsync();
    }
  }, [isPlaying, sound]);

  const setupAudio = async () => {
    if (!currentTrack || !currentTrack.fileUrl) {
      console.error('[MUSIC PLAYER] Track ou fileUrl não disponível');
      return;
    }

    console.log('[MUSIC PLAYER] ========================================');
    console.log('[MUSIC PLAYER] Carregando áudio:', currentTrack.fileUrl);
    console.log('[MUSIC PLAYER] Track:', currentTrack.title);
    console.log('[MUSIC PLAYER] ========================================');

    setLoading(true);
    try {
      // Solicitar permissão para tocar áudio
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
      });

      // Descarregar som anterior se existir
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      // Verificar se a URL está acessível antes de tentar carregar
      try {
        const response = await fetch(currentTrack.fileUrl, { method: 'HEAD' });
        if (!response.ok) {
          console.error('[MUSIC PLAYER] Arquivo não encontrado no servidor:', response.status);
          throw new Error(`Arquivo não encontrado (${response.status})`);
        }
        console.log('[MUSIC PLAYER] ✓ Arquivo verificado no servidor');
      } catch (fetchError) {
        console.warn('[MUSIC PLAYER] Aviso ao verificar arquivo (continuando):', fetchError.message);
        // Continuar mesmo se a verificação falhar (alguns servidores não suportam HEAD)
      }

      // Carregar e preparar o áudio
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: currentTrack.fileUrl },
        { shouldPlay: isPlaying, isLooping: repeatMode === 'one' }
      );

      setSound(newSound);

      // Escutar mudanças de estado
      newSound.setOnPlaybackStatusUpdate((status) => {
        setPlaybackStatus(status);
        if (status.didJustFinish && !status.isLooping) {
          playNext();
        }
      });

      console.log('[MUSIC PLAYER] ✓✓✓ ÁUDIO CARREGADO COM SUCESSO! ✓✓✓');

    } catch (error) {
      console.error('[MUSIC PLAYER] ========================================');
      console.error('[MUSIC PLAYER] ERRO AO CARREGAR ÁUDIO');
      console.error('[MUSIC PLAYER] Erro:', error);
      console.error('[MUSIC PLAYER] Mensagem:', error.message);
      console.error('[MUSIC PLAYER] URL tentada:', currentTrack.fileUrl);
      console.error('[MUSIC PLAYER] ========================================');
      
      let errorMessage = 'Não foi possível carregar a música.';
      
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        errorMessage += '\n\nO arquivo não foi encontrado no servidor.';
        errorMessage += '\n\nIsso pode acontecer se:';
        errorMessage += '\n• O arquivo foi deletado';
        errorMessage += '\n• O servidor está offline';
        errorMessage += '\n• Há um problema com o nome do arquivo';
      } else if (error.message?.includes('network') || error.message?.includes('Network')) {
        errorMessage += '\n\nErro de conexão.';
        errorMessage += '\n\nVerifique sua conexão com a internet.';
      } else {
        errorMessage += `\n\nErro: ${error.message || 'Erro desconhecido'}`;
      }
      
      errorMessage += `\n\nURL: ${currentTrack.fileUrl}`;
      
      Alert.alert('Erro ao Reproduzir', errorMessage, [
        { text: 'OK', style: 'default' },
        { 
          text: 'Tentar Novamente', 
          onPress: () => {
            setTimeout(() => setupAudio(), 1000);
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (milliseconds) => {
    if (!milliseconds) return '0:00';
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!playbackStatus || !playbackStatus.durationMillis) return 0;
    return playbackStatus.positionMillis / playbackStatus.durationMillis;
  };

  const seekTo = async (position) => {
    if (!sound || !playbackStatus) return;
    const positionMillis = position * playbackStatus.durationMillis;
    await sound.setPositionAsync(positionMillis);
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

  if (!currentTrack) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="musical-notes-outline" size={80} color={colors.text.tertiary} />
        <Text style={styles.emptyText}>Nenhuma música selecionada</Text>
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
      {/* Album Art Area */}
      <View style={styles.artContainer}>
        <View style={styles.artPlaceholder}>
          <Ionicons name="musical-notes" size={120} color={colors.primary.main} />
        </View>
      </View>

      {/* Track Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.trackTitle} numberOfLines={2}>
          {currentTrack.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {currentTrack.channel}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary.main} />
        ) : (
          <>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${getProgress() * 100}%` }]} />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {playbackStatus ? formatTime(playbackStatus.positionMillis) : '0:00'}
              </Text>
              <Text style={styles.timeText}>
                {playbackStatus ? formatTime(playbackStatus.durationMillis) : '0:00'}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.mainControls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={toggleShuffle}
          >
            <Ionicons 
              name="shuffle" 
              size={24} 
              color={isShuffled ? colors.primary.main : colors.text.tertiary} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={playPrevious}
          >
            <Ionicons name="play-skip-back" size={32} color={colors.text.primary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.playButton}
            onPress={togglePlayPause}
          >
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={40} 
              color={colors.primary.contrast} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={playNext}
          >
            <Ionicons name="play-skip-forward" size={32} color={colors.text.primary} />
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
      </View>

      {/* Queue */}
      {queue.length > 1 && (
        <ScrollView style={styles.queueContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.queueTitle}>
            Próximas na fila ({queue.length - 1})
          </Text>
          {queue.slice(1, 10).map((track, index) => (
            <TouchableOpacity 
              key={`${track.videoId}-${index}`} 
              style={styles.queueItem}
              onPress={() => playNext()}
            >
              <Ionicons name="musical-note" size={20} color={colors.text.secondary} />
              <View style={styles.queueInfo}>
                <Text style={styles.queueItemTitle} numberOfLines={1}>
                  {track.title}
                </Text>
                <Text style={styles.queueItemArtist} numberOfLines={1}>
                  {track.channel}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  artContainer: {
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  artPlaceholder: {
    width: 250,
    height: 250,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    ...spacing.shadows.lg,
  },
  infoContainer: {
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  trackTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  trackArtist: {
    ...typography.styles.body1,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.xl,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.ui.border,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
  },
  controlsContainer: {
    flex: 1,
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  controlButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    ...spacing.shadows.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  actionButton: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionButtonText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  queueContainer: {
    maxHeight: 200,
    paddingHorizontal: spacing.screenPadding,
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
  queueItemArtist: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
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

