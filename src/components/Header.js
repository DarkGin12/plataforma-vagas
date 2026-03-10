import { Link } from "react-router-dom";

function Header({ toggleDark, dark }) {

  return (
    <header className="header">

      <h2 className="logo">MY FIRST JOB</h2>

      <nav className="nav">

        <Link to="/">Início</Link>
        <Link to="/vagas">Tarefas</Link>
        <Link to="/login">Login</Link>

        <Link to="/cadastro" className="btn-primary">
          Cadastre-se
        </Link>

        <button className="dark-btn" onClick={toggleDark}>
          {dark ? "☀️" : "🌙"}
        </button>

      </nav>

    </header>
  );
}

export default Header;