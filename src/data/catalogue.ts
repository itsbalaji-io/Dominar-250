export type PartCategory =
  | 'frame'
  | 'engine'
  | 'gearbox'
  | 'cooling'
  | 'intake'
  | 'exhaust'
  | 'fuel'
  | 'front-suspension'
  | 'rear-suspension'
  | 'steering'
  | 'front-wheel'
  | 'rear-wheel'
  | 'brakes'
  | 'body'
  | 'seat'
  | 'electrical'
  | 'lighting'
  | 'controls'
  | 'drivetrain'
  | 'fasteners'

export type Confidence = 'high' | 'medium' | 'low'
export type GeometryKind = 'schematic' | 'cutaway' | 'tool'

export interface BikePart {
  id: string
  name: string
  oem: string
  category: PartCategory
  parentId?: string
  installStep: number
  description: string
  explodedOffset: [number, number, number]
  kit?: string
  qty: number
  torqueNm?: number
  notes?: string
  dependsOn: string[]
  source: string
  confidence: Confidence
  geometry: GeometryKind
}

export const CATEGORIES: { id: PartCategory; label: string; color: string }[] = [
  { id: 'frame', label: 'Frame & Chassis', color: '#6b7280' },
  { id: 'engine', label: 'Engine', color: '#d97706' },
  { id: 'gearbox', label: 'Gearbox', color: '#b45309' },
  { id: 'cooling', label: 'Cooling', color: '#0891b2' },
  { id: 'intake', label: 'Intake', color: '#65a30d' },
  { id: 'exhaust', label: 'Exhaust', color: '#a8a29e' },
  { id: 'fuel', label: 'Fuel System', color: '#dc2626' },
  { id: 'front-suspension', label: 'Front Suspension', color: '#2563eb' },
  { id: 'rear-suspension', label: 'Rear Suspension', color: '#1d4ed8' },
  { id: 'steering', label: 'Steering', color: '#7c3aed' },
  { id: 'front-wheel', label: 'Front Wheel', color: '#57534e' },
  { id: 'rear-wheel', label: 'Rear Wheel', color: '#44403c' },
  { id: 'brakes', label: 'Brakes & ABS', color: '#e11d48' },
  { id: 'body', label: 'Bodywork', color: '#0f766e' },
  { id: 'seat', label: 'Seats', color: '#1e293b' },
  { id: 'electrical', label: 'Electrical', color: '#ca8a04' },
  { id: 'lighting', label: 'Lighting', color: '#f59e0b' },
  { id: 'controls', label: 'Controls', color: '#9333ea' },
  { id: 'drivetrain', label: 'Drivetrain', color: '#78716c' },
  { id: 'fasteners', label: 'Workshop tools', color: '#94a3b8' },
]

const SRC_PUB = 'Bajaj Auto public product literature'
const SRC_PHOTO = 'Public Dominar 250 photography / silhouette'
const SRC_SHOP = 'Generic liquid-cooled single workshop practice (not OEM-verified)'
const SRC_TOOL = 'Workshop fixture (not a vehicle part)'

function p(
  id: string,
  name: string,
  category: PartCategory,
  installStep: number,
  description: string,
  explodedOffset: [number, number, number],
  extra: Partial<BikePart> = {},
): BikePart {
  return {
    id,
    name,
    oem: 'Not published in this build',
    category,
    installStep,
    description,
    explodedOffset,
    qty: 1,
    dependsOn: [],
    source: SRC_PUB,
    confidence: 'high',
    geometry: 'schematic',
    ...extra,
  }
}

export const PARTS: BikePart[] = [
  p('frame', 'Twin-spar perimeter frame', 'frame', 1, 'Steel twin-spar perimeter chassis. Published wheelbase 1453 mm.', [0, -0.12, 0], { source: SRC_PUB, confidence: 'high' }),
  p('headstock', 'Steering headstock', 'frame', 2, 'Steering-head tube on the main frame.', [0, 0.22, 0.55], { parentId: 'frame', dependsOn: ['frame'], source: SRC_PHOTO, confidence: 'medium' }),
  p('subframe', 'Rear subframe', 'frame', 3, 'Bolted rear structure for seat, tail and electrics.', [0, 0.18, -0.55], { parentId: 'frame', dependsOn: ['frame'], source: SRC_PHOTO, confidence: 'medium' }),
  p('engine-mount-front', 'Front engine mount', 'frame', 10, 'Front crankcase-to-frame hanger.', [0.18, -0.05, 0.22], { parentId: 'frame', dependsOn: ['frame'], source: SRC_SHOP, confidence: 'low', qty: 2 }),
  p('engine-mount-rear', 'Rear engine mount', 'frame', 11, 'Rear engine hanger near swingarm pivot.', [-0.18, -0.04, -0.12], { parentId: 'frame', dependsOn: ['frame'], source: SRC_SHOP, confidence: 'low', qty: 2 }),
  p('engine-mount-upper', 'Upper engine stay', 'frame', 12, 'Upper stay between head area and frame.', [0, 0.28, 0.08], { parentId: 'frame', dependsOn: ['frame', 'cylinder-head'], source: SRC_SHOP, confidence: 'low' }),
  p('sidestand', 'Side stand', 'frame', 8, 'Left kickstand with return spring.', [-0.32, -0.28, -0.05], { dependsOn: ['frame'], source: SRC_PHOTO, confidence: 'high' }),
  p('sidestand-switch', 'Side-stand switch', 'electrical', 9, 'Safety switch on stand pivot.', [-0.34, -0.22, -0.02], { parentId: 'sidestand', dependsOn: ['sidestand'], source: SRC_SHOP, confidence: 'medium' }),
  p('sidestand-spring', 'Side-stand return spring', 'frame', 9, 'Return spring on the stand pivot.', [-0.3, -0.24, 0], { parentId: 'sidestand', dependsOn: ['sidestand'], source: SRC_SHOP, confidence: 'medium' }),
  p('footpeg-l', 'Rider footpeg left', 'frame', 13, 'Folding rider peg, left.', [-0.28, -0.18, -0.08], { dependsOn: ['frame'], source: SRC_PHOTO, confidence: 'high' }),
  p('footpeg-r', 'Rider footpeg right', 'frame', 13, 'Folding rider peg, right.', [0.28, -0.18, -0.08], { dependsOn: ['frame'], source: SRC_PHOTO, confidence: 'high' }),
  p('pillion-peg-l', 'Pillion footpeg left', 'frame', 14, 'Passenger peg, left.', [-0.26, -0.12, -0.42], { dependsOn: ['subframe'], source: SRC_PHOTO, confidence: 'high' }),
  p('pillion-peg-r', 'Pillion footpeg right', 'frame', 14, 'Passenger peg, right.', [0.26, -0.12, -0.42], { dependsOn: ['subframe'], source: SRC_PHOTO, confidence: 'high' }),
  p('crash-guard-l', 'Engine guard left', 'frame', 40, 'Tubular crash guard, left.', [-0.38, -0.02, 0.12], { dependsOn: ['frame'], source: SRC_PHOTO, confidence: 'medium' }),
  p('crash-guard-r', 'Engine guard right', 'frame', 40, 'Tubular crash guard, right.', [0.38, -0.02, 0.12], { dependsOn: ['frame'], source: SRC_PHOTO, confidence: 'medium' }),

  p('engine-crankcase', 'Crankcase', 'engine', 4, 'Aluminium crankcase for the 248.77 cc liquid-cooled single.', [0, -0.35, 0.05], { dependsOn: ['frame'], source: SRC_PUB, confidence: 'high' }),
  p('generator-cover', 'Generator cover', 'engine', 18, 'Left cover over stator / rotor.', [-0.28, -0.08, 0.08], { parentId: 'engine-crankcase', dependsOn: ['engine-crankcase', 'stator', 'flywheel'], source: SRC_SHOP, confidence: 'medium' }),
  p('clutch-cover', 'Clutch cover', 'engine', 20, 'Right clutch cover.', [0.32, -0.06, 0.06], { parentId: 'engine-crankcase', dependsOn: ['engine-crankcase', 'clutch-pack'], source: SRC_SHOP, confidence: 'medium' }),
  p('clutch-cover-gasket', 'Clutch cover gasket', 'engine', 19, 'Cover gasket (schematic).', [0.36, -0.06, 0.06], { parentId: 'clutch-cover', dependsOn: ['engine-crankcase'], kit: 'kit-gasket', source: SRC_SHOP, confidence: 'low', geometry: 'cutaway' }),
  p('cylinder', 'Cylinder barrel', 'engine', 6, 'Barrel for the 248.77 cc single.', [0, 0.22, 0.1], { parentId: 'engine-crankcase', dependsOn: ['engine-crankcase', 'piston'], kit: 'kit-piston', source: SRC_PUB, confidence: 'medium' }),
  p('cylinder-head', 'Cylinder head (SOHC 4-valve)', 'engine', 7, 'SOHC 4-valve head as published.', [0, 0.38, 0.12], { parentId: 'cylinder', dependsOn: ['cylinder', 'head-gasket'], source: SRC_PUB, confidence: 'high' }),
  p('valve-cover', 'Cam / valve cover', 'engine', 22, 'Upper cam cover.', [0, 0.52, 0.12], { parentId: 'cylinder-head', dependsOn: ['cylinder-head', 'camshaft-intake'], source: SRC_SHOP, confidence: 'medium' }),
  p('valve-cover-gasket', 'Valve cover gasket', 'engine', 21, 'Cam-cover gasket (schematic).', [0, 0.5, 0.12], { parentId: 'valve-cover', dependsOn: ['cylinder-head'], kit: 'kit-gasket', source: SRC_SHOP, confidence: 'low', geometry: 'cutaway' }),
  p('head-gasket', 'Cylinder head gasket', 'engine', 6, 'Head gasket (schematic).', [0, 0.32, 0.12], { parentId: 'cylinder-head', dependsOn: ['cylinder'], kit: 'kit-gasket', source: SRC_SHOP, confidence: 'low', geometry: 'cutaway' }),
  p('piston', 'Piston', 'engine', 5, 'Piston cutaway — not a measured OEM piston.', [0.22, 0.18, 0.22], { parentId: 'cylinder', dependsOn: ['crankshaft', 'connecting-rod'], kit: 'kit-piston', source: SRC_SHOP, confidence: 'low', geometry: 'cutaway' }),
  p('gudgeon-pin', 'Gudgeon pin', 'engine', 5, 'Wrist pin (cutaway).', [0.26, 0.18, 0.26], { parentId: 'piston', dependsOn: ['piston'], kit: 'kit-piston', source: SRC_SHOP, confidence: 'low', geometry: 'cutaway' }),
  p('piston-rings', 'Piston rings', 'engine', 5, 'Ring pack (cutaway).', [0.3, 0.22, 0.22], { parentId: 'piston', dependsOn: ['piston'], kit: 'kit-piston', qty: 3, source: SRC_SHOP, confidence: 'low', geometry: 'cutaway' }),
  p('connecting-rod', 'Connecting rod', 'engine', 5, 'Con-rod between piston and crank (cutaway).', [0.18, 0.08, 0.16], { parentId: 'crankshaft', dependsOn: ['crankshaft'], source: SRC_SHOP, confidence: 'low', geometry: 'cutaway' }),
  p('crankshaft', 'Crankshaft', 'engine', 4, 'Crank cutaway inside the cases.', [0, -0.42, 0.02], { parentId: 'engine-crankcase', dependsOn: ['engine-crankcase'], source: SRC_SHOP, confidence: 'low', geometry: 'cutaway' }),
  p('balancer-shaft', 'Balance shaft', 'engine', 4, 'Primary balancer (typical on this family; internals unverified).', [0.12, -0.4, -0.08], { parentId: 'engine-crankcase', dependsOn: ['engine-crankcase'], source: SRC_SHOP, confidence: 'low', geometry: 'cutaway' }),
  p('camshaft-intake', 'Camshaft (SOHC)', 'engine', 7, 'Single overhead cam representation.', [0.1, 0.48, 0.18], { parentId: 'cylinder-head', dependsOn: ['cylinder-head', 'cam-chain'], kit: 'kit-timing', source: SRC_PUB, confidence: 'medium', geometry: 'cutaway' }),
  p('camshaft-exhaust', 'Cam lobes (exhaust)', 'engine', 7, 'Exhaust lobes on the SOHC shaft (cutaway).', [-0.1, 0.48, 0.06], { parentId: 'cylinder-head', dependsOn: ['cylinder-head'], kit: 'kit-timing', source: SRC_SHOP, confidence: 'low', geometry: 'cutaway' }),
  p('cam-chain', 'Cam chain and tensioner', 'engine', 7, 'Timing chain representation.', [0.2, 0.3, 0.2], { parentId: 'cylinder-head', dependsOn: ['engine-crankcase', 'cylinder-head'], kit: 'kit-timing', source: SRC_SHOP, confidence: 'low', geometry: 'cutaway' }),
  p('intake-valve', 'Intake valves', 'engine', 7, 'Valve pair (cutaway).', [0.04, 0.58, 0.16], { parentId: 'cylinder-head', dependsOn: ['cylinder-head'], qty: 2, source: SRC_SHOP, confidence: 'low', geometry: 'cutaway' }),
  p('exhaust-valve', 'Exhaust valves', 'engine', 7, 'Valve pair (cutaway).', [-0.04, 0.58, 0.06], { parentId: 'cylinder-head', dependsOn: ['cylinder-head'], qty: 2, source: SRC_SHOP, confidence: 'low', geometry: 'cutaway' }),
  p('spark-plug', 'Spark plug', 'engine', 23, 'Spark plug in the head.', [0, 0.58, 0.18], { parentId: 'cylinder-head', dependsOn: ['cylinder-head'], kit: 'kit-spark', source: SRC_SHOP, confidence: 'medium' }),
  p('starter-motor', 'Starter motor', 'engine', 16, 'Electric starter on the crankcase.', [-0.22, -0.12, -0.12], { parentId: 'engine-crankcase', dependsOn: ['engine-crankcase'], source: SRC_SHOP, confidence: 'medium' }),
  p('stator', 'Stator / magneto', 'electrical', 17, 'Charging stator behind left cover.', [-0.32, -0.08, 0.08], { parentId: 'generator-cover', dependsOn: ['engine-crankcase'], source: SRC_SHOP, confidence: 'medium' }),
  p('flywheel', 'Flywheel / rotor', 'engine', 17, 'Rotor on the left crank end.', [-0.24, -0.08, 0.08], { parentId: 'engine-crankcase', dependsOn: ['crankshaft'], source: SRC_SHOP, confidence: 'medium' }),
  p('oil-drain-plug', 'Oil drain plug', 'engine', 15, 'Sump drain.', [0.05, -0.48, 0.02], { parentId: 'engine-crankcase', dependsOn: ['engine-crankcase'], kit: 'kit-oil', source: SRC_SHOP, confidence: 'medium' }),
  p('oil-filter', 'Oil filter', 'engine', 15, 'Spin-on or cartridge filter on the cases.', [0.28, -0.22, 0.02], { parentId: 'engine-crankcase', dependsOn: ['engine-crankcase'], kit: 'kit-oil', source: SRC_SHOP, confidence: 'medium' }),
  p('oil-cooler', 'Oil cooler', 'engine', 16, 'Small cooler ahead of the cases (if fitted on the unit).', [0, -0.18, 0.32], { parentId: 'engine-crankcase', dependsOn: ['engine-crankcase'], source: SRC_SHOP, confidence: 'low' }),
  p('water-pump', 'Water pump', 'cooling', 16, 'Coolant pump on the engine.', [0.3, -0.16, 0.14], { parentId: 'engine-crankcase', dependsOn: ['engine-crankcase'], kit: 'kit-coolant', source: SRC_SHOP, confidence: 'medium' }),

  p('transmission', '6-speed gearbox', 'gearbox', 4, '6-speed constant-mesh gearbox inside the cases.', [0, -0.38, -0.1], { parentId: 'engine-crankcase', dependsOn: ['engine-crankcase'], source: SRC_PUB, confidence: 'high', geometry: 'cutaway' }),
  p('clutch-pack', 'Wet clutch pack', 'gearbox', 19, 'Multi-plate wet clutch (cutaway).', [0.38, -0.04, 0.04], { parentId: 'clutch-cover', dependsOn: ['transmission'], kit: 'kit-clutch', source: SRC_SHOP, confidence: 'medium', geometry: 'cutaway' }),
  p('clutch-basket', 'Clutch basket', 'gearbox', 19, 'Outer clutch basket.', [0.34, -0.04, 0.04], { parentId: 'clutch-pack', dependsOn: ['clutch-pack'], kit: 'kit-clutch', source: SRC_SHOP, confidence: 'low', geometry: 'cutaway' }),
  p('clutch-hub', 'Clutch inner hub', 'gearbox', 19, 'Inner hub on the input shaft.', [0.42, -0.04, 0.04], { parentId: 'clutch-pack', dependsOn: ['clutch-pack'], kit: 'kit-clutch', source: SRC_SHOP, confidence: 'low', geometry: 'cutaway' }),
  p('gear-shifter', 'Gear shift lever', 'controls', 24, 'Left shift lever.', [-0.32, -0.16, 0.02], { dependsOn: ['engine-crankcase'], source: SRC_PHOTO, confidence: 'high' }),

  p('radiator', 'Radiator', 'cooling', 25, 'Liquid-cooling radiator ahead of the engine.', [0, 0.18, 0.48], { dependsOn: ['frame', 'engine-crankcase'], kit: 'kit-coolant', source: SRC_PUB, confidence: 'high' }),
  p('radiator-grill', 'Radiator grill', 'cooling', 25, 'Protective grill on the radiator face.', [0, 0.18, 0.52], { parentId: 'radiator', dependsOn: ['radiator'], source: SRC_PHOTO, confidence: 'medium' }),
  p('radiator-cap', 'Radiator cap', 'cooling', 25, 'Pressure cap on the radiator.', [0.1, 0.28, 0.48], { parentId: 'radiator', dependsOn: ['radiator'], source: SRC_SHOP, confidence: 'medium' }),
  p('cooling-fan', 'Electric cooling fan', 'cooling', 25, 'Fan behind the core.', [0, 0.18, 0.42], { parentId: 'radiator', dependsOn: ['radiator'], source: SRC_PHOTO, confidence: 'medium' }),
  p('coolant-hoses', 'Coolant hoses', 'cooling', 26, 'Upper / lower / bypass hoses.', [0.16, 0.12, 0.38], { parentId: 'radiator', dependsOn: ['radiator', 'water-pump'], kit: 'kit-coolant', qty: 3, source: SRC_SHOP, confidence: 'medium' }),
  p('thermostat', 'Thermostat', 'cooling', 26, 'Thermostat housing on the head circuit.', [0.12, 0.34, 0.22], { parentId: 'cylinder-head', dependsOn: ['cylinder-head'], kit: 'kit-coolant', source: SRC_SHOP, confidence: 'low' }),

  p('airbox', 'Airbox', 'intake', 28, 'Airbox under the tank area.', [0, 0.42, -0.08], { dependsOn: ['frame'], kit: 'kit-air', source: SRC_SHOP, confidence: 'medium' }),
  p('air-filter', 'Air filter element', 'intake', 28, 'Filter panel in the airbox.', [0, 0.48, -0.08], { parentId: 'airbox', dependsOn: ['airbox'], kit: 'kit-air', source: SRC_SHOP, confidence: 'medium' }),
  p('iat-sensor', 'Intake air temperature sensor', 'intake', 28, 'IAT in the airbox (typical EFI).', [0.08, 0.5, -0.04], { parentId: 'airbox', dependsOn: ['airbox'], source: SRC_SHOP, confidence: 'low' }),
  p('throttle-body', 'Throttle body (EFI)', 'intake', 27, 'Electronic fuel-injection throttle body.', [0, 0.32, 0.22], { dependsOn: ['cylinder-head'], source: SRC_PUB, confidence: 'medium' }),
  p('intake-boot', 'Intake manifold boot', 'intake', 27, 'Boot between head and throttle body.', [0, 0.34, 0.16], { parentId: 'throttle-body', dependsOn: ['cylinder-head', 'throttle-body'], kit: 'kit-gasket', source: SRC_SHOP, confidence: 'medium' }),
  p('throttle-cables', 'Throttle cables', 'controls', 45, 'Pull / return cables to the right bar.', [0.12, 0.55, 0.35], { parentId: 'throttle-body', dependsOn: ['throttle-body', 'handlebar'], qty: 2, source: SRC_SHOP, confidence: 'medium' }),

  p('exhaust-header', 'Exhaust header', 'exhaust', 30, 'Downpipe from the head, wrapping under the engine.', [0.22, -0.28, 0.18], { dependsOn: ['cylinder-head'], kit: 'kit-exhaust', source: SRC_PHOTO, confidence: 'high' }),
  p('exhaust-gasket', 'Exhaust port gasket', 'exhaust', 30, 'Header gasket (schematic).', [0.18, 0.28, 0.22], { parentId: 'exhaust-header', dependsOn: ['cylinder-head'], kit: 'kit-exhaust', source: SRC_SHOP, confidence: 'low' }),
  p('exhaust-muffler', 'Underbelly silencer', 'exhaust', 31, 'Right-side underbelly muffler.', [0.42, -0.22, -0.28], { dependsOn: ['exhaust-header', 'frame'], source: SRC_PHOTO, confidence: 'high' }),
  p('exhaust-clamp', 'Muffler clamp', 'exhaust', 31, 'Header-to-silencer clamp.', [0.28, -0.18, -0.08], { parentId: 'exhaust-muffler', dependsOn: ['exhaust-header', 'exhaust-muffler'], source: SRC_SHOP, confidence: 'medium' }),
  p('o2-sensor', 'Oxygen sensor', 'exhaust', 30, 'O2 sensor in the header (typical EFI).', [0.24, -0.12, 0.08], { parentId: 'exhaust-header', dependsOn: ['exhaust-header'], source: SRC_SHOP, confidence: 'medium' }),
  p('heat-shield', 'Muffler heat shield', 'exhaust', 32, 'Pressed shield over the silencer.', [0.48, -0.16, -0.28], { parentId: 'exhaust-muffler', dependsOn: ['exhaust-muffler'], source: SRC_PHOTO, confidence: 'high' }),

  p('tank', 'Fuel tank 13 L', 'fuel', 50, '13 litre tank, Dominar hump profile.', [0, 0.62, 0.12], { dependsOn: ['frame'], source: SRC_PUB, confidence: 'high' }),
  p('fuel-pump', 'In-tank fuel pump', 'fuel', 49, 'EFI pump in the tank.', [0, 0.55, 0.08], { parentId: 'tank', dependsOn: ['tank'], source: SRC_SHOP, confidence: 'medium' }),
  p('fuel-line', 'Fuel supply line', 'fuel', 49, 'High-pressure line tank to injector circuit.', [0.14, 0.42, 0.18], { parentId: 'tank', dependsOn: ['tank', 'throttle-body'], source: SRC_SHOP, confidence: 'medium' }),
  p('fuel-cap', 'Fuel filler cap', 'fuel', 51, 'Locking filler cap.', [0, 0.72, 0.18], { parentId: 'tank', dependsOn: ['tank'], source: SRC_PHOTO, confidence: 'high' }),
  p('fuel-sender', 'Fuel level sender', 'fuel', 49, 'Float sender in the tank.', [0.1, 0.52, 0.02], { parentId: 'tank', dependsOn: ['tank'], source: SRC_SHOP, confidence: 'medium' }),

  p('fork-l', 'USD fork left', 'front-suspension', 34, 'Left upside-down fork.', [-0.18, 0.22, 0.72], { dependsOn: ['triple-lower'], kit: 'kit-fork', source: SRC_PUB, confidence: 'high' }),
  p('fork-r', 'USD fork right', 'front-suspension', 34, 'Right USD fork with caliper lugs.', [0.18, 0.22, 0.72], { dependsOn: ['triple-lower'], kit: 'kit-fork', source: SRC_PUB, confidence: 'high' }),
  p('fork-tube-l', 'Left fork inner tube', 'front-suspension', 34, 'Chrome inner tube of the left USD fork.', [-0.18, 0.4, 0.68], { parentId: 'fork-l', dependsOn: ['fork-l'], kit: 'kit-fork', source: SRC_SHOP, confidence: 'medium' }),
  p('fork-tube-r', 'Right fork inner tube', 'front-suspension', 34, 'Chrome inner tube of the right USD fork.', [0.18, 0.4, 0.68], { parentId: 'fork-r', dependsOn: ['fork-r'], kit: 'kit-fork', source: SRC_SHOP, confidence: 'medium' }),
  p('fork-seal-l', 'Left fork dust seal', 'front-suspension', 34, 'Dust seal on the left USD slider.', [-0.2, 0.28, 0.7], { parentId: 'fork-l', dependsOn: ['fork-l'], kit: 'kit-fork', source: SRC_SHOP, confidence: 'medium' }),
  p('fork-seal-r', 'Right fork dust seal', 'front-suspension', 34, 'Dust seal on the right USD slider.', [0.2, 0.28, 0.7], { parentId: 'fork-r', dependsOn: ['fork-r'], kit: 'kit-fork', source: SRC_SHOP, confidence: 'medium' }),
  p('triple-upper', 'Upper triple clamp', 'front-suspension', 36, 'Upper yoke / triple.', [0, 0.78, 0.62], { dependsOn: ['triple-lower', 'fork-l', 'fork-r'], source: SRC_PHOTO, confidence: 'high' }),
  p('triple-lower', 'Lower triple clamp and stem', 'front-suspension', 33, 'Lower yoke with steering stem.', [0, 0.52, 0.64], { dependsOn: ['headstock', 'steering-bearings'], source: SRC_PHOTO, confidence: 'high' }),
  p('steering-stem-nut', 'Steering stem nut', 'steering', 37, 'Stem nut on the upper triple.', [0, 0.86, 0.6], { parentId: 'triple-upper', dependsOn: ['triple-upper'], kit: 'kit-steer', source: SRC_SHOP, confidence: 'medium' }),
  p('steering-bearings', 'Steering head bearings', 'steering', 33, 'Headstock bearings.', [0, 0.62, 0.62], { parentId: 'triple-lower', dependsOn: ['headstock'], kit: 'kit-steer', qty: 2, source: SRC_SHOP, confidence: 'medium' }),

  p('swingarm', 'Swingarm', 'rear-suspension', 29, 'Rear swingarm.', [0, 0.08, -0.45], { dependsOn: ['frame'], source: SRC_PHOTO, confidence: 'high' }),
  p('swingarm-pivot', 'Swingarm pivot shaft', 'rear-suspension', 29, 'Pivot shaft and collars.', [0.22, 0.12, -0.18], { parentId: 'swingarm', dependsOn: ['frame', 'swingarm'], kit: 'kit-wheel-brg', source: SRC_SHOP, confidence: 'medium' }),
  p('chain-adjuster-l', 'Chain adjuster left', 'rear-suspension', 29, 'Left axle block / adjuster.', [-0.12, 0.04, -0.72], { parentId: 'swingarm', dependsOn: ['swingarm'], source: SRC_SHOP, confidence: 'medium' }),
  p('chain-adjuster-r', 'Chain adjuster right', 'rear-suspension', 29, 'Right axle block / adjuster.', [0.12, 0.04, -0.72], { parentId: 'swingarm', dependsOn: ['swingarm'], source: SRC_SHOP, confidence: 'medium' }),
  p('monoshock', 'Rear monoshock', 'rear-suspension', 30, 'Gas monoshock.', [-0.08, 0.22, -0.32], { dependsOn: ['frame', 'swingarm'], source: SRC_PUB, confidence: 'high' }),
  p('shock-linkage', 'Shock linkage', 'rear-suspension', 30, 'Progressive linkage (typical; exact layout unverified).', [0, -0.02, -0.28], { parentId: 'monoshock', dependsOn: ['swingarm', 'monoshock'], source: SRC_SHOP, confidence: 'low' }),
  p('chain-slider', 'Swingarm chain slider', 'rear-suspension', 29, 'Wear slider on the swingarm.', [0.14, 0.02, -0.45], { parentId: 'swingarm', dependsOn: ['swingarm'], source: SRC_SHOP, confidence: 'medium' }),

  p('handlebar', 'Handlebar', 'steering', 38, 'Taper bar on the upper triple.', [0, 0.95, 0.55], { dependsOn: ['triple-upper'], source: SRC_PHOTO, confidence: 'high' }),
  p('bar-clamps', 'Handlebar clamps', 'steering', 38, 'Riser clamps.', [0, 0.9, 0.58], { parentId: 'handlebar', dependsOn: ['handlebar'], qty: 2, source: SRC_SHOP, confidence: 'medium' }),
  p('bar-ends', 'Bar-end weights', 'steering', 39, 'Vibration weights.', [0.42, 0.92, 0.52], { parentId: 'handlebar', dependsOn: ['handlebar'], qty: 2, source: SRC_PHOTO, confidence: 'medium' }),
  p('front-master-cylinder', 'Front brake master cylinder', 'brakes', 39, 'Right-bar master cylinder.', [0.28, 0.92, 0.58], { parentId: 'handlebar', dependsOn: ['handlebar'], source: SRC_PHOTO, confidence: 'high' }),
  p('brake-reservoir', 'Front brake fluid reservoir', 'brakes', 39, 'Remote / integral reservoir on the right bar.', [0.32, 0.98, 0.55], { parentId: 'front-master-cylinder', dependsOn: ['front-master-cylinder'], source: SRC_PHOTO, confidence: 'high' }),
  p('grip-l', 'Left handlebar grip', 'controls', 39, 'Left rubber grip.', [-0.36, 0.92, 0.52], { parentId: 'handlebar', dependsOn: ['handlebar'], source: SRC_PHOTO, confidence: 'high' }),
  p('clutch-lever', 'Clutch perch and lever', 'controls', 39, 'Left-bar clutch perch.', [-0.28, 0.92, 0.58], { parentId: 'handlebar', dependsOn: ['handlebar'], source: SRC_PHOTO, confidence: 'high' }),
  p('clutch-cable', 'Clutch cable', 'controls', 39, 'Cable from perch to release arm.', [-0.22, 0.4, 0.25], { dependsOn: ['clutch-lever', 'clutch-cover'], source: SRC_SHOP, confidence: 'medium' }),
  p('switchgear-l', 'Left switchgear', 'controls', 39, 'Lights / horn / indicator cluster.', [-0.18, 0.92, 0.56], { parentId: 'handlebar', dependsOn: ['handlebar'], source: SRC_PHOTO, confidence: 'high' }),
  p('switchgear-r', 'Right switchgear', 'controls', 39, 'Run / starter cluster.', [0.18, 0.92, 0.56], { parentId: 'handlebar', dependsOn: ['handlebar'], source: SRC_PHOTO, confidence: 'high' }),
  p('throttle-grip', 'Throttle tube and grip', 'controls', 39, 'Right throttle tube.', [0.36, 0.92, 0.52], { parentId: 'handlebar', dependsOn: ['handlebar'], source: SRC_PHOTO, confidence: 'high' }),
  p('mirror-l', 'Rear-view mirror left', 'controls', 40, 'Left stem mirror.', [-0.38, 1.05, 0.52], { dependsOn: ['handlebar'], source: SRC_PHOTO, confidence: 'high' }),
  p('mirror-r', 'Rear-view mirror right', 'controls', 40, 'Right stem mirror.', [0.38, 1.05, 0.52], { dependsOn: ['handlebar'], source: SRC_PHOTO, confidence: 'high' }),
  p('ignition-switch', 'Ignition switch', 'electrical', 37, 'Key switch on the upper triple.', [0, 0.84, 0.55], { parentId: 'triple-upper', dependsOn: ['triple-upper'], source: SRC_PHOTO, confidence: 'high' }),

  p('front-tyre', 'Front tyre 100/80-17', 'front-wheel', 42, '100/80-17 front tyre.', [0, -0.05, 0.95], { dependsOn: ['front-rim'], source: SRC_PUB, confidence: 'high' }),
  p('front-rim', 'Front alloy rim 17 x 2.5', 'front-wheel', 41, '5-spoke front alloy.', [0, -0.05, 0.95], { dependsOn: ['fork-l', 'fork-r'], kit: 'kit-wheel-brg', source: SRC_PUB, confidence: 'high' }),
  p('front-wheel', 'Front wheel assembly', 'front-wheel', 42, 'Assembled front wheel (rim + tyre reference).', [0, -0.05, 0.95], { dependsOn: ['front-rim', 'front-tyre'], kit: 'kit-wheel-brg', source: SRC_PUB, confidence: 'high' }),
  p('front-bearing', 'Front wheel bearings', 'front-wheel', 41, 'Hub bearings (schematic).', [0, 0, 0.726], { parentId: 'front-rim', dependsOn: ['front-rim'], kit: 'kit-wheel-brg', qty: 2, source: SRC_SHOP, confidence: 'medium' }),
  p('front-axle', 'Front axle', 'front-wheel', 42, 'Front axle through the fork lowers.', [0.22, 0, 0.726], { parentId: 'front-wheel', dependsOn: ['front-rim', 'fork-l', 'fork-r'], source: SRC_SHOP, confidence: 'medium' }),
  p('front-axle-spacers', 'Front axle spacers', 'front-wheel', 42, 'Axle spacers / ABS spacer.', [0.16, 0, 0.726], { parentId: 'front-wheel', dependsOn: ['front-axle'], qty: 2, kit: 'kit-wheel-brg', source: SRC_SHOP, confidence: 'medium' }),
  p('axle-nut-f', 'Front axle nut', 'front-wheel', 42, 'Front axle nut.', [-0.22, 0, 0.726], { parentId: 'front-axle', dependsOn: ['front-axle'], source: SRC_SHOP, confidence: 'medium' }),
  p('caliper-bracket-f', 'Front caliper bracket', 'brakes', 43, 'Caliper carrier on the right fork.', [0.2, 0.04, 0.76], { dependsOn: ['fork-r'], source: SRC_SHOP, confidence: 'medium' }),

  p('rear-tyre', 'Rear tyre 130/70-17', 'rear-wheel', 44, '130/70-17 rear tyre.', [0, -0.02, -0.95], { dependsOn: ['rear-rim'], source: SRC_PUB, confidence: 'high' }),
  p('rear-rim', 'Rear alloy rim 17 x 3.5', 'rear-wheel', 43, '5-spoke rear alloy.', [0, -0.02, -0.95], { dependsOn: ['swingarm'], kit: 'kit-wheel-brg', source: SRC_PUB, confidence: 'high' }),
  p('rear-wheel', 'Rear wheel assembly', 'rear-wheel', 44, 'Assembled rear wheel.', [0, -0.02, -0.95], { dependsOn: ['rear-rim', 'rear-tyre'], kit: 'kit-wheel-brg', source: SRC_PUB, confidence: 'high' }),
  p('rear-bearing', 'Rear wheel bearings', 'rear-wheel', 43, 'Hub bearings (schematic).', [0, 0.02, -0.726], { parentId: 'rear-rim', dependsOn: ['rear-rim'], kit: 'kit-wheel-brg', qty: 2, source: SRC_SHOP, confidence: 'medium' }),
  p('rear-axle', 'Rear axle', 'rear-wheel', 44, 'Rear axle.', [0.22, 0.02, -0.726], { parentId: 'rear-wheel', dependsOn: ['rear-rim', 'swingarm'], source: SRC_SHOP, confidence: 'medium' }),
  p('axle-nut-r', 'Rear axle nut', 'rear-wheel', 44, 'Rear axle nut.', [-0.22, 0.02, -0.726], { parentId: 'rear-axle', dependsOn: ['rear-axle'], source: SRC_SHOP, confidence: 'medium' }),
  p('cush-drive', 'Cush drive', 'rear-wheel', 44, 'Cush rubbers in the rear hub.', [0.12, 0.02, -0.78], { parentId: 'rear-wheel', dependsOn: ['rear-rim'], qty: 5, source: SRC_SHOP, confidence: 'medium' }),

  p('front-disc', 'Front disc 300 mm', 'brakes', 43, '300 mm front disc.', [0.16, 0, 0.726], { parentId: 'front-wheel', dependsOn: ['front-rim'], kit: 'kit-pad-f', source: SRC_PUB, confidence: 'high' }),
  p('front-caliper', 'Front caliper', 'brakes', 43, 'Twin-piston front caliper.', [0.22, 0.04, 0.78], { dependsOn: ['caliper-bracket-f', 'front-disc'], kit: 'kit-pad-f', source: SRC_PUB, confidence: 'high' }),
  p('front-brake-hose', 'Front brake hose', 'brakes', 46, 'Hose master to caliper via ABS.', [0.18, 0.4, 0.55], { parentId: 'front-caliper', dependsOn: ['front-master-cylinder', 'front-caliper', 'abs-modulator'], source: SRC_SHOP, confidence: 'medium' }),
  p('rear-disc', 'Rear disc 230 mm', 'brakes', 45, '230 mm rear disc.', [-0.14, 0.02, -0.726], { parentId: 'rear-wheel', dependsOn: ['rear-rim'], kit: 'kit-pad-r', source: SRC_PUB, confidence: 'high' }),
  p('rear-caliper', 'Rear caliper', 'brakes', 45, 'Rear caliper on the carrier.', [-0.2, 0.04, -0.78], { dependsOn: ['swingarm', 'rear-disc'], kit: 'kit-pad-r', source: SRC_PUB, confidence: 'high' }),
  p('rear-brake-hose', 'Rear brake hose', 'brakes', 46, 'Hose to the rear caliper via ABS.', [0.16, 0.1, -0.4], { parentId: 'rear-caliper', dependsOn: ['rear-master-cylinder', 'rear-caliper', 'abs-modulator'], source: SRC_SHOP, confidence: 'medium' }),
  p('rear-master-cylinder', 'Rear master cylinder', 'brakes', 24, 'Rear master on the right peg bracket.', [0.26, -0.08, -0.05], { dependsOn: ['frame'], source: SRC_PHOTO, confidence: 'high' }),
  p('rear-brake-pedal', 'Rear brake pedal', 'brakes', 24, 'Right brake pedal.', [0.3, -0.14, 0.0], { dependsOn: ['rear-master-cylinder'], source: SRC_PHOTO, confidence: 'high' }),
  p('abs-modulator', 'Dual-channel ABS modulator', 'brakes', 27, 'Dual-channel ABS unit.', [0.12, 0.28, -0.18], { dependsOn: ['frame'], source: SRC_PUB, confidence: 'high' }),
  p('abs-sensor-front', 'Front ABS wheel-speed sensor', 'brakes', 43, 'Front wheel-speed sensor.', [-0.2, 0.02, 0.78], { parentId: 'front-caliper', dependsOn: ['fork-l', 'front-disc'], source: SRC_PUB, confidence: 'medium' }),
  p('abs-sensor-rear', 'Rear ABS wheel-speed sensor', 'brakes', 45, 'Rear wheel-speed sensor.', [-0.22, 0.04, -0.8], { parentId: 'rear-caliper', dependsOn: ['swingarm', 'rear-disc'], source: SRC_PUB, confidence: 'medium' }),
  p('brake-pad-f', 'Front brake pads', 'brakes', 43, 'Front pad set.', [0.28, 0.04, 0.8], { parentId: 'front-caliper', dependsOn: ['front-caliper'], kit: 'kit-pad-f', qty: 2, source: SRC_SHOP, confidence: 'medium' }),
  p('brake-pad-r', 'Rear brake pads', 'brakes', 45, 'Rear pad set.', [-0.26, 0.04, -0.82], { parentId: 'rear-caliper', dependsOn: ['rear-caliper'], kit: 'kit-pad-r', qty: 2, source: SRC_SHOP, confidence: 'medium' }),

  p('side-fairing-l', 'Left mid fairing', 'body', 55, 'Left mid-fairing.', [-0.32, 0.28, 0.22], { dependsOn: ['frame'], kit: 'kit-body', source: SRC_PHOTO, confidence: 'high' }),
  p('side-fairing-r', 'Right mid fairing', 'body', 55, 'Right mid-fairing.', [0.32, 0.28, 0.22], { dependsOn: ['frame'], kit: 'kit-body', source: SRC_PHOTO, confidence: 'high' }),
  p('belly-pan', 'Belly pan', 'body', 54, 'Lower cowl.', [0, -0.22, 0.22], { dependsOn: ['frame'], kit: 'kit-body', source: SRC_PHOTO, confidence: 'high' }),
  p('tail-cowl', 'Tail cowl', 'body', 53, 'Rear tail piece.', [0, 0.42, -0.72], { dependsOn: ['subframe'], kit: 'kit-body', source: SRC_PHOTO, confidence: 'high' }),
  p('front-fender', 'Front fender', 'body', 41, 'Front mudguard on the fork lowers.', [0, 0.28, 0.78], { dependsOn: ['fork-l', 'fork-r'], kit: 'kit-body', source: SRC_PHOTO, confidence: 'high' }),
  p('rear-fender', 'Rear inner fender', 'body', 48, 'Rear hugger / inner fender.', [0, 0.18, -0.85], { dependsOn: ['swingarm'], kit: 'kit-body', source: SRC_PHOTO, confidence: 'medium' }),
  p('tank-shroud-l', 'Tank shroud left', 'body', 56, 'Left tank shroud.', [-0.22, 0.52, 0.22], { dependsOn: ['tank'], kit: 'kit-body', source: SRC_PHOTO, confidence: 'high' }),
  p('tank-shroud-r', 'Tank shroud right', 'body', 56, 'Right tank shroud.', [0.22, 0.52, 0.22], { dependsOn: ['tank'], kit: 'kit-body', source: SRC_PHOTO, confidence: 'high' }),
  p('number-plate', 'Number plate holder', 'body', 53, 'Rear plate bracket.', [0, 0.22, -0.95], { dependsOn: ['tail-cowl'], source: SRC_PHOTO, confidence: 'high' }),
  p('chain-guard', 'Chain guard', 'body', 47, 'Upper chain guard.', [0.12, 0.14, -0.55], { dependsOn: ['swingarm'], source: SRC_PHOTO, confidence: 'high' }),
  p('grab-rail', 'Pillion grab rail', 'body', 53, 'Grab rail over the tail.', [0, 0.52, -0.62], { dependsOn: ['subframe'], source: SRC_PHOTO, confidence: 'high' }),
  p('headlight-visor', 'Headlight visor / brow', 'body', 48, 'Upper cowl over the twin projector.', [0, 0.7, 0.78], { dependsOn: ['headlight'], source: SRC_PHOTO, confidence: 'high' }),
  p('battery-cover', 'Battery tray cover', 'body', 52, 'Cover over the battery tray.', [0, 0.5, -0.28], { dependsOn: ['subframe'], source: SRC_SHOP, confidence: 'medium' }),
  p('fuse-box', 'Fuse box', 'electrical', 52, 'Fuse / relay box near the battery.', [0.14, 0.38, -0.3], { dependsOn: ['subframe'], source: SRC_SHOP, confidence: 'medium' }),
  p('fastener-fairing-set', 'Fairing fastener assortment', 'fasteners', 54, 'Body clips and screws (schematic bin).', [0.4, 0.3, 0.3], { kit: 'kit-body', qty: 24, dependsOn: [], source: SRC_SHOP, confidence: 'low', geometry: 'tool' }),

  p('seat-rider', 'Rider seat', 'seat', 57, 'Rider seat, ~800 mm height class.', [0, 0.72, -0.18], { dependsOn: ['subframe'], source: SRC_PUB, confidence: 'high' }),
  p('seat-pillion', 'Pillion seat', 'seat', 58, 'Passenger pad.', [0, 0.68, -0.52], { dependsOn: ['subframe'], source: SRC_PHOTO, confidence: 'high' }),

  p('battery', 'Battery 12 V', 'electrical', 52, 'Battery under the rider seat.', [0, 0.42, -0.32], { dependsOn: ['subframe'], source: SRC_SHOP, confidence: 'medium' }),
  p('battery-negative-lead', 'Battery negative lead', 'electrical', 60, 'Earth lead.', [-0.12, 0.38, -0.28], { parentId: 'battery', dependsOn: ['battery'], source: SRC_SHOP, confidence: 'medium' }),
  p('battery-positive-lead', 'Battery positive lead', 'electrical', 59, 'Positive lead to the starter relay.', [0.12, 0.38, -0.28], { parentId: 'battery', dependsOn: ['battery'], source: SRC_SHOP, confidence: 'medium' }),
  p('battery-strap', 'Battery hold-down', 'electrical', 59, 'Hold-down strap.', [0, 0.48, -0.32], { parentId: 'battery', dependsOn: ['battery'], source: SRC_SHOP, confidence: 'medium' }),
  p('ecu', 'Engine ECU', 'electrical', 27, 'EFI ECU.', [0.16, 0.38, -0.12], { dependsOn: ['frame'], source: SRC_SHOP, confidence: 'medium' }),
  p('wiring-harness', 'Main wiring harness', 'electrical', 8, 'Chassis harness (schematic route).', [0.2, 0.35, 0.0], { dependsOn: ['frame'], kit: 'kit-elec', source: SRC_SHOP, confidence: 'low' }),
  p('ignition-coil', 'Ignition coil', 'electrical', 27, 'Coil at the head.', [0.1, 0.55, 0.16], { parentId: 'cylinder-head', dependsOn: ['cylinder-head'], source: SRC_SHOP, confidence: 'medium' }),
  p('rectifier', 'Regulator rectifier', 'electrical', 27, 'RR unit.', [-0.16, 0.28, -0.35], { dependsOn: ['subframe'], source: SRC_SHOP, confidence: 'medium' }),
  p('horn', 'Horn', 'electrical', 32, 'Horn behind the radiator area.', [-0.14, 0.22, 0.42], { dependsOn: ['frame'], source: SRC_PHOTO, confidence: 'medium' }),
  p('flasher-relay', 'Flasher relay', 'electrical', 27, 'Indicator relay.', [0.1, 0.38, -0.38], { dependsOn: ['subframe'], source: SRC_SHOP, confidence: 'low' }),
  p('starter-relay', 'Starter relay', 'electrical', 52, 'Solenoid next to the battery.', [0.12, 0.4, -0.28], { parentId: 'battery', dependsOn: ['battery'], source: SRC_SHOP, confidence: 'medium' }),

  p('headlight', 'LED twin projector headlamp', 'lighting', 48, 'Twin LED projector with DRL.', [0, 0.62, 0.82], { dependsOn: ['triple-upper'], source: SRC_PUB, confidence: 'high' }),
  p('tail-light', 'LED tail lamp', 'lighting', 53, 'LED stop / tail.', [0, 0.48, -0.88], { dependsOn: ['tail-cowl'], source: SRC_PHOTO, confidence: 'high' }),
  p('indicator-fl', 'Front indicator left', 'lighting', 55, 'Left front indicator.', [-0.28, 0.52, 0.7], { dependsOn: ['side-fairing-l'], source: SRC_PHOTO, confidence: 'high' }),
  p('indicator-fr', 'Front indicator right', 'lighting', 55, 'Right front indicator.', [0.28, 0.52, 0.7], { dependsOn: ['side-fairing-r'], source: SRC_PHOTO, confidence: 'high' }),
  p('indicator-rl', 'Rear indicator left', 'lighting', 53, 'Left rear indicator.', [-0.22, 0.42, -0.88], { dependsOn: ['tail-cowl'], source: SRC_PHOTO, confidence: 'high' }),
  p('indicator-rr', 'Rear indicator right', 'lighting', 53, 'Right rear indicator.', [0.22, 0.42, -0.88], { dependsOn: ['tail-cowl'], source: SRC_PHOTO, confidence: 'high' }),
  p('instrument-cluster', 'Instrument cluster', 'lighting', 48, 'Digital cluster on the triple.', [0, 0.82, 0.68], { dependsOn: ['triple-upper'], source: SRC_PHOTO, confidence: 'high' }),

  p('chain', 'Drive chain', 'drivetrain', 47, '520-class drive chain.', [0.18, 0.02, -0.2], { dependsOn: ['front-sprocket', 'rear-sprocket'], kit: 'kit-chain', source: SRC_SHOP, confidence: 'medium' }),
  p('front-sprocket', 'Front sprocket', 'drivetrain', 35, 'Output sprocket.', [0.22, -0.04, -0.08], { dependsOn: ['transmission'], kit: 'kit-chain', source: SRC_SHOP, confidence: 'medium' }),
  p('rear-sprocket', 'Rear sprocket', 'drivetrain', 44, 'Rear sprocket on the cush hub.', [0.16, 0.02, -0.78], { dependsOn: ['rear-rim', 'cush-drive'], kit: 'kit-chain', source: SRC_SHOP, confidence: 'medium' }),
  p('sprocket-cover', 'Sprocket cover', 'drivetrain', 35, 'Output sprocket cover.', [0.28, -0.02, -0.06], { parentId: 'front-sprocket', dependsOn: ['front-sprocket'], source: SRC_PHOTO, confidence: 'high' }),

  p('paddock-stand', 'Rear paddock stand', 'fasteners', 0, 'Workshop rear stand — not a vehicle part.', [0, -0.35, -0.55], { source: SRC_TOOL, confidence: 'high', geometry: 'tool' }),
  p('front-stand', 'Front headstock stand', 'fasteners', 0, 'Workshop front stand — not a vehicle part.', [0, -0.15, 0.55], { source: SRC_TOOL, confidence: 'high', geometry: 'tool' }),
]

export const KITS: { id: string; name: string; partIds: string[] }[] = [
  { id: 'kit-gasket', name: 'Engine gasket kit (schematic)', partIds: ['clutch-cover-gasket', 'valve-cover-gasket', 'head-gasket', 'intake-boot'] },
  { id: 'kit-clutch', name: 'Clutch kit (schematic)', partIds: ['clutch-pack', 'clutch-basket', 'clutch-hub'] },
  { id: 'kit-piston', name: 'Piston kit (cutaway)', partIds: ['piston', 'gudgeon-pin', 'piston-rings', 'cylinder'] },
  { id: 'kit-timing', name: 'Cam chain kit (cutaway)', partIds: ['cam-chain', 'camshaft-intake', 'camshaft-exhaust'] },
  { id: 'kit-oil', name: 'Oil service kit', partIds: ['oil-filter', 'oil-drain-plug'] },
  { id: 'kit-air', name: 'Air filter kit', partIds: ['air-filter', 'airbox'] },
  { id: 'kit-spark', name: 'Spark plug kit', partIds: ['spark-plug'] },
  { id: 'kit-pad-f', name: 'Front brake pad kit', partIds: ['brake-pad-f', 'front-caliper', 'front-disc'] },
  { id: 'kit-pad-r', name: 'Rear brake pad kit', partIds: ['brake-pad-r', 'rear-caliper', 'rear-disc'] },
  { id: 'kit-chain', name: 'Chain and sprocket kit', partIds: ['chain', 'front-sprocket', 'rear-sprocket'] },
  { id: 'kit-fork', name: 'Fork seal kit (service group)', partIds: ['fork-l', 'fork-r', 'fork-tube-l', 'fork-tube-r', 'fork-seal-l', 'fork-seal-r'] },
  { id: 'kit-steer', name: 'Steering bearing kit', partIds: ['steering-bearings', 'steering-stem-nut'] },
  { id: 'kit-wheel-brg', name: 'Wheel bearing kit', partIds: ['front-bearing', 'rear-bearing', 'front-axle-spacers'] },
  { id: 'kit-body', name: 'Body fastener kit', partIds: ['side-fairing-l', 'side-fairing-r', 'belly-pan', 'tail-cowl', 'front-fender', 'fastener-fairing-set'] },
  { id: 'kit-coolant', name: 'Cooling hose kit', partIds: ['coolant-hoses', 'radiator', 'water-pump', 'thermostat'] },
  { id: 'kit-elec', name: 'Electrical connector kit', partIds: ['wiring-harness', 'battery-negative-lead', 'battery-positive-lead'] },
  { id: 'kit-exhaust', name: 'Exhaust gasket kit', partIds: ['exhaust-gasket', 'exhaust-header', 'o2-sensor'] },
]

export const PARTS_BY_ID: Record<string, BikePart> = Object.fromEntries(PARTS.map((x) => [x.id, x]))

export const CHILDREN: Record<string, string[]> = {}
for (const part of PARTS) {
  if (!part.parentId) continue
  if (!CHILDREN[part.parentId]) CHILDREN[part.parentId] = []
  CHILDREN[part.parentId].push(part.id)
}

export function dependentsOf(id: string): string[] {
  const out: string[] = []
  for (const p of PARTS) {
    if (p.dependsOn.includes(id) || p.parentId === id) out.push(p.id)
  }
  return out
}
