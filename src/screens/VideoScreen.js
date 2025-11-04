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
import * as FileSystem from 'expo-file-system/legacy';
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

  useEffect(() => {
    loadVideos();
  }, []);

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
      
      // Usar DocumentPicker
      const pickerResult = await DocumentPicker.getDocumentAsync({
        type: ['video/*', '*/*'],
        multiple: false,
      });

      console.log('[UPLOAD] Picker result:', JSON.stringify(pickerResult));
      
      // Verificar se cancelou
      if (pickerResult.canceled) {
        console.log('[UPLOAD] Seleção cancelada pelo usuário');
        setUploading(false);
        return;
      }
      
      let file = null;
      
      // Verificar formato de retorno do DocumentPicker v14
      if (pickerResult.assets && pickerResult.assets.length > 0) {
        file = pickerResult.assets[0];
      } else if (pickerResult.uri) {
        file = pickerResult;
      } else {
        throw new Error('Arquivo inválido selecionado - nenhum arquivo encontrado no resultado');
      }
      
      // Validar que o arquivo tem as propriedades necessárias
      if (!file || !file.uri) {
        throw new Error('Arquivo inválido selecionado - URI não encontrada');
      }

      console.log('[UPLOAD] Arquivo selecionado:', {
        name: file.name,
        mimeType: file.mimeType,
        uri: file.uri,
        size: file.size,
      });

      // Garantir que o nome do arquivo está correto
      const fileName = file.name || 'video.mp4';
      
      // Determinar MIME type correto
      let mimeType = file.mimeType || 'video/mp4';
      
      // Se não tiver mimeType, tentar detectar pela extensão
      if (!file.mimeType && fileName) {
        const ext = fileName.toLowerCase().split('.').pop();
        const mimeTypes = {
          'mp4': 'video/mp4',
          'avi': 'video/x-msvideo',
          'mov': 'video/quicktime',
          'mkv': 'video/x-matroska',
          'webm': 'video/webm',
          '3gp': 'video/3gpp',
          'm4v': 'video/x-m4v',
        };
        if (mimeTypes[ext]) {
          mimeType = mimeTypes[ext];
        }
      }

      // CRÍTICO: No Android, URIs content:// não funcionam diretamente
      // Precisamos copiar para o cache do FileSystem que retorna file://
      let fileUri = file.uri;
      console.log('[UPLOAD] URI original:', fileUri);
      
      // Sempre copiar para cache no Android para garantir acesso
      if (Platform.OS === 'android') {
        console.log('[UPLOAD] Android detectado, copiando arquivo para cache...');
        try {
          const timestamp = Date.now();
          const cacheFileName = `${timestamp}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
          const cacheUri = `${FileSystem.cacheDirectory}${cacheFileName}`;
          
          console.log('[UPLOAD] Copiando de:', fileUri);
          console.log('[UPLOAD] Para:', cacheUri);
          
          await FileSystem.copyAsync({
            from: fileUri,
            to: cacheUri,
          });
          
          fileUri = cacheUri;
          console.log('[UPLOAD] ✓ Arquivo copiado com sucesso para cache');
          
          // Verificar se o arquivo foi copiado corretamente
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          if (!fileInfo.exists) {
            throw new Error('Arquivo não foi copiado corretamente para cache');
          }
          console.log('[UPLOAD] Arquivo verificado. Tamanho:', fileInfo.size, 'bytes');
        } catch (copyError) {
          console.error('[UPLOAD] Erro ao copiar arquivo:', copyError);
          throw new Error(`Não foi possível acessar o arquivo: ${copyError.message}`);
        }
      }

      // Preparar FormData - formato correto para React Native
      const formData = new FormData();
      
      // No React Native, o FormData precisa de um objeto com uri, type e name
      // IMPORTANTE: Não usar JSON.stringify ou qualquer outra transformação
      const fileData = {
        uri: fileUri,
        type: mimeType,
        name: fileName,
      };
      formData.append('file', fileData);
      
      formData.append('titulo', uploadForm.titulo.trim());
      if (uploadForm.descricao && uploadForm.descricao.trim()) {
        formData.append('descricao', uploadForm.descricao.trim());
      }
      if (uploadForm.categoria && uploadForm.categoria.trim()) {
        formData.append('categoria', uploadForm.categoria.trim());
      }
      
      console.log('[UPLOAD] FormData preparado com:');
      console.log('[UPLOAD] - Arquivo:', fileName, `(${mimeType})`);
      console.log('[UPLOAD] - URI:', fileUri.substring(0, 80) + '...');
      console.log('[UPLOAD] - Título:', uploadForm.titulo);

      console.log('[UPLOAD] Enviando para:', `${API_BASE}/videos/upload`);
      console.log('[UPLOAD] Token:', token ? token.substring(0, 20) + '...' : 'SEM TOKEN');
      console.log('[UPLOAD] Platform:', Platform.OS);
             console.log('[UPLOAD] File URI final:', fileUri);
       console.log('[UPLOAD] File name:', fileName);
       console.log('[UPLOAD] File type:', mimeType);

      // Teste de conectividade antes do upload (apenas verificar se backend responde)
      try {
        console.log('[UPLOAD] Testando conectividade com o backend...');
        await axios.get(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        });
        console.log('[UPLOAD] ✓ Backend acessível');
      } catch (connectError) {
        console.warn('[UPLOAD] ⚠ Aviso: Não foi possível conectar ao backend, mas tentando upload mesmo assim...');
        // Continuar mesmo assim, pode ser que o endpoint de upload funcione
      }

      // Validar token antes do upload
      if (!token) {
        throw new Error('Você precisa estar autenticado para fazer upload. Faça login novamente.');
      }

      // Upload usando fetch nativo (melhor para arquivos grandes no Android)
      console.log('[UPLOAD] Iniciando upload para:', `${API_BASE}/videos/upload`);
      console.log('[UPLOAD] Tamanho do arquivo:', file.size, 'bytes (', (file.size / 1024 / 1024).toFixed(2), 'MB)');
      
      // Usar fetch nativo - funciona melhor para arquivos grandes no React Native
      const uploadResponse = await fetch(`${API_BASE}/videos/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          // NÃO definir Content-Type - fetch define automaticamente para FormData
        },
        body: formData,
      });

      console.log('[UPLOAD] Status da resposta:', uploadResponse.status);
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('[UPLOAD] Erro do servidor:', errorText);
        throw new Error(`Erro ${uploadResponse.status}: ${errorText}`);
      }

      const responseData = await uploadResponse.json();
      console.log('[UPLOAD] ✓ Upload bem-sucedido!', responseData);

      Alert.alert('Sucesso!', 'Vídeo enviado com sucesso');
      setShowUploadModal(false);
      setUploadForm({ titulo: '', descricao: '', categoria: '' });
      loadVideos();
      
    } catch (error) {
      console.error('[UPLOAD] ========== ERRO DETALHADO ==========');
      console.error('[UPLOAD] Erro completo:', error);
      console.error('[UPLOAD] Código:', error.code);
             console.error('[UPLOAD] Mensagem:', error.message);
       console.error('[UPLOAD] Stack:', error.stack);
       console.error('[UPLOAD] Response data:', error.response?.data);
       console.error('[UPLOAD] Response status:', error.response?.status);
       
       // Verificar se o erro está relacionado ao arquivo
       if (error.message?.includes('file') || error.message?.includes('File') || error.message?.includes('URI')) {
         console.error('[UPLOAD] Erro relacionado ao arquivo detectado');
       }
      console.error('[UPLOAD] API_BASE:', API_BASE);
      console.error('[UPLOAD] URL completa:', `${API_BASE}/videos/upload`);
      console.error('[UPLOAD] Platform:', Platform.OS);
      console.error('[UPLOAD] ======================================');
      
      let errorMsg = 'Erro desconhecido';
      
      if (error.code === 'ECONNABORTED') {
        errorMsg = 'Timeout - O upload demorou muito. Tente novamente.';
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.message?.includes('Network request failed')) {
        errorMsg = `Erro de conexão (Network Error).\n\nSOLUÇÕES:\n\n1. Verifique se o backend está rodando:\n   cd backend && python main.py\n\n2. Confirme o IP correto em src/config.js\n   IP atual: ${API_BASE}\n\n3. Se usando API local:\n   • Celular e PC devem estar na MESMA rede Wi-Fi\n   • Verifique firewall do Windows (rode LIBERAR_FIREWALL.bat)\n   • Teste o IP no navegador: ${API_BASE}/docs\n\n4. Se o erro persistir, tente:\n   • Reiniciar o backend\n   • Reiniciar o app\n   • Verificar se o IP do PC mudou`;
      } else if (!error.response && error.request) {
        errorMsg = `Sem resposta do servidor.\n\nA API pode estar offline ou inacessível.\n\nURL tentada: ${API_BASE}/videos/upload\n\nVerifique:\n• Backend está rodando?\n• Firewall bloqueando porta 8000?\n• Mesma rede Wi-Fi?`;
      } else if (error.response?.status === 401) {
        errorMsg = 'Não autorizado - Token expirado ou inválido.\n\nPor favor:\n• Faça logout\n• Faça login novamente\n• Tente fazer o upload novamente';
      } else if (error.response?.status === 413) {
        errorMsg = 'Arquivo muito grande. Tente um arquivo menor.';
      } else if (error.response?.status === 400) {
        const detail = error.response.data?.detail || 'Dados inválidos';
        errorMsg = `Erro de validação: ${detail}\n\nVerifique:\n• Título está preenchido?\n• Arquivo foi selecionado corretamente?\n• Arquivo não está corrompido?`;
       } else if (error.response?.status === 422) {
         errorMsg = 'Arquivo inválido ou corrompido. Tente selecionar outro arquivo.';
       } else if (error.response) {
        errorMsg = error.response.data?.detail || `Erro ${error.response.status}: ${error.response.statusText}`;
      } else {
        errorMsg = error.message || 'Erro desconhecido ao fazer upload';
      }
      
      Alert.alert('Erro no Upload', errorMsg);
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
    // Normalizar caminho - NÃO fazer encoding se já contém % (arquivo pode ter %20 literal)
    const normalizedPath = video.arquivo_path.replace(/\\/g, '/');
    
    // Se o caminho já contém % (como %20), usar diretamente sem encoding adicional
    // Isso evita double-encoding que causaria 404
    const fileUrl = normalizedPath.includes('%') 
      ? `${API_BASE}/uploads/${normalizedPath}`
      : `${API_BASE}/uploads/${normalizedPath.split('/').map(segment => encodeURIComponent(segment)).join('/')}`;
    
    const track = {
      videoId: video.id.toString(),
      title: video.titulo,
      channel: video.descricao || 'Sem descrição',
      thumbnail: null,
      fileUrl: fileUrl
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
