import {
	getHistory,
	getLocation,
	getWindow,
} from '@/utils/globals'
import { bindActions } from "redux-zero/utils";

export const setCurrentLocation = (state, url) => ({ location: url })

export const startRouter = (store) => {
  const actions = bindActions({
    setCurrentLocation,
  }, store);
  getWindow().onpopstate = () => {
    const url = getLocation()
    actions.setCurrentLocation(url)
  }
}

export const createNavigateAction = (store) => {
  const actions = bindActions({
    setCurrentLocation,
  }, store);
  return (state, url) => {
    const stateLocation = store.getState().location
    if(getLocation().toString() !== url.toString()) {
      getHistory().pushState(null, null, url.toString())
      actions.setCurrentLocation(url)
    } else if (!stateLocation || stateLocation.toString() !== url.toString()) {
      actions.setCurrentLocation(url)
    }
  }
} 

export const navigateBack = () => getHistory().back()

export const navigateForward = () => getHistory().forward()
