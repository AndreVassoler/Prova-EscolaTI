import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <form>
      <input type="text" placeholder="nome do curso" />
      <input type="number" placeholder="Carga horária" />
      <input type="data" placeholder="Data de inicio" />
      <button type="submit">Enviar</button>
    </form>
  );
}

export default App;
