import { h, Fragment } from 'preact'
import { useState, useEffect } from 'preact/hooks'

export const LazyLoad = ({
  promise,
  children,
}) => {
  const [content, setContent] = useState(children)
  useEffect(() => promise.then(setContent), [])
  return <>{content}</>
}
