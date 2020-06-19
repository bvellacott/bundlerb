import { h } from 'preact'
import { Page } from '@/components/Page'
import { Toolgrid } from '@/components/Toolgrid'
import { Link } from '@/components/inputs/Link'
import { Header } from '@/components/Header'
import { InlineImage } from '@/components/InlineImage'
import { BigLogo } from '@/components/BigLogo'

export const Finally = () => (
	<Page>
    <Header>
      <h1>BundlerB - Final Conclusion</h1>
    </Header>
    <main>
      <p>
        <InlineImage src="/bundlerb_mirror.gif" />I found my inspection into building my own build tool very fruitful.
        BundlerB<InlineImage src="/bundlerb.gif" /> hasn't seen war yet, but it has a nice name, and all my future js 
        projects will continue to be built with it and maybe at some point I will know where to draw the line between
        configuration and code, and I'll make it an npm package. At the moment though I'll keep it as an example project
        to which and from which I keep migrating changes.
      </p>
    </main>
    <footer>
      <Toolgrid>
        <Link href="/approach.html" ><button>{'On the B'}</button></Link>
        <Link href="/index.html" ><button>{'Home'}</button></Link>
      </Toolgrid>
      <BigLogo src="/bundlerb_mirror.gif" />
    </footer>
	</Page>
)
