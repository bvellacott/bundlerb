import { h, Fragment } from 'preact'
import { Page } from '@/components/Page'
import { Toolgrid } from '@/components/Toolgrid'
import { Link } from '@/components/inputs/Link'
import { Header } from '@/components/Header'

export const IndexRoute = () => (
	<Page>
    <Header>
      <h1>Meek</h1>
    </Header>
    <main>
      <h2>Welcome to Meek</h2>
      <p>Please select an option to start working</p>
      <Toolgrid>
        <Link href="/new" ><button>New</button></Link>
        <Link href="/open" ><button>Open</button></Link>
      </Toolgrid>
    </main>
	</Page>
)
