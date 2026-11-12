export interface PublicSpec {
  id: string
  label: string
  value: string
  source: string
  confidence: 'high' | 'medium' | 'low'
}

export const PUBLIC_SPECS: PublicSpec[] = [
  {
    id: 'model',
    label: 'Model',
    value: 'Bajaj Dominar 250',
    source: 'Bajaj Auto product literature (public)',
    confidence: 'high',
  },
  {
    id: 'engine-layout',
    label: 'Engine',
    value: 'Liquid-cooled SOHC 4-valve single',
    source: 'Bajaj Auto product literature (public)',
    confidence: 'high',
  },
  {
    id: 'displacement',
    label: 'Displacement',
    value: '248.77 cc',
    source: 'Bajaj Auto product literature (public)',
    confidence: 'high',
  },
  {
    id: 'gearbox',
    label: 'Transmission',
    value: '6-speed constant mesh',
    source: 'Bajaj Auto product literature (public)',
    confidence: 'high',
  },
  {
    id: 'frame',
    label: 'Frame',
    value: 'Twin-spar perimeter (steel)',
    source: 'Bajaj Auto product literature (public)',
    confidence: 'high',
  },
  {
    id: 'front-suspension',
    label: 'Front suspension',
    value: 'Upside-down telescopic forks',
    source: 'Bajaj Auto product literature (public)',
    confidence: 'high',
  },
  {
    id: 'rear-suspension',
    label: 'Rear suspension',
    value: 'Monoshock, 7-step preload (typical Dominar family)',
    source: 'Bajaj Auto product literature (public)',
    confidence: 'medium',
  },
  {
    id: 'front-tyre',
    label: 'Front tyre',
    value: '100/80-17',
    source: 'Bajaj Auto product literature (public)',
    confidence: 'high',
  },
  {
    id: 'rear-tyre',
    label: 'Rear tyre',
    value: '130/70-17',
    source: 'Bajaj Auto product literature (public)',
    confidence: 'high',
  },
  {
    id: 'front-brake',
    label: 'Front brake',
    value: '300 mm disc, dual-channel ABS',
    source: 'Bajaj Auto product literature (public)',
    confidence: 'high',
  },
  {
    id: 'rear-brake',
    label: 'Rear brake',
    value: '230 mm disc, dual-channel ABS',
    source: 'Bajaj Auto product literature (public)',
    confidence: 'high',
  },
  {
    id: 'tank',
    label: 'Fuel tank',
    value: '13 L',
    source: 'Bajaj Auto product literature (public)',
    confidence: 'high',
  },
  {
    id: 'wheelbase',
    label: 'Wheelbase',
    value: '1453 mm',
    source: 'Bajaj Auto product literature (public)',
    confidence: 'high',
  },
  {
    id: 'seat',
    label: 'Seat height',
    value: '800 mm (published class figure)',
    source: 'Bajaj Auto product literature (public)',
    confidence: 'medium',
  },
  {
    id: 'headlamp',
    label: 'Headlamp',
    value: 'LED twin projector with DRL',
    source: 'Bajaj Auto product literature (public)',
    confidence: 'high',
  },
  {
    id: 'exhaust',
    label: 'Exhaust',
    value: 'Underbelly silencer, right side',
    source: 'Public photography / product literature',
    confidence: 'high',
  },
]

export const LAYOUT = {
  wheelbaseM: 1.453,
  frontTyreOuterM: 0.592,
  rearTyreOuterM: 0.608,
  seatHeightM: 0.8,
  rakeDeg: 26,
  frontDiscM: 0.3,
  rearDiscM: 0.23,
}

export const LIMITATIONS = [
  'Moonlight Bajaj ColorDoc 71120159 Rev. 10 (2025-01-01): 59 exploded plates, 17 kits, 1,238 fiche rows (site banner 1,239). OEM numbers in the fiche browser are copied from that public catalogue, not invented.',
  'The 3D workshop still has 171 schematic meshes. Fiche rows are a parts list, not unique CAD. Bolts, washers, colourways and consumables are not separately meshed.',
  '3D meshes are schematic primitives scaled to published wheelbase/tyre/disc figures. They are not scanned CAD or factory-accurate surfaces.',
  'Internal engine parts (cams, piston, gearbox) are educational cutaway stand-ins, not measured internals.',
  'Fastener torque values in training copy are workshop-typical, not copied from a verified Dominar 250 service manual page.',
]
