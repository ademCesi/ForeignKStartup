import { Platform } from 'react-native';

// Android emulator can't reach the host machine via localhost; 10.0.2.2 is the
// documented alias for it. iOS simulator and web both work with localhost.
const DEFAULT_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${DEFAULT_HOST}:4000`;
