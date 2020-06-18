import { h, render } from 'preact'
import App from './App';
import './index.scss';

render(<App path={location.pathname} />, document.body);