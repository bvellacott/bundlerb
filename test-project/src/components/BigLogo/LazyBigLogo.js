import { h } from 'preact'
import { LazyLoad } from '@/components/LazyLoad'

export const LazyBigLogo = ({ src }) => (
  <LazyLoad
    promise={new Promise((resolve) => {
      requireAsync('/src/components/BigLogo/index.js', ({ BigLogo }) => {
        resolve(<BigLogo src="/bundlerb.gif" />)
      }, { loadStyles: true })
    })}
  />
)
