import { h } from 'preact';
import { Paragraph } from '@/components/Paragraph'
import './App.scss';

const App = ({ path }) => {
  const href = path === '/aapp.html' ? '/aapp/bapp.html' : '/aapp.html'
  return (
    <div className="App">
      <h1>{path}</h1>
      <header className="App-header">
        <img src="/src/logo.svg" className="App-logo" alt="logo" />
        <Paragraph />
        <a className="App-link" href={href}>{href}</a>
      </header>
    </div>
  );
}

export default App;
