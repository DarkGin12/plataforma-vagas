import { useState } from "react";
import Header from "../components/Header";

function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    github: ""
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(form);
  }

  return (

    <>
      <Header />

      <div className="form-container">

        <h2>Criar Conta</h2>

        <button className="github-btn">
          Cadastrar com GitHub
        </button>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirm"
            placeholder="Confirmar senha"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="github"
            placeholder="Link do GitHub"
            onChange={handleChange}
          />

          <button className="btn-primary">
            Criar Conta
          </button>

        </form>

      </div>

    </>
  );
}

export default Register;