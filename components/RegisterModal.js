// components/RegisterModal.js
import { useState } from "react";
import { useIntl } from "react-intl";
import styles from "../styles/RegisterModal.module.css";

const RegisterModal = ({ onClose, onRegister }) => {
  const intl = useIntl();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onRegister({ email, name, password });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>{intl.formatMessage({ id: "registerTitle" })}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            {intl.formatMessage({ id: "emailLabel" })}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            {intl.formatMessage({ id: "nameLabel" })}
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label>
            {intl.formatMessage({ id: "passwordLabel" })}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button type="submit">
            {intl.formatMessage({ id: "registerButton" })}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
