import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  function entrar(e) {
    e.preventDefault();
    navigate("/home");
  }

  return (
    <div className="login">
      <h1>Login</h1>

      <form onSubmit={entrar}>
        <label>Usuário</label>

        <input
          type="text"
          placeholder="Digite seu usuário"
        />

        <label>Senha</label>

        <input
          type="password"
          placeholder="Digite sua senha"
        />

        <button type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}