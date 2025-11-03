import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { PlayerContext } from '../context/PlayerContext';
import axios from 'axios';
import { colors, typography, spacing } from '../theme';

const API_BASE = 'http://10.168.62.170:8000';
const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user, logout, token } = useContext(AuthContext);
  const { playNow, addToQueue, isFavorite, toggleFavorite } = useContext(PlayerContext);
  const [recentMusics, setRecentMusics] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecent();
  }, []);

  const loadRecent = async () => {
    setLoading(true);
    try {
      // Buscar músicas recentes
      const musicResponse = await axios.get(`${API_BASE}/musicas`, {
        params: { limit: 10 },
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentMusics(musicResponse.data.musicas || []);

      // Buscar vídeos recentes
      const videoResponse = await axios.get(`${API_BASE}/videos`, {
        params: { limit: 10 },
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentVideos(videoResponse.data.videos || []);
    } catch (error) {
      console.error('Erro ao carregar recentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const playMusica = (musica) => {
    const track = {
      videoId: musica.id.toString(),
      title: musica.titulo,
      channel: musica.artista,
      thumbnail: null,
      fileUrl: `${API_BASE}/uploads/${musica.arquivo_path}`
    };
    playNow(track);
    navigation.navigate('MusicPlayer', { 
      musicaId: track.videoId, 
      title: track.title 
    });
  };

  const playVideo = (video) => {
    const track = {
      videoId: video.id.toString(),
      title: video.titulo,
      channel: video.descricao || 'Sem descrição',
      thumbnail: null,
      fileUrl: `${API_BASE}/uploads/${video.arquivo_path}`
    };
    playNow(track);
    navigation.navigate('VideoPlayer', { 
      videoId: track.videoId, 
      title: track.title 
    });
  };

  const handleToggleFavoriteMusica = (musica) => {
    const track = {
      videoId: musica.id.toString(),
      title: musica.titulo,
      channel: musica.artista,
      thumbnail: null
    };
    toggleFavorite(track);
  };

  const handleToggleFavoriteVideo = (video) => {
    const track = {
      videoId: video.id.toString(),
      title: video.titulo,
      channel: video.descricao || 'Sem descrição',
      thumbnail: null
    };
    toggleFavorite(track);
  };

  const renderMusicaItem = (musica) => {
    const isInFavorites = isFavorite(musica.id.toString());
    const cardWidth = width * 0.45;

    return (
      <TouchableOpacity 
        key={musica.id}
        style={[styles.horizontalCard, { width: cardWidth }]}
        onPress={() => playMusica(musica)}
      >
        <View style={styles.musicaThumbnail}>
          <Ionicons name="musical-note" size={48} color={colors.primary.main} />
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            handleToggleFavoriteMusica(musica);
          }}
        >
          <Ionicons 
            name={isInFavorites ? "heart" : "heart-outline"} 
            size={20} 
            color={isInFavorites ? colors.primary.main : colors.text.primary} 
          />
        </TouchableOpacity>
        <View style={styles.horizontalInfo}>
          <Text style={styles.horizontalTitle} numberOfLines={2}>
            {musica.titulo}
          </Text>
          <Text style={styles.horizontalChannel} numberOfLines={1}>
            {musica.artista}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderVideoItem = (video) => {
    const isInFavorites = isFavorite(video.id.toString());
    const cardWidth = width * 0.45;

    return (
      <TouchableOpacity 
        key={video.id}
        style={[styles.horizontalCard, { width: cardWidth }]}
        onPress={() => playVideo(video)}
      >
        <View style={styles.videoThumbnail}>
          <Ionicons name="play-circle" size={48} color={colors.secondary.main} />
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            handleToggleFavoriteVideo(video);
          }}
        >
          <Ionicons 
            name={isInFavorites ? "heart" : "heart-outline"} 
            size={20} 
            color={isInFavorites ? colors.secondary.main : colors.text.primary} 
          />
        </TouchableOpacity>
        <View style={styles.horizontalInfo}>
          <Text style={styles.horizontalTitle} numberOfLines={2}>
            {video.titulo}
          </Text>
          <Text style={styles.horizontalChannel} numberOfLines={1}>
            {video.categoria || 'Sem categoria'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.username || 'Convidado'}!</Text>
            <Text style={styles.subtitle}>Sua biblioteca pessoal</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={styles.loadingText}>Carregando biblioteca...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Access */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acesso Rápido</Text>
            <View style={styles.quickAccessGrid}>
              <TouchableOpacity 
                style={[styles.quickAccessCard, { backgroundColor: colors.music.card }]}
                onPress={() => navigation.navigate('Music')}
              >
                <Ionicons name="musical-notes" size={32} color={colors.primary.main} />
                <Text style={styles.quickAccessText}>Música</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.quickAccessCard, { backgroundColor: colors.video.card }]}
                onPress={() => navigation.navigate('Video')}
              >
                <Ionicons name="play-circle" size={32} color={colors.secondary.main} />
                <Text style={styles.quickAccessText}>Vídeo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.quickAccessCard, { backgroundColor: colors.background.tertiary }]}
                onPress={() => navigation.navigate('Library')}
              >
                <Ionicons name="library" size={32} color={colors.text.primary} />
                <Text style={styles.quickAccessText}>Biblioteca</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.quickAccessCard, { backgroundColor: colors.background.tertiary }]}
                onPress={() => navigation.navigate('Profile')}
              >
                <Ionicons name="person" size={32} color={colors.text.primary} />
                <Text style={styles.quickAccessText}>Perfil</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Musics */}
          {recentMusics.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Músicas Recentes</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Music')}>
                  <Text style={styles.seeAllText}>Ver tudo</Text>
                </TouchableOpacity>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {recentMusics.map(musica => renderMusicaItem(musica))}
              </ScrollView>
            </View>
          )}

          {/* Recent Videos */}
          {recentVideos.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Vídeos Recentes</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Video')}>
                  <Text style={styles.seeAllText}>Ver tudo</Text>
                </TouchableOpacity>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {recentVideos.map(video => renderVideoItem(video))}
              </ScrollView>
            </View>
          )}

          <View style={styles.bottomSpacer} />
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
  header: {
    paddingTop: 50,
    paddingBottom: spacing.base,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: colors.background.secondary,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    ...typography.styles.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.styles.body1,
    color: colors.text.secondary,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.styles.body1,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.base,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  seeAllText: {
    ...typography.styles.body2,
    color: colors.primary.main,
    fontWeight: '600',
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.md,
  },
  quickAccessCard: {
    width: (width - spacing.screenPadding * 2 - spacing.md) / 2,
    aspectRatio: 1.5,
    borderRadius: spacing.radius.md,
    padding: spacing.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAccessText: {
    ...typography.styles.subtitle1,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  horizontalScroll: {
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.md,
  },
  horizontalCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: spacing.radius.md,
    overflow: 'hidden',
  },
  musicaThumbnail: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary.main + '20',
  },
  videoThumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary.main + '20',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalInfo: {
    padding: spacing.md,
  },
  horizontalTitle: {
    ...typography.styles.subtitle2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  horizontalChannel: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
  },
  bottomSpacer: {
    height: 150,
  },
});
