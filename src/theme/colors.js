/**
 * Sistema de Cores Profissional
 * Paleta inspirada em apps modernos como Spotify e YouTube Music
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    main: '#1DB954',      // Verde vibrante (estilo Spotify)
    light: '#1ED760',
    dark: '#169C46',
    contrast: '#FFFFFF',
  },
  
  // Secondary Colors
  secondary: {
    main: '#FF0000',      // Vermelho (para vídeos)
    light: '#FF3333',
    dark: '#CC0000',
    contrast: '#FFFFFF',
  },
  
  // Background Colors
  background: {
    primary: '#121212',   // Fundo principal escuro
    secondary: '#181818', // Fundo secundário
    tertiary: '#282828',  // Cards e elementos elevados
    elevated: '#2A2A2A',  // Elementos mais elevados
    paper: '#1E1E1E',     // Paper/modal background
  },
  
  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
    tertiary: '#808080',
    disabled: '#535353',
    link: '#1DB954',
  },
  
  // UI Colors
  ui: {
    border: '#282828',
    divider: '#2A2A2A',
    hover: '#2A2A2A',
    focus: '#1DB954',
    disabled: '#3E3E3E',
    error: '#E22134',
    success: '#1DB954',
    warning: '#FFA726',
    info: '#3B82F6',
  },
  
  // Music Theme
  music: {
    primary: '#1DB954',
    secondary: '#1ED760',
    background: '#121212',
    card: '#181818',
  },
  
  // Video Theme
  video: {
    primary: '#FF0000',
    secondary: '#FF3333',
    background: '#0F0F0F',
    card: '#282828',
  },
  
  // Gradient Colors
  gradients: {
    primary: ['#1DB954', '#169C46'],
    secondary: ['#FF0000', '#CC0000'],
    dark: ['#1E1E1E', '#121212'],
    music: ['#1DB954', '#1ED760', '#169C46'],
    video: ['#FF0000', '#FF3333', '#CC0000'],
  },
  
  // Status Colors
  status: {
    online: '#1DB954',
    offline: '#808080',
    away: '#FFA726',
    busy: '#E22134',
  },
  
  // Overlay Colors
  overlay: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.5)',
    darker: 'rgba(0, 0, 0, 0.7)',
    darkest: 'rgba(0, 0, 0, 0.9)',
  },
};

export default colors;

