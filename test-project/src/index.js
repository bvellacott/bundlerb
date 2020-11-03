import { h, render } from 'preact'
import { Provider } from 'redux-zero/preact'
import { bindActions } from "redux-zero/utils";
import {
  getDocument,
  getLocation,
} from '@/utils/globals'
import { configureStore } from '@/store'
import {
  startRouter,
  createNavigateAction,
} from '@/actions/history'
import { App } from '@/components/App'

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

  render(<Main />, getDocument().body)
}

init()

// resume the loading sequence [see "preload.js" for details]
define.resume()
