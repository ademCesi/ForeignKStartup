import { Radius } from '@/constants/theme';
import { buildMapHtml, type MapPin } from '@/lib/leaflet-map-html';

export function OfficesMap({ pins }: { pins: MapPin[] }) {
  if (!pins.length) return null;

  return (
    <iframe
      srcDoc={buildMapHtml(pins)}
      style={{ height: 220, borderRadius: Radius.card, border: 0, width: '100%' }}
    />
  );
}
