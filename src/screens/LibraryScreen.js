import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlayerContext } from '../context/PlayerContext';
import { colors, typography, spacing } from '../theme';

export default function LibraryScreen({ navigation }) {
  const { favorites, history, playNow, removeFavorite, clearHistory } = useContext(PlayerContext);
  const [activeTab, setActiveTab] = useState('favorites');

  const playTrack = (track) => {
    playNow(track);
    navigation.navigate('Player', { 
      videoId: track.videoId, 
      title: track.title 
    });
  };

  const renderTrackItem = (track, index, showRemove = false) => {
    return (
      <TouchableOpacity 
        key={`${track.videoId}-${index}`}
        style={styles.trackItem}
        onPress={() => playTrack(track)}
      >
        <Image
          source={{ uri: track.thumbnail }}
          style={styles.trackThumbnail}
        />
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={2}>
            {track.title}
          </Text>
          <Text style={styles.trackChannel} numberOfLines={1}>
            {track.channel}
          </Text>
        </View>
        {showRemove && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={(e) => {
              e.stopPropagation();
              removeFavorite(track.videoId);
            }}
          >
            <Ionicons name="trash-outline" size={20} color={colors.ui.error} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = (type) => {
    const config = {
      favorites: {
        icon: 'heart-outline',
        title: 'Nenhum favorito ainda',
        subtitle: 'Adicione suas músicas e vídeos favoritos aqui',
      },
      history: {
        icon: 'time-outline',
        title: 'Sem histórico',
        subtitle: 'Seus últimos reproduzidos aparecerão aqui',
      },
    };

    const { icon, title, subtitle } = config[type];

    return (
      <View style={styles.emptyState}>
        <Ionicons name={icon} size={80} color={colors.text.tertiary} />
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptySubtitle}>{subtitle}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Biblioteca</Text>
        <Text style={styles.headerSubtitle}>Seus conteúdos salvos</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Ionicons 
            name="heart" 
            size={20} 
            color={activeTab === 'favorites' ? colors.primary.main : colors.text.tertiary} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'favorites' && styles.activeTabText
          ]}>
            Favoritos ({favorites.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Ionicons 
            name="time" 
            size={20} 
            color={activeTab === 'history' ? colors.primary.main : colors.text.tertiary} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'history' && styles.activeTabText
          ]}>
            Histórico ({history.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'favorites' ? (
          favorites.length === 0 ? (
            renderEmptyState('favorites')
          ) : (
            <View style={styles.trackList}>
              {favorites.map((track, index) => renderTrackItem(track, index, true))}
            </View>
          )
        ) : (
          history.length === 0 ? (
            renderEmptyState('history')
          ) : (
            <>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>Reproduzidos recentemente</Text>
                <TouchableOpacity 
                  onPress={clearHistory}
                  style={styles.clearButton}
                >
                  <Ionicons name="trash-outline" size={16} color={colors.ui.error} />
                  <Text style={styles.clearText}>Limpar</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.trackList}>
                {history.map((track, index) => renderTrackItem(track, index))}
              </View>
            </>
          )
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Stats Card */}
      {(favorites.length > 0 || history.length > 0) && (
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={24} color={colors.primary.main} />
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="time" size={24} color={colors.text.secondary} />
            <Text style={styles.statValue}>{history.length}</Text>
            <Text style={styles.statLabel}>Reproduzidos</Text>
          </View>
        </View>
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
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: colors.background.secondary,
  },
  headerTitle: {
    ...typography.styles.h1,
    color: colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...typography.styles.body2,
    color: colors.text.secondary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.base,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: spacing.radius.md,
    gap: spacing.sm,
    backgroundColor: colors.background.tertiary,
  },
  activeTab: {
    backgroundColor: `${colors.primary.main}20`,
  },
  tabText: {
    ...typography.styles.button,
    color: colors.text.tertiary,
    textTransform: 'none',
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.primary.main,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.massive,
    paddingHorizontal: spacing.xxxl,
  },
  emptyTitle: {
    ...typography.styles.h4,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    ...typography.styles.body2,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  trackList: {
    paddingTop: spacing.base,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.sm,
    borderRadius: spacing.radius.md,
    overflow: 'hidden',
    padding: spacing.sm,
  },
  trackThumbnail: {
    width: 80,
    height: 80,
    borderRadius: spacing.radius.sm,
    backgroundColor: colors.background.elevated,
  },
  trackInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  trackTitle: {
    ...typography.styles.subtitle1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  trackChannel: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
  },
  removeButton: {
    padding: spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.base,
  },
  historyTitle: {
    ...typography.styles.subtitle1,
    color: colors.text.secondary,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
  },
  clearText: {
    ...typography.styles.caption,
    color: colors.ui.error,
    fontWeight: '600',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.screenPadding,
    padding: spacing.lg,
    borderRadius: spacing.radius.md,
    ...spacing.shadows.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.ui.divider,
    marginHorizontal: spacing.base,
  },
  bottomSpacer: {
    height: 180,
  },
});
