/**
 * Sistema de Tipografia Profissional
 * Hierarchy consistente para todo o aplicativo
 */

export const typography = {
  // Font Families
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },
  
  // Font Weights
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },
  
  // Font Sizes
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 32,
    hero: 40,
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
  
  // Predefined Text Styles
  styles: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 36,
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
      letterSpacing: 0,
    },
    h5: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
      letterSpacing: 0,
    },
    h6: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 22,
      letterSpacing: 0,
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    subtitle2: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    body1: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      letterSpacing: 0.5,
    },
    body2: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    button: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20,
      letterSpacing: 1.25,
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
      letterSpacing: 0.4,
    },
    overline: {
      fontSize: 10,
      fontWeight: '600',
      lineHeight: 16,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
  },
};

export default typography;

