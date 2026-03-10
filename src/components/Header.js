import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Header() {

  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [dark]);

  function toggleDark() {
    setDark(!dark);
  }

  return (
    <header className="header">

      <h2>MY FIRST JOB</h2>

      <nav>
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