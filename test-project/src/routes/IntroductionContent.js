import { h, Fragment } from 'preact'
import { InlineImage } from '@/components/InlineImage'

export const IntroductionContent = () => (
	<>
    <p>
      This is a pet project arising from frustration towards configuring build tools such as
      webpack, broccoli and gulp. I always felt, as probably many others have, that the problem
      of js build tools hasn't quite been cracked yet. Maybe it never will? The benefits of a good
      build tool are massive though, especially when targeting delivery speed and/or seo performance.
      <InlineImage src="/bundlerb_mirror.gif" />
      While I'm very aware that there are tools like <a href="https://github.com/jaredpalmer/razzle">Razzle</a> out
      there, this project is my exhibition into solving modern js build challenges.
      <InlineImage src="/bundlerb.gif" />
    </p>
    <h3>Gulp</h3>
    <p>
      As you may know gulp is one of the original 'easy' build tools
      which quickly ran into performance issues as the responsibilities for build tools grew
      with the introduction of mudularisation and language enhancements (es6, sass) for large js + css
      projects.
    </p>
    <h3>Broccoli <InlineImage src="/bundlerb.gif" /></h3>
    <p>
      Broccoli brought something approaching constant time dev builds (probably logarithmic in truth)
      by introducing a tree-like cache, but configuring it involved a lot of in depth knowledge
      and personally I never quite managed to create the build of my dreams using it partly because, 
      I think the tree cache wasn't quite the right kind of cache.
    </p>
    <h3><InlineImage src="/bundlerb_mirror.gif" /> Webpack</h3>
    <p>
      Webpack on the other hand seemed to provide a manageable configuration architechture, although 
      one that still demanded a fair bit of in depth knowledge if anything ambitious was to be achieved 
      and in my experience it suffered in performance relative to broccoli.
    </p>
  </>
)
