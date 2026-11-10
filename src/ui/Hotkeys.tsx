import { useEffect } from 'react'
import { useBike } from '../store'

export function Hotkeys() {
  const undo = useBike((s) => s.undo)
  const redo = useBike((s) => s.redo)
  const toggleRemoved = useBike((s) => s.toggleRemoved)
  const selectedId = useBike((s) => s.selectedId)
  const setExplode = useBike((s) => s.setExplode)
  const explode = useBike((s) => s.explode)
  const setMode = useBike((s) => s.setMode)
  const resetAll = useBike((s) => s.resetAll)
  const emptyBay = useBike((s) => s.emptyBay)
  const setCameraView = useBike((s) => s.setCameraView)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
        return
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        redo()
        return
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) toggleRemoved(selectedId)
      }
      if (e.key === 'e') setExplode(explode > 0.2 ? 0 : 0.85)
      if (e.key === 't') setMode('training')
      if (e.key === 'b') emptyBay()
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey) resetAll()
      if (e.key === '1') setCameraView('iso')
      if (e.key === '2') setCameraView('front')
      if (e.key === '3') setCameraView('rear')
      if (e.key === '4') setCameraView('left')
      if (e.key === '5') setCameraView('right')
      if (e.key === '6') setCameraView('top')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo, toggleRemoved, selectedId, setExplode, explode, setMode, resetAll, emptyBay, setCameraView])

  return null
}
