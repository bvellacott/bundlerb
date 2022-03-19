import { addWebsocketControlClient } from 'bundlerb/client/websocketControlClient'
import { h, render } from 'preact'
import { Provider } from 'redux-zero/preact'
import { bindActions } from "redux-zero/utils"
import { configureStore } from '@/store'
import {
  startRouter,
  createNavigateAction,
} from '@/actions/history'
import { App } from '@/components/App'

const isDev = process.env.NODE_ENV === 'development'

const init = () => {
  const store = configureStore()
  const Main = () => (
    <Provider store={store}>
      <App />
    </Provider>
  );

  startRouter(store)

  const actions = bindActions({
    navigate: createNavigateAction(store),
  }, store)
  actions.navigate(document.location)

  render(<Main />, document.getElementById('root'))
}

init()

if (isDev) {
  addWebsocketControlClient({
    actions: {
      fileChanged: (id, { filename = '' }) => {
        if (filename.endsWith('.css') || filename.endsWith('.scss')) {
          const style = document.querySelector('link[href*="/src/index.jscss"]')
          style.setAttribute('href', `/src/index.jscss?change=${id}`)
        } else if (filename.endsWith('.js') || filename.endsWith('.jsx') || filename.endsWith('.mjs')) {
          document.location.reload()
        }
      }
    }
  })
}
