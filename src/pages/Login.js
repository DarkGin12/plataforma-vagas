import Header from "../components/Header";

function Login() {
  return (
    <>
      <Header />

      <div className="login-page">

        <div className="login-card">

          <h2>Entrar na plataforma</h2>

          <button className="github-btn">
            Entrar com GitHub
          </button>

          <div className="divider">
            <span>ou</span>
          </div>

          <form className="login-form">

            <input
              type="email"
              placeholder="Email"
              required
            />

            <input
              type="password"
              placeholder="Senha"
              required
            />

            <button className="btn-primary">
              Entrar
            </button>

          </form>

          <a className="forgot" href="#">
            Esqueci minha senha
          </a>

        </div>

      </div>
    </>
  );
}

export default Login;