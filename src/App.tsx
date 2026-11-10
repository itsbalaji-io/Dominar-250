import { Studio } from './scene/Studio'
import { Hud } from './ui/Hud'
import { Hotkeys } from './ui/Hotkeys'

export default function App() {
  return (
    <div className="app">
      <Studio />
      <Hud />
      <Hotkeys />
    </div>
  )
}
