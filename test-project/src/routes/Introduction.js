import { h } from 'preact'
import { Page } from '@/components/Page'
import { Toolgrid } from '@/components/Toolgrid'
import { Link } from '@/components/inputs/Link'
import { Header } from '@/components/Header'
import { LazyLoad } from '@/components/LazyLoad'

export const Introduction = () => (
	<Page>
    <Header>
      <h1>BundlerB - Introduction</h1>
    </Header>
    <main>
      <LazyLoad
        promise={new Promise((resolve) => {
          requireAsync('./src/routes/IntroductionContent.js', ({ IntroductionContent }) => {
            resolve(<IntroductionContent />)
          }, { loadStyles: true })
        })}
      >
        <h2>Loading...</h2>
      </LazyLoad>
    </main>
    <footer>
      <Toolgrid>
        <Link href="/index.html" ><button>{'Home'}</button></Link>
        <Link href="/approach.html" ><button>{'On the B'}</button></Link>
      </Toolgrid>
    </footer>
	</Page>
)
