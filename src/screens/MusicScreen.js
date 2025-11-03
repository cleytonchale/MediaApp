import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  Modal,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { AuthContext } from '../context/AuthContext';
import { PlayerContext } from '../context/PlayerContext';
import axios from 'axios';
import { colors, typography, spacing } from '../theme';
import API_BASE from '../config';

export default function MusicScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const { playNow, addToQueue, isFavorite, toggleFavorite, setFullQueue } = useContext(PlayerContext);
  const [musicas, setMusicas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form de upload
  const [uploadForm, setUploadForm] = useState({
    titulo: '',
    artista: '',
    album: '',
    genero: ''
  });

  useEffect(() => {
    loadMusicas();
  }, []);

  const loadMusicas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/musicas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMusicas(response.data.musicas || []);
    } catch (error) {
      console.error('Erro ao carregar músicas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as músicas');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    // Validar campos
    if (!uploadForm.titulo.trim() || !uploadForm.artista.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha Título e Artista');
      return;
    }

    // Selecionar arquivo
    setUploading(true);
    try {
      console.log('[UPLOAD] Iniciando seleção de arquivo...');
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/x-ms-wma'],
        copyToCacheDirectory: true,  // IMPORTANTE: true para uploads funcionarem
      });

      if (result.type === 'cancel') {
        setUploading(false);
        return;
      }

      console.log('[UPLOAD] Arquivo selecionado:', result.name, result.mimeType, 'URI:', result.uri);

      // Preparar FormData
      const formData = new FormData();
      formData.append('file', {
        uri: result.uri,
        type: result.mimeType,
        name: result.name,
      });
      formData.append('titulo', uploadForm.titulo);
      formData.append('artista', uploadForm.artista);
      formData.append('album', uploadForm.album);
      formData.append('genero', uploadForm.genero);

      console.log('[UPLOAD] Enviando para:', `${API_BASE}/musicas/upload`);
      console.log('[UPLOAD] Token:', token ? token.substring(0, 20) + '...' : 'SEM TOKEN');

      // Upload - NÃO definir Content-Type manualmente, axios faz isso automaticamente
      await axios.post(`${API_BASE}/musicas/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 300000, // 5 minutos para uploads grandes
      });
      
      console.log('[UPLOAD] Sucesso!');

      Alert.alert('Sucesso!', 'Música enviada com sucesso');
      setShowUploadModal(false);
      setUploadForm({ titulo: '', artista: '', album: '', genero: '' });
      loadMusicas();
      
    } catch (error) {
      console.error('[UPLOAD] ERRO COMPLETO:', error);
      console.error('[UPLOAD] Response:', error.response?.data);
      console.error('[UPLOAD] Status:', error.response?.status);
      Alert.alert('Erro', `Não foi possível enviar a música: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (musicaId) => {
    Alert.alert(
      'Confirmar',
      'Tem certeza que deseja deletar esta música?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE}/musicas/${musicaId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              loadMusicas();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar a música');
            }
          }
        }
      ]
    );
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

  const handleToggleFavorite = (musica) => {
    const track = {
      videoId: musica.id.toString(),
      title: musica.titulo,
      channel: musica.artista,
      thumbnail: null
    };
    toggleFavorite(track);
  };

  const filteredMusicas = searchQuery.trim() 
    ? musicas.filter(m => 
        m.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.artista.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : musicas;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Música</Text>
        <Text style={styles.headerSubtitle}>Sua biblioteca de músicas</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar músicas..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => setShowUploadModal(true)}
        >
          <Ionicons name="cloud-upload" size={20} color={colors.primary.contrast} />
        </TouchableOpacity>
      </View>

      {/* Lista de Músicas */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={styles.loadingText}>Carregando músicas...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredMusicas.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="musical-notes-outline" size={80} color={colors.text.tertiary} />
              <Text style={styles.emptyText}>Nenhuma música ainda</Text>
              <Text style={styles.emptySubtext}>Faça upload da sua primeira música!</Text>
            </View>
          ) : (
            filteredMusicas.map((musica) => {
              const isInFavorites = isFavorite(musica.id.toString());
              return (
                <TouchableOpacity
                  key={musica.id}
                  style={styles.musicaCard}
                  onPress={() => playMusica(musica)}
                >
                  <View style={styles.musicaInfo}>
                    <View style={styles.musicaIcon}>
                      <Ionicons name="musical-note" size={32} color={colors.primary.main} />
                    </View>
                    <View style={styles.musicaText}>
                      <Text style={styles.musicaTitle} numberOfLines={1}>
                        {musica.titulo}
                      </Text>
                      <Text style={styles.musicaArtist} numberOfLines={1}>
                        {musica.artista} {musica.album ? `• ${musica.album}` : ''}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.musicaActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(musica);
                      }}
                    >
                      <Ionicons 
                        name={isInFavorites ? "heart" : "heart-outline"} 
                        size={24} 
                        color={isInFavorites ? colors.primary.main : colors.text.secondary} 
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDelete(musica.id);
                      }}
                    >
                      <Ionicons name="trash-outline" size={24} color={colors.secondary.main} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      {/* Modal de Upload */}
      <Modal
        visible={showUploadModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload de Música</Text>
              <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                <Ionicons name="close" size={28} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Título *</Text>
                <TextInput
                  style={styles.input}
                  value={uploadForm.titulo}
                  onChangeText={(text) => setUploadForm({...uploadForm, titulo: text})}
                  placeholder="Nome da música"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Artista *</Text>
                <TextInput
                  style={styles.input}
                  value={uploadForm.artista}
                  onChangeText={(text) => setUploadForm({...uploadForm, artista: text})}
                  placeholder="Nome do artista"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Álbum</Text>
                <TextInput
                  style={styles.input}
                  value={uploadForm.album}
                  onChangeText={(text) => setUploadForm({...uploadForm, album: text})}
                  placeholder="Nome do álbum (opcional)"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Gênero</Text>
                <TextInput
                  style={styles.input}
                  value={uploadForm.genero}
                  onChangeText={(text) => setUploadForm({...uploadForm, genero: text})}
                  placeholder="Gênero (opcional)"
                />
              </View>

              <TouchableOpacity
                style={styles.uploadSubmitButton}
                onPress={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator color={colors.primary.contrast} />
                ) : (
                  <>
                    <Ionicons name="cloud-upload" size={20} color={colors.primary.contrast} />
                    <Text style={styles.uploadSubmitText}>Enviar</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  searchSection: {
    flexDirection: 'row',
    padding: spacing.screenPadding,
    backgroundColor: colors.background.secondary,
    gap: spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: spacing.radius.md,
    paddingHorizontal: spacing.md,
    height: spacing.inputHeight,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.styles.body1,
    color: colors.text.primary,
  },
  uploadButton: {
    width: spacing.inputHeight,
    height: spacing.inputHeight,
    backgroundColor: colors.primary.main,
    borderRadius: spacing.radius.md,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
    marginTop: spacing.huge,
  },
  emptyText: {
    ...typography.styles.h4,
    color: colors.text.secondary,
    marginTop: spacing.lg,
  },
  emptySubtext: {
    ...typography.styles.body2,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  musicaCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    marginHorizontal: spacing.screenPadding,
    marginVertical: spacing.xs,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  musicaInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicaIcon: {
    width: 50,
    height: 50,
    borderRadius: spacing.radius.md,
    backgroundColor: colors.primary.main + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  musicaText: {
    flex: 1,
  },
  musicaTitle: {
    ...typography.styles.subtitle1,
    color: colors.text.primary,
    marginBottom: 4,
  },
  musicaArtist: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  musicaActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.sm,
  },
  bottomSpacer: {
    height: 150,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: spacing.radius.xl,
    borderTopRightRadius: spacing.radius.xl,
    paddingTop: spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  modalForm: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.styles.subtitle2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.tertiary,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    ...typography.styles.body1,
    color: colors.text.primary,
  },
  uploadSubmitButton: {
    backgroundColor: colors.primary.main,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  uploadSubmitText: {
    ...typography.styles.button,
    color: colors.primary.contrast,
    fontWeight: '600',
  },
});
