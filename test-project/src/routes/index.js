import { h } from 'preact'
import { IndexRoute } from './IndexRoute'
import { Introduction } from './Introduction'
import { Approach } from './Approach'
import { Finally } from './Finally'
import { NotFound } from './NotFound'
import { Error } from './Error'

export const Routes = ({ path }) => (
  (path === '/index.html' && <IndexRoute/>) ||
  (path === '/introduction.html' && <Introduction/>) ||
  (path === '/approach.html' && <Approach/>) ||
  (path === '/finally.html' && <Finally/>) ||
  (path === '/500.html' && <Error/>) ||
  <NotFound/>
)
