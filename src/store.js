import createStore from 'redux-zero'
import { applyMiddleware } from 'redux-zero/middleware'
import { connect } from 'redux-zero/devtools'
import { getLocation } from '@/utils/globals'

export const createInitialState = () => ({
  location: new URL(getLocation().toString()),
})

export const configureStore = () => {
	const isDev = process.env.NODE_ENV === 'development'
  const initialState = createInitialState()
  // redux dev tools
	const middlewares = (isDev && connect) ? applyMiddleware(connect(initialState)) : []

  return createStore(
		initialState,
		middlewares,
	)
}
