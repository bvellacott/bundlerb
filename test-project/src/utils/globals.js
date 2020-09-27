let _window
try { _window = window || global } catch(e) { _window = global }
export const getWindow = () => _window

export const getDocument = () => getWindow().document || {}

export const getLocation = () => getDocument().location || {}

export const getHistory = () => getWindow().history || {
  back: () => {},
  forward: () => {},
  pushState: () => {},
}
