import { h } from 'preact'
import { LazyLoad } from '@/components/LazyLoad'

export const LazyBigLogo = ({ src, force }) => (
  <LazyLoad
    promise={new Promise((resolve) => {
      requireAsync('/src/components/BigLogo/index.js', ({ BigLogo }) => {
        resolve(<BigLogo src={src} />)
      }, { loadStyles: true, force })
    })}
  />
)
