import { h, Fragment } from 'preact'
import { NotFound } from './NotFound'

export const Routes = ({ path }) => console.log('path', path) || (
  (path === '/' && (
    <>
      <h1>Mocks application</h1>
      <p>This is the mocks application that contains the wireframes and components in their different settings.</p>
    </>
  )) ||
  <NotFound/>
)