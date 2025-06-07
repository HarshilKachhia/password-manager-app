import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.charisluxgifting.app',
  appName: 'charis_lux_gifting',
  webDir: 'www',
  plugins: {
    StatusBar: {
      backgroundColor: '#FFFFFF',
      style: 'light',
      overlaysWebView: false
    }
  },
};

export default config;
