import { addWebsocketControlClient } from 'bundlerb/client/websocketControlClient'
import { h, render } from 'preact'
import { Provider } from 'redux-zero/preact'
import { bindActions } from "redux-zero/utils"
import {
  getWindow,
  getLocation,
} from '@/utils/globals'
import { configureStore } from '@/store'
import {
  startRouter,
  createNavigateAction,
} from '@/actions/history'
import { App } from '@/components/App/__mocks__'

const isDev = process.env.NODE_ENV === 'development'

const init = () => {
  const location = getLocation()
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
  actions.navigate(location)

  render(<Main />, getWindow().getElementById('root'))
}

init()

if (isDev) {
  addWebsocketControlClient({
    actions: {
      fileChanged: (id, { filename = '' }) => {
        if (filename.endsWith('.css') || filename.endsWith('.scss')) {
          const style = document.querySelector('link[href*="/src/index.jscss"]')
          style.setAttribute('href', `/src/index.jscss?change=${id}`)
        }
      }
    }
  })
}
