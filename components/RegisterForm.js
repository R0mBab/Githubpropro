// components/RegisterForm.js
import { useState } from "react";
import { useIntl } from "react-intl";
import styles from "../styles/RegisterForm.module.css";

const RegisterForm = ({ onRegister }) => {
  const intl = useIntl();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setError(intl.formatMessage({ id: "registerFormIncomplete" }));
      return;
    }

    // Здесь будет логика отправки данных на сервер
    onRegister({ username, email, password });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{intl.formatMessage({ id: "registerTitle" })}</h2>
      {error && <p className={styles.error}>{error}</p>}
      <input
        type="text"
        placeholder={intl.formatMessage({ id: "usernamePlaceholder" })}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder={intl.formatMessage({ id: "emailPlaceholder" })}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder={intl.formatMessage({ id: "passwordPlaceholder" })}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">
        {intl.formatMessage({ id: "registerButton" })}
      </button>
    </form>
  );
};

export default RegisterForm;
