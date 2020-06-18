import { h } from 'preact'
import { IndexRoute } from './IndexRoute'
import { NotFound } from './NotFound'

export const Routes = ({ path }) => (
  (path === '/index.html' && <IndexRoute/>) ||
  // (path === '/subroute/index.html' && <Subroute/>) ||
  <NotFound/>
)