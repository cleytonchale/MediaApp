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

export default function VideoScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const { playNow, addToQueue, isFavorite, toggleFavorite } = useContext(PlayerContext);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form de upload
  const [uploadForm, setUploadForm] = useState({
    titulo: '',
    descricao: '',
    categoria: ''
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/videos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVideos(response.data.videos || []);
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os vídeos');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    // Validar campos
    if (!uploadForm.titulo.trim()) {
      Alert.alert('Campo obrigatório', 'Preencha o Título');
      return;
    }

    // Selecionar arquivo
    setUploading(true);
    try {
      console.log('[UPLOAD] Iniciando seleção de arquivo...');
      const result = await DocumentPicker.getDocumentAsync({
        type: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
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
      formData.append('descricao', uploadForm.descricao);
      formData.append('categoria', uploadForm.categoria);

      console.log('[UPLOAD] Enviando para:', `${API_BASE}/videos/upload`);
      console.log('[UPLOAD] Token:', token ? token.substring(0, 20) + '...' : 'SEM TOKEN');

      // Upload - NÃO definir Content-Type manualmente, axios faz isso automaticamente
      await axios.post(`${API_BASE}/videos/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 300000, // 5 minutos para uploads grandes
      });
      
      console.log('[UPLOAD] Sucesso!');

      Alert.alert('Sucesso!', 'Vídeo enviado com sucesso');
      setShowUploadModal(false);
      setUploadForm({ titulo: '', descricao: '', categoria: '' });
      loadVideos();
      
    } catch (error) {
      console.error('[UPLOAD] ERRO COMPLETO:', error);
      console.error('[UPLOAD] Response:', error.response?.data);
      console.error('[UPLOAD] Status:', error.response?.status);
      Alert.alert('Erro', `Não foi possível enviar o vídeo: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (videoId) => {
    Alert.alert(
      'Confirmar',
      'Tem certeza que deseja deletar este vídeo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE}/videos/${videoId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              loadVideos();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar o vídeo');
            }
          }
        }
      ]
    );
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

  const handleToggleFavorite = (video) => {
    const track = {
      videoId: video.id.toString(),
      title: video.titulo,
      channel: video.descricao || 'Sem descrição',
      thumbnail: null
    };
    toggleFavorite(track);
  };

  const filteredVideos = searchQuery.trim() 
    ? videos.filter(v => 
        v.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.descricao && v.descricao.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : videos;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vídeo</Text>
        <Text style={styles.headerSubtitle}>Sua biblioteca de vídeos</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar vídeos..."
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
          <Ionicons name="cloud-upload" size={20} color={colors.secondary.contrast} />
        </TouchableOpacity>
      </View>

      {/* Lista de Vídeos */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary.main} />
          <Text style={styles.loadingText}>Carregando vídeos...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredVideos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="videocam-outline" size={80} color={colors.text.tertiary} />
              <Text style={styles.emptyText}>Nenhum vídeo ainda</Text>
              <Text style={styles.emptySubtext}>Faça upload do seu primeiro vídeo!</Text>
            </View>
          ) : (
            filteredVideos.map((video) => {
              const isInFavorites = isFavorite(video.id.toString());
              return (
                <TouchableOpacity
                  key={video.id}
                  style={styles.videoCard}
                  onPress={() => playVideo(video)}
                >
                  <View style={styles.videoThumbnail}>
                    <Ionicons name="play-circle" size={64} color="rgba(255,255,255,0.9)" />
                  </View>
                  
                  <View style={styles.videoInfo}>
                    <View style={styles.videoText}>
                      <Text style={styles.videoTitle} numberOfLines={2}>
                        {video.titulo}
                      </Text>
                      {video.descricao && (
                        <Text style={styles.videoDesc} numberOfLines={2}>
                          {video.descricao}
                        </Text>
                      )}
                      {video.categoria && (
                        <Text style={styles.videoCategory}>
                          {video.categoria}
                        </Text>
                      )}
                    </View>
                    
                    <View style={styles.videoActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(video);
                        }}
                      >
                        <Ionicons 
                          name={isInFavorites ? "heart" : "heart-outline"} 
                          size={20} 
                          color={isInFavorites ? colors.secondary.main : colors.text.secondary} 
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleDelete(video.id);
                        }}
                      >
                        <Ionicons name="trash-outline" size={20} color={colors.secondary.main} />
                      </TouchableOpacity>
                    </View>
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
              <Text style={styles.modalTitle}>Upload de Vídeo</Text>
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
                  placeholder="Nome do vídeo"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Descrição</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={uploadForm.descricao}
                  onChangeText={(text) => setUploadForm({...uploadForm, descricao: text})}
                  placeholder="Descrição do vídeo (opcional)"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Categoria</Text>
                <TextInput
                  style={styles.input}
                  value={uploadForm.categoria}
                  onChangeText={(text) => setUploadForm({...uploadForm, categoria: text})}
                  placeholder="Categoria (opcional)"
                />
              </View>

              <TouchableOpacity
                style={styles.uploadSubmitButton}
                onPress={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator color={colors.secondary.contrast} />
                ) : (
                  <>
                    <Ionicons name="cloud-upload" size={20} color={colors.secondary.contrast} />
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
    backgroundColor: colors.secondary.main,
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
  videoCard: {
    backgroundColor: colors.background.tertiary,
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
    borderRadius: spacing.radius.md,
    overflow: 'hidden',
  },
  videoThumbnail: {
    height: 200,
    backgroundColor: colors.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: spacing.md,
  },
  videoText: {
    marginBottom: spacing.sm,
  },
  videoTitle: {
    ...typography.styles.subtitle1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  videoDesc: {
    ...typography.styles.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  videoCategory: {
    ...typography.styles.caption,
    color: colors.secondary.main,
  },
  videoActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.base,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadSubmitButton: {
    backgroundColor: colors.secondary.main,
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
    color: colors.secondary.contrast,
    fontWeight: '600',
  },
});
