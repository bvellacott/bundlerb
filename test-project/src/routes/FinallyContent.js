import { h, Fragment } from 'preact'
import { InlineImage } from '@/components/InlineImage'

export const FinallyContent = () => (
	<>
    <p>
      <InlineImage src="/bundlerb_mirror.gif" />I found my inspection into building my own build tool very fruitful.
      BundlerB<InlineImage src="/bundlerb.gif" /> hasn't seen war yet, but it has a nice name, and all my future js 
      projects will continue to be built with it and maybe at some point I will know where to draw the line between
      configuration and code, and I'll make it an npm package. At the moment though I'll keep it as an example project
      to which and from which I keep migrating changes.
    </p>
  </>
)
