// components/PromptList.js
import { useIntl } from "react-intl";
import styles from "../styles/PromptList.module.css";

const PromptList = ({ prompts, onPromptSelect }) => {
  const intl = useIntl();

  if (prompts.length === 0) {
    return (
      <p className={styles.noPrompts}>
        {intl.formatMessage({ id: "noPrompts" })}
      </p>
    );
  }

  const handlePromptClick = (prompt) => {
    if (typeof onPromptSelect === "function") {
      onPromptSelect(prompt);
    }
  };

  return (
    <div className={styles.promptGrid}>
      {prompts.map((prompt) => (
        <div
          key={prompt.id}
          className={styles.promptCard}
          onClick={() => handlePromptClick(prompt)}
        >
          <h3>{prompt.name}</h3>
          <p>{prompt.description}</p>
          <span className={styles.category}>{prompt.category}</span>
        </div>
      ))}
    </div>
  );
};

export default PromptList;
