import logo from './logo.svg';
import './App.css';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <code>Login to begin chat with someone</code>.
        </p>
        <Link className="App-link" to="/login">Let's Begin!</Link>
      </header>
    </div>
  );
}

export default App;
