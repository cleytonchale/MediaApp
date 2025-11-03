import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView, 
  TouchableOpacity, 
  Linking, 
  Alert,
  Image
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { PlayerContext } from '../context/PlayerContext';
import { colors, typography, spacing } from '../theme';

export default function PlayerScreen({ route, navigation }) {
  const videoId = route?.params?.videoId || null;
  const title = route?.params?.title || 'Vídeo';
  
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  console.log('PlayerScreen - Video ID:', videoId);
  console.log('PlayerScreen - Title:', title);

  if (!videoId) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="musical-notes-outline" size={80} color={colors.text.tertiary} />
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

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { 
          width: 100%; 
          height: 100%; 
          background: #000; 
          overflow: hidden;
          -webkit-overflow-scrolling: touch;
        }
        .container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }
        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #fff;
          font-family: Arial, sans-serif;
          text-align: center;
          z-index: 1;
        }
        .spinner {
          border: 3px solid rgba(255,255,255,0.3);
          border-top: 3px solid #fff;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 10px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="loading" id="loading">
          <div class="spinner"></div>
          <p>Carregando player...</p>
        </div>
        <iframe 
          id="player"
          src="https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&controls=1&fs=1&enablejsapi=1" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen
          loading="eager"
          onload="document.getElementById('loading').style.display='none'"
        ></iframe>
      </div>
    </body>
    </html>
  `;

  const openInYouTube = () => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    Alert.alert(
      'Abrir no YouTube',
      'Deseja abrir este vídeo no aplicativo do YouTube?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Abrir',
          onPress: () => {
            Linking.openURL(youtubeUrl).catch(err => {
              console.error('Erro ao abrir YouTube:', err);
              alert('Não foi possível abrir o YouTube');
            });
          }
        }
      ]
    );
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'off') return 'repeat-outline';
    if (repeatMode === 'all') return 'repeat';
    return 'repeat-outline'; // repeat-one would need custom icon
  };

  const getRepeatColor = () => {
    return repeatMode !== 'off' ? colors.primary.main : colors.text.tertiary;
  };

  const isCurrentFavorite = currentTrack ? isFavorite(currentTrack.videoId) : false;

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={80} color={colors.ui.error} />
        <Text style={styles.errorText}>Erro ao carregar player</Text>
        <Text style={styles.errorSubtext}>Video ID: {videoId}</Text>
        <Text style={styles.errorHint}>
          O player integrado teve um problema.{'\n'}
          Tente abrir no aplicativo do YouTube.
        </Text>
        
        <TouchableOpacity 
          style={styles.youtubeButton}
          onPress={openInYouTube}
        >
          <Ionicons name="logo-youtube" size={20} color={colors.secondary.contrast} />
          <Text style={styles.youtubeButtonText}>Abrir no YouTube</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setError(false);
            setLoading(true);
          }}
        >
          <Ionicons name="refresh" size={20} color={colors.text.primary} />
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
        
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
      <View style={styles.playerContainer}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            <Text style={styles.loadingText}>Carregando player...</Text>
          </View>
        )}
        <WebView 
          source={{ html }} 
          style={styles.webview}
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView Error:', nativeEvent);
            setError(true);
            setLoading(false);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView HTTP Error:', nativeEvent);
          }}
        />
      </View>

      {/* Controls and Info */}
      <ScrollView style={styles.infoContainer} showsVerticalScrollIndicator={false}>
        {/* Track Info */}
        {currentTrack && (
          <View style={styles.trackHeader}>
            <Image
              source={{ uri: currentTrack.thumbnail }}
              style={styles.largeThumbnail}
            />
            <Text style={styles.trackTitle}>{currentTrack.title}</Text>
            <Text style={styles.trackChannel}>{currentTrack.channel}</Text>
          </View>
        )}

        {/* Main Controls */}
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
              size={36} 
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
            {repeatMode === 'one' && (
              <Text style={styles.repeatOneText}>1</Text>
            )}
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
            onPress={openInYouTube}
          >
            <Ionicons name="logo-youtube" size={24} color={colors.text.primary} />
            <Text style={styles.actionButtonText}>YouTube</Text>
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
            {queue.slice(1, 6).map((track, index) => (
              <View key={`${track.videoId}-${index}`} style={styles.queueItem}>
                <Image
                  source={{ uri: track.thumbnail }}
                  style={styles.queueThumbnail}
                />
                <View style={styles.queueInfo}>
                  <Text style={styles.queueItemTitle} numberOfLines={1}>
                    {track.title}
                  </Text>
                  <Text style={styles.queueItemChannel} numberOfLines={1}>
                    {track.channel}
                  </Text>
                </View>
              </View>
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
  playerContainer: {
    width: '100%',
    height: 280,
    backgroundColor: colors.background.primary,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: colors.background.primary,
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
    zIndex: 1,
  },
  loadingText: {
    ...typography.styles.body2,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  trackHeader: {
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  largeThumbnail: {
    width: 200,
    height: 200,
    borderRadius: spacing.radius.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.background.elevated,
  },
  trackTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  trackChannel: {
    ...typography.styles.body2,
    color: colors.text.secondary,
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
    position: 'relative',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    ...spacing.shadows.lg,
  },
  repeatOneText: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary.main,
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
  queueThumbnail: {
    width: 60,
    height: 60,
    borderRadius: spacing.radius.sm,
    backgroundColor: colors.background.elevated,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.xxxl,
  },
  errorText: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  errorSubtext: {
    ...typography.styles.body2,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  errorHint: {
    ...typography.styles.body2,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.base,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  youtubeButton: {
    flexDirection: 'row',
    backgroundColor: colors.secondary.main,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: spacing.radius.full,
    marginBottom: spacing.base,
    gap: spacing.sm,
    ...spacing.shadows.md,
  },
  youtubeButtonText: {
    ...typography.styles.button,
    color: colors.secondary.contrast,
    textTransform: 'none',
    fontWeight: '600',
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: spacing.radius.full,
    marginBottom: spacing.base,
    gap: spacing.sm,
  },
  retryButtonText: {
    ...typography.styles.button,
    color: colors.text.primary,
    textTransform: 'none',
    fontWeight: '600',
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
  bottomSpacer: {
    height: spacing.xxxl,
  },
});
