import { useState } from "react";
import Header from "../components/Header";

function Home() {

  const [dark, setDark] = useState(false);

  function toggleDark() {
    setDark(!dark);
  }

  return (

    <div className={dark ? "home dark-mode" : "home"}>

      <Header toggleDark={toggleDark} dark={dark} />

      <section className="hero">

        <h1>Encontre sua primeira experiência em tecnologia</h1>

        <p>
          Conectamos desenvolvedores iniciantes a projetos reais
        </p>

      </section>

    </div>
  );
}

export default Home;