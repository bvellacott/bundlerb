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

export const Link = connect(null, actions)(({ href, navigate, ...props }) => (
  <a onClick={(e) => onClick(e, navigate, href)} {...props} />
))
