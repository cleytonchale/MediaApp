import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { colors, typography, spacing } from '../theme';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout }
      ]
    );
  };

  const handleUploadMusic = () => {
    Alert.alert(
      'Upload de Música',
      'Funcionalidade de upload em desenvolvimento.\n\nEm breve você poderá fazer upload de suas próprias músicas!',
      [{ text: 'OK' }]
    );
  };

  const handleUploadVideo = () => {
    Alert.alert(
      'Upload de Vídeo',
      'Funcionalidade de upload em desenvolvimento.\n\nEm breve você poderá fazer upload de seus próprios vídeos!',
      [{ text: 'OK' }]
    );
  };

  const menuItems = [
    {
      icon: 'musical-note',
      title: 'Upload de Música',
      subtitle: 'Adicione suas próprias músicas',
      onPress: handleUploadMusic,
      color: colors.primary.main,
    },
    {
      icon: 'videocam',
      title: 'Upload de Vídeo',
      subtitle: 'Adicione seus próprios vídeos',
      onPress: handleUploadVideo,
      color: colors.secondary.main,
    },
    {
      icon: 'settings',
      title: 'Configurações',
      subtitle: 'Personalize seu aplicativo',
      onPress: () => Alert.alert('Em desenvolvimento', 'Configurações estarão disponíveis em breve!'),
      color: colors.text.secondary,
    },
    {
      icon: 'help-circle',
      title: 'Ajuda e Suporte',
      subtitle: 'Tire suas dúvidas',
      onPress: () => Alert.alert('Ajuda', 'Suporte técnico disponível em breve!'),
      color: colors.text.secondary,
    },
    {
      icon: 'information-circle',
      title: 'Sobre',
      subtitle: 'Versão 1.0.0',
      onPress: () => Alert.alert('Media Player', 'Versão 1.0.0\n\nAplicativo profissional de música e vídeo.'),
      color: colors.text.secondary,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color={colors.text.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.username || 'Convidado'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'guest@app.com'}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="musical-notes" size={24} color={colors.primary.main} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Músicas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="play-circle" size={24} color={colors.secondary.main} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Vídeos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="heart" size={24} color={colors.ui.error} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Geral</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast
              ]}
              onPress={item.onPress}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={colors.ui.error} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

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
  header: {
    paddingTop: 50,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: colors.background.secondary,
  },
  headerTitle: {
    ...typography.styles.h1,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    marginHorizontal: spacing.screenPadding,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: spacing.radius.md,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.styles.body2,
    color: colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    marginHorizontal: spacing.screenPadding,
    marginTop: spacing.base,
    padding: spacing.lg,
    borderRadius: spacing.radius.md,
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
    marginHorizontal: spacing.sm,
  },
  menuSection: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.screenPadding,
  },
  sectionTitle: {
    ...typography.styles.overline,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    padding: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  menuItemLast: {
    borderBottomLeftRadius: spacing.radius.md,
    borderBottomRightRadius: spacing.radius.md,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: spacing.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    ...typography.styles.subtitle1,
    color: colors.text.primary,
    marginBottom: 2,
  },
  menuSubtitle: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.tertiary,
    marginHorizontal: spacing.screenPadding,
    marginTop: spacing.xl,
    padding: spacing.base,
    borderRadius: spacing.radius.md,
    gap: spacing.sm,
  },
  logoutText: {
    ...typography.styles.button,
    color: colors.ui.error,
    textTransform: 'none',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 150,
  },
});

