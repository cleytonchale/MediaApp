/**
 * Sistema de Tema Profissional
 * Exporta todos os recursos de tema do aplicativo
 */

import colors from './colors';
import typography from './typography';
import spacing from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  
  // Quick access helpers
  isDark: true,
  
  // Common component styles
  components: {
    card: {
      backgroundColor: colors.background.tertiary,
      borderRadius: spacing.radius.md,
      padding: spacing.base,
      ...spacing.shadows.md,
    },
    button: {
      primary: {
        backgroundColor: colors.primary.main,
        color: colors.primary.contrast,
        borderRadius: spacing.radius.full,
        height: spacing.buttonHeight,
        paddingHorizontal: spacing.xl,
        ...typography.styles.button,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary.main,
        color: colors.primary.main,
        borderRadius: spacing.radius.full,
        height: spacing.buttonHeight,
        paddingHorizontal: spacing.xl,
        ...typography.styles.button,
      },
      text: {
        backgroundColor: 'transparent',
        color: colors.text.primary,
        borderRadius: spacing.radius.full,
        height: spacing.buttonHeight,
        paddingHorizontal: spacing.xl,
        ...typography.styles.button,
      },
    },
    input: {
      backgroundColor: colors.background.tertiary,
      borderRadius: spacing.radius.md,
      height: spacing.inputHeight,
      paddingHorizontal: spacing.base,
      color: colors.text.primary,
      borderWidth: 1,
      borderColor: colors.ui.border,
      ...typography.styles.body1,
    },
  },
};

export { colors, typography, spacing };
export default theme;

