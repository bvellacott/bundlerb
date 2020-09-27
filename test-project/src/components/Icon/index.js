import './Icon.scss'
import { h } from 'preact'

export const Icon = ({
  children,
  modifier,
  onClick,
}) => (
  <span
    className={`icon icon--${modifier}`}
    onClick={onClick}
  >
    {children}
  </span>
)
