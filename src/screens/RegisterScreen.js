import React, { useState, useContext } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { colors, typography, spacing } from '../theme';

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!email || !username || !password || !confirmPassword) {
      alert('Preencha todos os campos!');
      return;
    }

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (password.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres!');
      return;
    }

    setLoading(true);
    try {
      await register(email, username, password);
      alert('Conta criada com sucesso!');
      navigation.navigate('Login');
    } catch (e) {
      console.error('Erro ao registrar:', e);
      alert('Erro ao criar conta: ' + (e.response?.data?.detail || e.message));
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
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo and Title */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="person-add" size={48} color={colors.primary.main} />
            </View>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Preencha os dados abaixo</Text>
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

            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
              <TextInput 
                placeholder="Nome de usuário" 
                placeholderTextColor={colors.text.tertiary}
                value={username} 
                onChangeText={setUsername} 
                autoCapitalize="none"
                style={styles.input} 
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
              <TextInput 
                placeholder="Senha (mínimo 6 caracteres)" 
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

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
              <TextInput 
                placeholder="Confirmar senha" 
                placeholderTextColor={colors.text.tertiary}
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                secureTextEntry={!showConfirmPassword}
                style={styles.input} 
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={colors.text.tertiary} 
                />
              </TouchableOpacity>
            </View>
            
            {/* Register Button */}
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={handleRegister} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.primary.contrast} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary.contrast} />
                  <Text style={styles.primaryButtonText}>Criar Conta</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Terms */}
            <Text style={styles.termsText}>
              Ao criar uma conta, você concorda com nossos{' '}
              <Text style={styles.termsLink}>Termos de Uso</Text>
              {' '}e{' '}
              <Text style={styles.termsLink}>Política de Privacidade</Text>
            </Text>

            {/* Back to Login */}
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back-outline" size={20} color={colors.text.secondary} />
              <Text style={styles.loginText}>Já tem uma conta? Fazer login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.screenPadding,
    paddingTop: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
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
  termsText: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  loginText: {
    ...typography.styles.body2,
    color: colors.text.secondary,
  },
});
