import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { Radius } from '@/constants/theme';
import { buildMapHtml, type MapPin } from '@/lib/leaflet-map-html';

export function OfficesMap({ pins }: { pins: MapPin[] }) {
  if (!pins.length) return null;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: buildMapHtml(pins) }}
      style={styles.map}
    />
  );
}

const styles = StyleSheet.create({
  map: { height: 220, borderRadius: Radius.card, overflow: 'hidden' },
});
