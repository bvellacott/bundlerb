import { h } from 'preact'
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

export const NotFound = connect(null, actions)(() => (
	<div className="not-found">
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
			<h1>404</h1>
		</Header>
		<main>
			<h2>Sorry - that page wasn't found</h2>
			<Toolgrid>
				<Link href="/index.html" ><button>Home</button></Link>
				<div />
			</Toolgrid>
		</main>
	</div>
))
