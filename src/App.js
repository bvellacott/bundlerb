import { h } from 'preact';
import Logo from './logo.svg';
import { Paragraph } from './Paragraph'
import './App.scss';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <div className="App-logo">
          <Logo />
        </div> */}
        <img src="/src/logo.svg" className="App-logo" alt="logo" />
        <Paragraph />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
