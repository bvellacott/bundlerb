import { h } from 'preact'
import { Page } from '@/components/Page'
import { Toolgrid } from '@/components/Toolgrid'
import { Link } from '@/components/inputs/Link'
import { Header } from '@/components/Header'
import { LazyLoad } from '../components/LazyLoad'

export const Approach = () => (
	<Page>
    <Header>
      <h1>BundlerB - Bundle on the fly (... or bee as the case may be)</h1>
    </Header>
    <main>
      <LazyLoad
        promise={new Promise((resolve) => {
          requireAsync('./src/routes/ApproachContent.js', ({ ApproachContent }) => {
            resolve(<ApproachContent />)
          }, { loadStyles: true, force: true })
        })}
      >
        <h2>Loading...</h2>
      </LazyLoad>
    </main>
    <footer>
      <Toolgrid>
        <Link href="/introduction.html" ><button>{'Intro'}</button></Link>
        <Link href="/finally.html" ><button>{'Finally'}</button></Link>
      </Toolgrid>
      <Toolgrid>
        <Link href="/index.html" ><button>{'Home'}</button></Link>
      </Toolgrid>
    </footer>
	</Page>
)
