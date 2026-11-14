import { create } from 'zustand'
import { PARTS, PARTS_BY_ID, dependentsOf, type PartCategory } from './data/catalogue'
import { ASSEMBLY_STEPS, DISASSEMBLY_STEPS, type TrainingMode } from './data/training'

export type SimMode = 'inspect' | 'explode' | 'training' | 'build'
export type CameraView = 'iso' | 'front' | 'rear' | 'left' | 'right' | 'top' | 'bottom'

export const CAMERA_VIEWS: Record<CameraView, { pos: [number, number, number]; target: [number, number, number] }> = {
  iso: { pos: [2.4, 1.35, 2.6], target: [0, 0.48, 0] },
  front: { pos: [0, 0.9, 4.2], target: [0, 0.5, 0] },
  rear: { pos: [0, 0.9, -4.2], target: [0, 0.5, 0] },
  left: { pos: [-4.2, 0.9, 0], target: [0, 0.5, 0] },
  right: { pos: [4.2, 0.9, 0], target: [0, 0.5, 0] },
  top: { pos: [0, 5.2, 0.2], target: [0, 0.4, 0] },
  bottom: { pos: [0.4, -2.4, 1.2], target: [0, 0.3, 0] },
}

const HISTORY_MAX = 40

function emptyHidden(): Record<PartCategory, boolean> {
  return {
    frame: false,
    engine: false,
    gearbox: false,
    cooling: false,
    intake: false,
    exhaust: false,
    fuel: false,
    'front-suspension': false,
    'rear-suspension': false,
    steering: false,
    'front-wheel': false,
    'rear-wheel': false,
    brakes: false,
    body: false,
    seat: false,
    electrical: false,
    lighting: false,
    controls: false,
    drivetrain: false,
    fasteners: false,
  }
}

function allRemoved(): Record<string, boolean> {
  return Object.fromEntries(PARTS.map((p) => [p.id, true]))
}

function cloneRemoved(r: Record<string, boolean>): Record<string, boolean> {
  return { ...r }
}

interface BikeState {
  selectedId: string | null
  hoveredId: string | null
  removed: Record<string, boolean>
  explode: number
  isolating: boolean
  mode: SimMode
  trainingMode: TrainingMode
  trainingIndex: number
  hiddenCategories: Record<PartCategory, boolean>
  ghostRemoved: boolean
  autoRotate: boolean
  showLabels: boolean
  showConnectors: boolean
  enforceDeps: boolean
  cameraNonce: number
  cameraView: CameraView
  lastError: string | null
  history: Record<string, boolean>[]
  future: Record<string, boolean>[]
  setSelected: (id: string | null) => void
  setHovered: (id: string | null) => void
  toggleRemoved: (id: string) => void
  removeIds: (ids: string[]) => void
  installIds: (ids: string[]) => void
  setExplode: (v: number) => void
  setMode: (m: SimMode) => void
  setIsolating: (v: boolean) => void
  toggleCategory: (c: PartCategory) => void
  setTrainingMode: (m: TrainingMode) => void
  setTrainingIndex: (i: number) => void
  nextStep: () => void
  prevStep: () => void
  applyCurrentStep: () => void
  resetAll: () => void
  stripAll: () => void
  emptyBay: () => void
  setGhostRemoved: (v: boolean) => void
  setAutoRotate: (v: boolean) => void
  setShowLabels: (v: boolean) => void
  setShowConnectors: (v: boolean) => void
  setEnforceDeps: (v: boolean) => void
  resetCamera: () => void
  setCameraView: (v: CameraView) => void
  undo: () => void
  redo: () => void
  clearError: () => void
}

function pushHistory(get: () => BikeState, set: (p: Partial<BikeState>) => void, next: Record<string, boolean>) {
  const hist = [...get().history, cloneRemoved(get().removed)].slice(-HISTORY_MAX)
  set({ history: hist, future: [], removed: next, lastError: null })
}

function missingDeps(id: string, removed: Record<string, boolean>): string[] {
  const part = PARTS_BY_ID[id]
  if (!part) return []
  return part.dependsOn.filter((d) => removed[d] && PARTS_BY_ID[d])
}

function blockingDependents(id: string, removed: Record<string, boolean>): string[] {
  return dependentsOf(id).filter((d) => !removed[d] && PARTS_BY_ID[d])
}

export const useBike = create<BikeState>((set, get) => ({
  selectedId: null,
  hoveredId: null,
  removed: {},
  explode: 0,
  isolating: false,
  mode: 'inspect',
  trainingMode: 'disassembly',
  trainingIndex: 0,
  hiddenCategories: emptyHidden(),
  ghostRemoved: false,
  autoRotate: false,
  showLabels: true,
  showConnectors: false,
  enforceDeps: true,
  cameraNonce: 0,
  cameraView: 'iso',
  lastError: null,
  history: [],
  future: [],
  setSelected: (id) => set({ selectedId: id, lastError: null }),
  setHovered: (id) => set({ hoveredId: id }),
  toggleRemoved: (id) => {
    const { removed, enforceDeps } = get()
    const isRemoved = !!removed[id]
    if (enforceDeps) {
      if (isRemoved) {
        const miss = missingDeps(id, removed)
        if (miss.length) {
          set({
            lastError: `Install ${miss.map((x) => PARTS_BY_ID[x]?.name ?? x).join(', ')} first.`,
            selectedId: miss[0],
          })
          return
        }
      } else {
        const block = blockingDependents(id, removed)
        if (block.length) {
          set({
            lastError: `Remove ${block.map((x) => PARTS_BY_ID[x]?.name ?? x).join(', ')} first.`,
            selectedId: block[0],
          })
          return
        }
      }
    }
    const next = { ...removed, [id]: !isRemoved }
    pushHistory(get, set, next)
  },
  removeIds: (ids) => {
    const next = { ...get().removed }
    ids.forEach((id) => {
      next[id] = true
    })
    pushHistory(get, set, next)
  },
  installIds: (ids) => {
    const { removed, enforceDeps } = get()
    const next = { ...removed }
    const blocked: string[] = []
    ids.forEach((id) => {
      if (enforceDeps && missingDeps(id, next).length) {
        blocked.push(id)
        return
      }
      next[id] = false
    })
    pushHistory(get, set, next)
    if (blocked.length) {
      set({
        lastError: `Skipped ${blocked.length} part(s) with unmet dependencies.`,
      })
    }
  },
  setExplode: (v) =>
    set({
      explode: v,
      mode: v > 0.02 ? 'explode' : get().mode === 'explode' ? 'inspect' : get().mode,
    }),
  setMode: (m) =>
    set({
      mode: m,
      explode: m === 'explode' ? Math.max(get().explode, 0.85) : m === 'inspect' || m === 'build' ? 0 : get().explode,
    }),
  setIsolating: (v) => set({ isolating: v }),
  toggleCategory: (c) =>
    set({ hiddenCategories: { ...get().hiddenCategories, [c]: !get().hiddenCategories[c] } }),
  setTrainingMode: (m) =>
    set({
      trainingMode: m,
      trainingIndex: 0,
      mode: 'training',
      removed: m === 'assembly' ? allRemoved() : {},
      history: [],
      future: [],
    }),
  setTrainingIndex: (i) => set({ trainingIndex: i }),
  nextStep: () => {
    const { trainingMode, trainingIndex } = get()
    const steps = trainingMode === 'disassembly' ? DISASSEMBLY_STEPS : ASSEMBLY_STEPS
    const i = Math.min(trainingIndex + 1, steps.length - 1)
    set({ trainingIndex: i, mode: 'training' })
  },
  prevStep: () => {
    const i = Math.max(get().trainingIndex - 1, 0)
    set({ trainingIndex: i })
  },
  applyCurrentStep: () => {
    const { trainingMode, trainingIndex, removeIds, installIds } = get()
    const steps = trainingMode === 'disassembly' ? DISASSEMBLY_STEPS : ASSEMBLY_STEPS
    const step = steps[trainingIndex]
    if (!step) return
    const ids = step.partIds.filter((id) => PARTS_BY_ID[id])
    if (trainingMode === 'disassembly') removeIds(ids)
    else installIds(ids)
  },
  resetAll: () =>
    pushHistory(get, (p) => set({ ...p, explode: 0, selectedId: null, isolating: false, mode: 'inspect' }), {}),
  stripAll: () => pushHistory(get, set, allRemoved()),
  emptyBay: () =>
    set({
      removed: allRemoved(),
      explode: 0,
      mode: 'build',
      selectedId: null,
      history: [],
      future: [],
      lastError: null,
    }),
  setGhostRemoved: (v) => set({ ghostRemoved: v }),
  setAutoRotate: (v) => set({ autoRotate: v }),
  setShowLabels: (v) => set({ showLabels: v }),
  setShowConnectors: (v) => set({ showConnectors: v }),
  setEnforceDeps: (v) => set({ enforceDeps: v }),
  resetCamera: () => set({ cameraNonce: get().cameraNonce + 1, cameraView: 'iso' }),
  setCameraView: (v) => set({ cameraView: v, cameraNonce: get().cameraNonce + 1 }),
  undo: () => {
    const { history, removed, future } = get()
    if (!history.length) return
    const prev = history[history.length - 1]
    set({
      history: history.slice(0, -1),
      future: [cloneRemoved(removed), ...future].slice(0, HISTORY_MAX),
      removed: prev,
      lastError: null,
    })
  },
  redo: () => {
    const { future, removed, history } = get()
    if (!future.length) return
    const next = future[0]
    set({
      future: future.slice(1),
      history: [...history, cloneRemoved(removed)].slice(-HISTORY_MAX),
      removed: next,
      lastError: null,
    })
  },
  clearError: () => set({ lastError: null }),
}))
