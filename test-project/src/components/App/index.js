import '../reset.css'
import '../base.css'
import { h } from 'preact'
import { connect } from 'redux-zero/preact'
import { Routes } from '@/routes'

const mapToProps = ({ location }, { path }) => ({
  path: path || location.pathname,
}) 

export const App = connect(mapToProps)(({ path }) => (
  <Routes path={path} />
))
