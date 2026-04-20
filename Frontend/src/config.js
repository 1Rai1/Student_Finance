import Constants from 'expo-constants';

const getApiBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const host = debuggerHost.split(':')[0];
    return `http://${host}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

export const API_BASE = getApiBaseUrl();

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCPzukvXxvlWCllzOtiZT28P6ZmkDDgQ44',
  authDomain: 'studifi-5e9a4.firebaseapp.com',
  projectId: 'studifi-5e9a4'
};

export default API_BASE;
