import './BigLogo.scss'
import { h } from 'preact'

export const BigLogo = ({ src }) => (
  <div className="big-logo__wrapper">
    <img className="big-logo" src={src} />
  </div>
)
