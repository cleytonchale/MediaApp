import React, { useState, useContext } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { colors, typography, spacing } from '../theme';

export default function LoginScreen({ navigation }) {
  const { login, guest } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Preencha todos os campos!');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Tentando fazer login...');
      await login(email, password);
      console.log('Login realizado!');
    } catch (e) {
      console.error('ERRO LOGIN:', e);
      console.error('Erro response:', e.response?.data);
      alert('Erro no login: ' + (e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      console.log('Clicou em convidado...');
      await guest();
      console.log('Convidado OK!');
    } catch (e) {
      console.error('ERRO COMPLETO:', e);
      console.error('Erro detalhes:', e.response?.data);
      alert('Erro convidado: ' + (e.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="musical-notes" size={48} color={colors.primary.main} />
            </View>
            <Text style={styles.title}>Media Player</Text>
            <Text style={styles.subtitle}>Entre na sua conta </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
              <TextInput 
                placeholder="Email" 
                placeholderTextColor={colors.text.tertiary}
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input} 
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
              <TextInput 
                placeholder="Senha" 
                placeholderTextColor={colors.text.tertiary}
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry={!showPassword}
                style={styles.input} 
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={colors.text.tertiary} 
                />
              </TouchableOpacity>
            </View>
            
            {/* Login Button */}
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={handleLogin} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.primary.contrast} />
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={20} color={colors.primary.contrast} />
                  <Text style={styles.primaryButtonText}>Entrar</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Guest Button */}
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={handleGuest} 
              disabled={loading}
            >
              <Ionicons name="person-outline" size={20} color={colors.text.primary} />
              <Text style={styles.secondaryButtonText}>Continuar como convidado</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.divider} />
            </View>

            {/* Register Link */}
            <TouchableOpacity 
              style={styles.registerButton} 
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerText}>
                Não tem uma conta? <Text style={styles.registerTextBold}>Criar conta</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.screenPadding,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.huge,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  title: {
    ...typography.styles.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.styles.body1,
    color: colors.text.secondary,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: spacing.radius.md,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.ui.border,
    height: spacing.inputHeight,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.styles.body1,
    color: colors.text.primary,
  },
  eyeIcon: {
    padding: spacing.xs,
  },
  button: {
    flexDirection: 'row',
    height: spacing.buttonHeight,
    borderRadius: spacing.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
    marginTop: spacing.lg,
    ...spacing.shadows.md,
  },
  primaryButtonText: {
    ...typography.styles.button,
    color: colors.primary.contrast,
    textTransform: 'none',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  secondaryButtonText: {
    ...typography.styles.button,
    color: colors.text.primary,
    textTransform: 'none',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.ui.divider,
  },
  dividerText: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginHorizontal: spacing.base,
  },
  registerButton: {
    alignItems: 'center',
    padding: spacing.md,
  },
  registerText: {
    ...typography.styles.body2,
    color: colors.text.secondary,
  },
  registerTextBold: {
    color: colors.primary.main,
    fontWeight: '600',
  },
});
