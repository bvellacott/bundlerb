import './InlineImage.scss'
import { h, Fragment } from 'preact'

export const InlineImage = ({ src }) => (
  <span className="inline-image__wrapper">
    <img className="inline-image" src={src} />
  </span>
) 
