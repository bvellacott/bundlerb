import './NotFound.scss'
import { h } from 'preact'
import { Page } from '@/components/Page'
import { connect } from "redux-zero/preact";
import { navigateBack } from '@/actions/history'
import { Toolgrid } from '@/components/Toolgrid';
import { Link } from '@/components/inputs/Link'
import { Header } from '@/components/Header'
import { Icon } from '@/components/Icon'
import { CaretSvg } from '@/components/svgs/CaretSvg'

const actions = {
	navigateBack,
}

export const Error = connect(null, actions)(() => (
	<Page>
		<Header
			LeftIcon={
				<Icon
					modifier="rotate-270"
					onClick={navigateBack}
				>
					<CaretSvg />
				</Icon>
			}
		>
			<h1>500</h1>
		</Header>
		<main>
			<h2 className="not-found__apology" >Sorry - an internal server error occurred</h2>
		</main>
		<footer>
			<Toolgrid>
				<Link href="/index.html" ><button>Home</button></Link>
			</Toolgrid>
		</footer>
	</Page>
))
