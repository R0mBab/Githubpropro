// components/PromptModal.js
import { useIntl } from "react-intl";
import { useState } from "react";
import styles from "../styles/PromptModal.module.css";

const PromptModal = ({ prompt, onClose }) => {
  const intl = useIntl();
  const [isCopied, setIsCopied] = useState(false);

  if (!prompt) return null;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(prompt.prompt);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        fallbackCopyTextToClipboard(prompt.prompt);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert(intl.formatMessage({ id: "copyFailed" }));
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        throw new Error("Copy command was unsuccessful");
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
      alert(intl.formatMessage({ id: "copyFailed" }));
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>{prompt.name}</h2>
        <p>{prompt.description}</p>
        <div className={styles.promptText}>{prompt.prompt}</div>
        <button className={styles.copyButton} onClick={handleCopy}>
          {isCopied
            ? intl.formatMessage({ id: "copied" })
            : intl.formatMessage({ id: "copyButton" })}
        </button>
        <button className={styles.closeButton} onClick={onClose}>
          {intl.formatMessage({ id: "closeButton" })}
        </button>
      </div>
    </div>
  );
};

export default PromptModal;
