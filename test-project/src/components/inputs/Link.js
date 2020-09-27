import { h } from 'preact'
import { connect } from "redux-zero/preact";
import { createNavigateAction } from '@/actions/history'

export const onClick = (e, navigate, href) => {
  e.preventDefault()
  navigate(new URL(`${location.origin}${href}`))
}

const actions = (store) => ({
  navigate: createNavigateAction(store),
})

export const Link = connect(null, actions)(({ className, href, navigate, children }) => (
  <a
    className={className}
    href={href}
    onClick={(e) => onClick(e, navigate, href)}
    children={children}
  />
))
