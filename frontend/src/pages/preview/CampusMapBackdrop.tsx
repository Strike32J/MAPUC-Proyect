interface CampusMapBackdropProps {
  className?: string
}

// Mapa abstracto del campus (no cartografía real) solo para dar fondo visual
// a las dos previews de styles.md. El mapa definitivo llegará vía MapLibre/PMTiles.
export function CampusMapBackdrop({ className }: CampusMapBackdropProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="400" height="300" className="map-ground" />

      <ellipse cx="70" cy="230" rx="55" ry="34" className="map-green" />
      <ellipse cx="330" cy="70" rx="46" ry="30" className="map-green" />
      <ellipse cx="205" cy="255" rx="34" ry="18" className="map-green" />

      <path
        d="M0 150 H400 M120 0 V300 M260 0 V300 M0 90 H400 M0 210 H400"
        className="map-path map-path--minor"
      />
      <path
        d="M120 0 V300 M0 150 H400"
        className="map-path map-path--major"
      />

      <rect x="30" y="40" width="70" height="46" rx="6" className="map-building" />
      <rect x="150" y="30" width="90" height="50" rx="6" className="map-building" />
      <rect x="150" y="100" width="60" height="70" rx="6" className="map-building" />
      <rect x="230" y="120" width="80" height="56" rx="6" className="map-building" />
      <rect x="60" y="120" width="46" height="60" rx="6" className="map-building" />
      <rect x="290" y="180" width="70" height="50" rx="6" className="map-building" />
      <rect x="150" y="190" width="90" height="46" rx="6" className="map-building" />

      <path
        d="M65 86 L65 120 M195 80 L195 100 M180 170 L180 190 M270 176 L290 190 M106 150 L150 150"
        className="map-path map-path--walk"
      />
    </svg>
  )
}
