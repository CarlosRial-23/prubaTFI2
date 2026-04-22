import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ursula-2026',
  webDir: 'www',
  
  backgroundColor: '#325172',

  plugins: {
    Keyboard: {
      resize: 'none',
    },
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#325172',
      showSpinner: false,
    }
  }
};

export default config;