import { useEffect, useMemo, useState } from 'react'
import { CATEGORIES, KITS, PARTS, PARTS_BY_ID, type PartCategory } from '../data/catalogue'
import { FICHE_KITS, FICHE_META, FICHE_PLATES, MESH_TO_PLATES, PLATES_BY_NO } from '../data/fiche'
import { INTEGRITY } from '../data/integrity'
import { LIMITATIONS, PUBLIC_SPECS } from '../data/specs'
import { MILESTONES } from '../data/progress'
import { ASSEMBLY_STEPS, DISASSEMBLY_STEPS } from '../data/training'
import { CAMERA_VIEWS, useBike, type CameraView } from '../store'

export function Hud() {
  const [query, setQuery] = useState('')
  const [plateNo, setPlateNo] = useState('1')
  const [ficheQuery, setFicheQuery] = useState('')
  const selectedId = useBike((s) => s.selectedId)
  const explode = useBike((s) => s.explode)
  const mode = useBike((s) => s.mode)
  const isolating = useBike((s) => s.isolating)
  const hiddenCategories = useBike((s) => s.hiddenCategories)
  const trainingMode = useBike((s) => s.trainingMode)
  const trainingIndex = useBike((s) => s.trainingIndex)
  const ghostRemoved = useBike((s) => s.ghostRemoved)
  const autoRotate = useBike((s) => s.autoRotate)
  const showLabels = useBike((s) => s.showLabels)
  const showConnectors = useBike((s) => s.showConnectors)
  const enforceDeps = useBike((s) => s.enforceDeps)
  const lastError = useBike((s) => s.lastError)
  const cameraView = useBike((s) => s.cameraView)
  const removed = useBike((s) => s.removed)
  const history = useBike((s) => s.history)
  const future = useBike((s) => s.future)
  const setSelected = useBike((s) => s.setSelected)
  const setExplode = useBike((s) => s.setExplode)
  const setMode = useBike((s) => s.setMode)
  const setIsolating = useBike((s) => s.setIsolating)
  const toggleCategory = useBike((s) => s.toggleCategory)
  const setTrainingMode = useBike((s) => s.setTrainingMode)
  const setTrainingIndex = useBike((s) => s.setTrainingIndex)
  const nextStep = useBike((s) => s.nextStep)
  const prevStep = useBike((s) => s.prevStep)
  const applyCurrentStep = useBike((s) => s.applyCurrentStep)
  const resetAll = useBike((s) => s.resetAll)
  const stripAll = useBike((s) => s.stripAll)
  const emptyBay = useBike((s) => s.emptyBay)
  const toggleRemoved = useBike((s) => s.toggleRemoved)
  const setGhostRemoved = useBike((s) => s.setGhostRemoved)
  const setAutoRotate = useBike((s) => s.setAutoRotate)
  const setShowLabels = useBike((s) => s.setShowLabels)
  const setShowConnectors = useBike((s) => s.setShowConnectors)
  const setEnforceDeps = useBike((s) => s.setEnforceDeps)
  const resetCamera = useBike((s) => s.resetCamera)
  const setCameraView = useBike((s) => s.setCameraView)
  const undo = useBike((s) => s.undo)
  const redo = useBike((s) => s.redo)

  const part = selectedId ? PARTS_BY_ID[selectedId] : undefined
  const mappedPlates = selectedId ? MESH_TO_PLATES[selectedId] ?? [] : []
  useEffect(() => {
    if (mappedPlates[0]) setPlateNo(mappedPlates[0])
  }, [selectedId])
  const plate = PLATES_BY_NO[plateNo] ?? FICHE_PLATES[0]
  const ficheHits = useMemo(() => {
    const q = ficheQuery.trim().toLowerCase()
    if (!q) return []
    const out: { plateNo: string; title: string; callout: string; partNoDisplay: string; description: string }[] = []
    for (const p of FICHE_PLATES) {
      for (const row of p.parts) {
        if (
          row.partNo.toLowerCase().includes(q) ||
          row.partNoDisplay.toLowerCase().includes(q) ||
          row.description.toLowerCase().includes(q)
        ) {
          out.push({
            plateNo: p.plateNo,
            title: p.title,
            callout: row.callout,
            partNoDisplay: row.partNoDisplay,
            description: row.description,
          })
          if (out.length >= 40) return out
        }
      }
    }
    return out
  }, [ficheQuery])
  const steps = trainingMode === 'disassembly' ? DISASSEMBLY_STEPS : ASSEMBLY_STEPS
  const step = steps[trainingIndex]
  const removedCount = useMemo(() => Object.values(removed).filter(Boolean).length, [removed])
  const installedCount = PARTS.length - removedCount
  const progressPct = Math.round((installedCount / PARTS.length) * 100)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return PARTS
    return PARTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.oem.toLowerCase().includes(q) ||
        p.id.includes(q) ||
        p.category.includes(q),
    )
  }, [query])

  return (
    <div className="hud">
      <header className="topbar">
        <div className="brand">
          <span className="mark">BAJAJ</span>
          <div>
            <h1>DOMINAR 250</h1>
            <p>Schematic 3D + Moonlight fiche ColorDoc 71120159 Rev. 10</p>
          </div>
        </div>
        <div className="modes">
          <button className={mode === 'inspect' ? 'on' : ''} onClick={() => setMode('inspect')}>
            Inspect
          </button>
          <button className={mode === 'explode' ? 'on' : ''} onClick={() => setMode('explode')}>
            Exploded
          </button>
          <button className={mode === 'training' ? 'on' : ''} onClick={() => setMode('training')}>
            Training
          </button>
          <button className={mode === 'build' ? 'on' : ''} onClick={emptyBay}>
            Empty bay
          </button>
        </div>
        <div className="stats">
          <span>{PARTS.length} meshes</span>
          <span>{FICHE_META.lineItems} fiche rows</span>
          <span>{FICHE_PLATES.length} plates</span>
          <span>{FICHE_KITS.length} kits</span>
          <span>{installedCount} fitted</span>
        </div>
      </header>

      <aside className="left">
        <label className="search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name / id / group"
          />
        </label>
        <div className="cats">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={hiddenCategories[c.id] ? 'off' : ''}
              style={{ ['--c' as string]: c.color }}
              onClick={() => toggleCategory(c.id as PartCategory)}
              title={hiddenCategories[c.id] ? 'Show' : 'Hide'}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="plist">
          {filtered.map((p) => (
            <button
              key={p.id}
              className={`prow ${selectedId === p.id ? 'sel' : ''} ${removed[p.id] ? 'gone' : ''}`}
              onClick={() => setSelected(p.id)}
            >
              <i style={{ background: CATEGORIES.find((x) => x.id === p.category)?.color }} />
              <span>{p.name}</span>
              <code>{p.id}</code>
            </button>
          ))}
        </div>
      </aside>

      <aside className="right">
        <section>
          <h2>View</h2>
          <label className="row">
            Explode
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={explode}
              onChange={(e) => setExplode(Number(e.target.value))}
            />
          </label>
          <div className="btns">
            {(Object.keys(CAMERA_VIEWS) as CameraView[]).map((v) => (
              <button key={v} className={cameraView === v ? 'on' : ''} onClick={() => setCameraView(v)}>
                {v}
              </button>
            ))}
            <button onClick={() => setAutoRotate(!autoRotate)}>{autoRotate ? 'Stop spin' : '360 spin'}</button>
            <button onClick={resetCamera}>Reset cam</button>
            <button onClick={() => setShowLabels(!showLabels)}>{showLabels ? 'Hide tags' : 'Show tags'}</button>
            <button onClick={() => setIsolating(!isolating)}>{isolating ? 'Show all' : 'Isolate'}</button>
            <button onClick={() => setGhostRemoved(!ghostRemoved)}>{ghostRemoved ? 'Hide ghosts' : 'Ghosts'}</button>
            <button onClick={() => setShowConnectors(!showConnectors)}>{showConnectors ? 'Hide links' : 'Links'}</button>
            <button onClick={() => setEnforceDeps(!enforceDeps)}>{enforceDeps ? 'Deps ON' : 'Free fit'}</button>
            <button onClick={undo} disabled={!history.length}>Undo</button>
            <button onClick={redo} disabled={!future.length}>Redo</button>
            <button onClick={resetAll}>Reassemble</button>
            <button onClick={stripAll}>Strip all</button>
            <button onClick={emptyBay}>Empty bay</button>
          </div>
          <div className="bar"><i style={{ width: `${progressPct}%` }} /></div>
          <p className="hint">Drag orbit, scroll zoom, right-drag pan. Click select, double-click remove/fit. Ctrl+Z undo. Keys 1-6 views, E explode, B empty bay.</p>
          {lastError && <p className="caution">{lastError}</p>}
        </section>

        <section>
          <h2>Selected component</h2>
          {part ? (
            <div className="card">
              <h3>{part.name}</h3>
              <dl>
                <dt>Workshop ID</dt>
                <dd>{part.id}</dd>
                <dt>OEM PN</dt>
                <dd>{mappedPlates.length ? 'See fiche rows below' : part.oem}</dd>
                <dt>Group</dt>
                <dd>{part.category}</dd>
                <dt>Install order</dt>
                <dd>{part.installStep}</dd>
                <dt>Qty</dt>
                <dd>{part.qty}</dd>
                <dt>Geometry</dt>
                <dd>{part.geometry}</dd>
                <dt>Confidence</dt>
                <dd>{part.confidence}</dd>
                <dt>Source</dt>
                <dd>{part.source}</dd>
                {part.kit && (
                  <>
                    <dt>Kit</dt>
                    <dd>{KITS.find((k) => k.id === part.kit)?.name ?? part.kit}</dd>
                  </>
                )}
              </dl>
              <p>{part.description}</p>
              {part.dependsOn.length > 0 && (
                <p className="muted">Depends on: {part.dependsOn.map((id) => PARTS_BY_ID[id]?.name ?? id).join(', ')}</p>
              )}
              {part.notes && <p className="caution">{part.notes}</p>}
              {mappedPlates.length > 0 && (
                <div className="fiche-map">
                  {mappedPlates.map((n) => {
                    const pl = PLATES_BY_NO[n]
                    return (
                      <button key={n} type="button" onClick={() => setPlateNo(n)}>
                        Plate {n} {pl?.title}
                        <small>{pl?.parts.length} rows</small>
                      </button>
                    )
                  })}
                </div>
              )}
              <button onClick={() => toggleRemoved(part.id)}>
                {removed[part.id] ? 'Install part' : 'Remove part'}
              </button>
            </div>
          ) : (
            <p className="muted">Select any component on the motorcycle or from the catalogue.</p>
          )}
        </section>

        <section>
          <h2>Build layers</h2>
          <ol className="miles">
            {MILESTONES.map((m) => (
              <li key={m.id} className={m.status}>
                <b>L{m.layer}</b> {m.title}
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2>Published specs</h2>
          <dl className="specs">
            {PUBLIC_SPECS.slice(0, 8).map((s) => (
              <div key={s.id}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2>Integrity</h2>
          {INTEGRITY.length === 0 ? (
            <p className="muted">Catalogue, meshes and training IDs match. No invented OEM numbers.</p>
          ) : (
            <ul className="limits">
              {INTEGRITY.map((i) => (
                <li key={i.message}>
                  {i.level}: {i.message}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2>Known limits</h2>
          <ul className="limits">
            {LIMITATIONS.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Moonlight fiche</h2>
          <p className="muted">
            {FICHE_META.model} · {FICHE_META.colorDoc} · {FICHE_META.rev} · {FICHE_META.date}. {FICHE_META.lineItems} published
            rows / {FICHE_META.claimedPlates} plates / {FICHE_META.claimedKits} kits. 3D is {PARTS.length} schematic meshes, not
            1:1 CAD.
          </p>
          <label className="search">
            <input
              value={ficheQuery}
              onChange={(e) => setFicheQuery(e.target.value)}
              placeholder="Search fiche PN / name"
            />
          </label>
          {ficheHits.length > 0 && (
            <div className="fiche-hits">
              {ficheHits.map((h, i) => (
                <button key={`${h.plateNo}-${h.partNoDisplay}-${i}`} type="button" onClick={() => setPlateNo(h.plateNo)}>
                  <code>{h.partNoDisplay}</code> {h.description}
                  <small>
                    Pl {h.plateNo} #{h.callout}
                  </small>
                </button>
              ))}
            </div>
          )}
          <div className="plate-select">
            <select value={plateNo} onChange={(e) => setPlateNo(e.target.value)}>
              {FICHE_PLATES.map((p) => (
                <option key={p.plateNo} value={p.plateNo}>
                  Plate {p.plateNo} — {p.title} ({p.parts.length})
                </option>
              ))}
            </select>
          </div>
          {plate && (
            <div className="fiche-plate">
              <a href={FICHE_META.url} target="_blank" rel="noreferrer">
                {plate.title}
              </a>
              <img src={plate.image} alt={`Plate ${plate.plateNo} ${plate.title}`} />
              <ol className="fiche-rows">
                {plate.parts.map((row) => (
                  <li key={`${row.partNo}-${row.callout}-${row.description}`}>
                    <b>{row.callout}</b>
                    <code>{row.partNoDisplay}</code>
                    <span>{row.description}</span>
                    <i>x{row.qty}</i>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>

        <section>
          <h2>Published kits (17)</h2>
          <div className="kits">
            {FICHE_KITS.map((k) => (
              <button key={k.kitPartNo} type="button" title={k.contents.map((c) => c.description).join(', ')}>
                {k.description}
                <small>
                  {k.kitPartNo} · {k.contents.length}
                </small>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>Workshop mesh kits</h2>
          <div className="kits">
            {KITS.map((k) => (
              <button key={k.id} onClick={() => k.partIds[0] && setSelected(k.partIds[0])}>
                {k.name}
                <small>{k.partIds.length}</small>
              </button>
            ))}
          </div>
        </section>
      </aside>

      {mode === 'training' && step && (
        <footer className="trainer">
          <div className="t-head">
            <div>
              <span className="badge">{trainingMode.toUpperCase()}</span>
              <strong>
                Step {step.order} / {steps.length}
              </strong>
              <h3>{step.title}</h3>
            </div>
            <div className="t-nav">
              <button
                className={trainingMode === 'disassembly' ? 'on' : ''}
                onClick={() => setTrainingMode('disassembly')}
              >
                Tear down
              </button>
              <button
                className={trainingMode === 'assembly' ? 'on' : ''}
                onClick={() => setTrainingMode('assembly')}
              >
                Rebuild
              </button>
            </div>
          </div>
          <p>{step.instruction}</p>
          {step.caution && <p className="caution">{step.caution}</p>}
          <div className="meta">
            <span>Tools: {step.tools.join(', ')}</span>
            <span>{step.estimatedMinutes} min</span>
            {step.torqueNm != null && <span>Torque {step.torqueNm} Nm</span>}
            <span>{step.category}</span>
          </div>
          <div className="chips">
            {step.partIds.map((id) => (
              <button key={id} className={PARTS_BY_ID[id] ? '' : 'missing'} onClick={() => PARTS_BY_ID[id] && setSelected(id)}>
                {PARTS_BY_ID[id]?.name ?? id}
              </button>
            ))}
          </div>
          <div className="t-nav">
            <button onClick={prevStep} disabled={trainingIndex === 0}>
              Previous
            </button>
            <button className="primary" onClick={applyCurrentStep}>
              {trainingMode === 'disassembly' ? 'Remove these parts' : 'Install these parts'}
            </button>
            <button onClick={nextStep} disabled={trainingIndex >= steps.length - 1}>
              Next
            </button>
            <input
              type="range"
              min={0}
              max={steps.length - 1}
              value={trainingIndex}
              onChange={(e) => setTrainingIndex(Number(e.target.value))}
            />
          </div>
        </footer>
      )}
    </div>
  )
}
