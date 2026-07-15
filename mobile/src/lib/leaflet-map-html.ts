export type MapPin = { id: number; name: string; lat: number; lng: number };

const SEOUL_FALLBACK = { lat: 37.5665, lng: 126.978 };

// Leaflet + OpenStreetMap tiles: no API key required, works the same
// embedded in a WebView (native) or an iframe (web).
export function buildMapHtml(pins: MapPin[]) {
  const center = pins.length
    ? {
        lat: pins.reduce((sum, p) => sum + p.lat, 0) / pins.length,
        lng: pins.reduce((sum, p) => sum + p.lng, 0) / pins.length,
      }
    : SEOUL_FALLBACK;
  const zoom = pins.length > 1 ? 10 : 13;
  const markers = pins
    .map((p) => `L.marker([${p.lat}, ${p.lng}]).addTo(map).bindPopup(${JSON.stringify(p.name)});`)
    .join('\n');

  return `<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>html, body, #map { height: 100%; margin: 0; padding: 0; }</style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map').setView([${center.lat}, ${center.lng}], ${zoom});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);
    ${markers}
  </script>
</body>
</html>`;
}
