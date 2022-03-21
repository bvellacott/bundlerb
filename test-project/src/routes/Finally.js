import { h } from 'preact'
import { Page } from '@/components/Page'
import { Toolgrid } from '@/components/Toolgrid'
import { Link } from '@/components/inputs/Link'
import { Header } from '@/components/Header'
import { LazyBigLogo } from '@/components/BigLogo/LazyBigLogo'
import { LazyLoad } from '@/components/LazyLoad'

export const Finally = () => (
	<Page>
    <Header>
      <h1>BundlerB - Final Conclusion</h1>
    </Header>
    <main>
      <LazyLoad
        promise={new Promise((resolve) => {
          requireAsync('./src/routes/FinallyContent.js', ({ FinallyContent }) => {
            resolve(<FinallyContent />)
          }, { loadStyles: true })
        })}
      >
        <h2>Loading...</h2>
      </LazyLoad>
    </main>
    <footer>
      <Toolgrid>
        <Link href="/approach.html" ><button>{'On the B'}</button></Link>
        <Link href="/index.html" ><button>{'Home'}</button></Link>
      </Toolgrid>
      <LazyBigLogo src="/bundlerb_mirror.gif" />
    </footer>
	</Page>
)
