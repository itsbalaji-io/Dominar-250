import { PARTS, PARTS_BY_ID, KITS } from './catalogue'
import { ASSEMBLY_STEPS, DISASSEMBLY_STEPS } from './training'
import { FICHE_KITS, FICHE_META, FICHE_PLATES, MESH_TO_PLATES, PLATES_BY_NO } from './fiche'

export interface IntegrityIssue {
  level: 'error' | 'warn'
  message: string
}

export function runIntegrity(): IntegrityIssue[] {
  const issues: IntegrityIssue[] = []
  const ids = new Set(PARTS.map((p) => p.id))
  if (ids.size !== PARTS.length) issues.push({ level: 'error', message: 'Duplicate part ids' })

  for (const p of PARTS) {
    if (/^DH2-/.test(p.oem) || /glpat-|OEM-\d/.test(p.oem)) {
      issues.push({ level: 'error', message: `Invented OEM-looking code on ${p.id}` })
    }
    for (const d of p.dependsOn) {
      if (!PARTS_BY_ID[d]) issues.push({ level: 'error', message: `${p.id} depends on missing ${d}` })
    }
    if (p.parentId && !PARTS_BY_ID[p.parentId]) {
      issues.push({ level: 'error', message: `${p.id} parent missing ${p.parentId}` })
    }
  }

  for (const k of KITS) {
    for (const id of k.partIds) {
      if (!PARTS_BY_ID[id]) issues.push({ level: 'warn', message: `Kit ${k.id} unknown part ${id}` })
    }
  }

  const trainIds = new Set<string>()
  for (const s of [...DISASSEMBLY_STEPS, ...ASSEMBLY_STEPS]) {
    for (const id of s.partIds) trainIds.add(id)
  }
  for (const id of trainIds) {
    if (!PARTS_BY_ID[id]) issues.push({ level: 'warn', message: `Training references unmodelled id ${id}` })
  }

  if (FICHE_PLATES.length !== FICHE_META.claimedPlates) {
    issues.push({ level: 'warn', message: `Fiche plates ${FICHE_PLATES.length} vs claimed ${FICHE_META.claimedPlates}` })
  }
  if (FICHE_KITS.length !== FICHE_META.claimedKits) {
    issues.push({ level: 'warn', message: `Fiche kits ${FICHE_KITS.length} vs claimed ${FICHE_META.claimedKits}` })
  }
  const ficheLines = FICHE_PLATES.reduce((n, p) => n + p.parts.length, 0)
  if (ficheLines < 1200) {
    issues.push({ level: 'warn', message: `Fiche line items ${ficheLines} (site claims ${FICHE_META.claimedParts})` })
  }
  for (const [id, plates] of Object.entries(MESH_TO_PLATES)) {
    if (!PARTS_BY_ID[id]) issues.push({ level: 'warn', message: `MESH_TO_PLATES unknown mesh ${id}` })
    for (const n of plates) {
      if (!PLATES_BY_NO[n]) issues.push({ level: 'warn', message: `MESH_TO_PLATES ${id} missing plate ${n}` })
    }
  }
  return issues
}

export const INTEGRITY = runIntegrity()
