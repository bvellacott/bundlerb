import { h } from 'preact'
import { Page } from '@/components/Page'
import { Toolgrid } from '@/components/Toolgrid'
import { Link } from '@/components/inputs/Link'
import { Header } from '@/components/Header'
import { BigLogo } from '@/components/BigLogo'

export const IndexRoute = () => (
	<Page>
    <Header>
      <h1>BundlerB</h1>
    </Header>
    <main>
      <BigLogo src="/bundlerb.gif" />
    </main>
    <footer>
      <Toolgrid>
        <Link href="/introduction.html" ><button>Introduction</button></Link>
      </Toolgrid>
    </footer>
	</Page>
)
