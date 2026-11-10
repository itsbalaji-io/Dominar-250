export type MilestoneStatus = 'done' | 'in-progress' | 'unverified'

export interface Milestone {
  id: string
  layer: number
  title: string
  status: MilestoneStatus
  notes: string
}

export const MILESTONES: Milestone[] = [
  {
    id: 'm1',
    layer: 1,
    title: 'Motorcycle outline + 360 viewer',
    status: 'done',
    notes: 'Recognisable Dominar silhouette, published 1453 mm wheelbase, orbit/zoom/pan.',
  },
  {
    id: 'm2',
    layer: 2,
    title: 'Frame, chassis, wheels',
    status: 'done',
    notes: 'Twin-spar, subframe, headstock, split rims/tyres/axles/bearings. Schematic, not scanned CAD.',
  },
  {
    id: 'm3',
    layer: 3,
    title: 'Engine and mechanicals',
    status: 'in-progress',
    notes: 'External cases/head/covers selectable. Internals are labelled cutaways, not factory-accurate.',
  },
  {
    id: 'm4',
    layer: 4,
    title: 'Fuel, exhaust, electrical',
    status: 'done',
    notes: '13 L tank, underbelly silencer, battery/ECU/harness/lights as separate parts.',
  },
  {
    id: 'm5',
    layer: 5,
    title: 'Body panels and exterior',
    status: 'done',
    notes: 'Fairings, belly pan, tail, seats, lamps individually removable.',
  },
  {
    id: 'm6',
    layer: 6,
    title: 'Assembly / disassembly system',
    status: 'done',
    notes: 'Empty bay, explode, isolate, undo/redo, dependency lock, progress bar.',
  },
  {
    id: 'm7',
    layer: 7,
    title: 'Mechanic training mode',
    status: 'done',
    notes: '50-step teardown and rebuild. Torque figures are workshop-typical, not a copied manual page.',
  },
  {
    id: 'm8',
    layer: 8,
    title: 'Visual polish',
    status: 'in-progress',
    notes: 'Clearcoat body, extruded fairings, lathed covers, 5-spoke rims. Still schematic primitives, not photogrammetry/CAD.',
  },
  {
    id: 'm9',
    layer: 9,
    title: 'Integration and honest catalogue',
    status: 'done',
    notes: 'No invented OEM numbers. 1,239-part fiche was unavailable; modelled set is the working inventory.',
  },
]
