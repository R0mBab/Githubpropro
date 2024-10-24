// components/LanguageToggle.tsx
import { useIntl } from "react-intl";
import styles from "../styles/LanguageToggle.module.css";

interface LanguageToggleProps {
  locale: string;
  setLocale: (locale: string) => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  locale,
  setLocale,
}) => {
  const intl = useIntl();

  const handleToggle = () => {
    setLocale(locale === "en" ? "ru" : "en");
  };

  return (
    <div className={styles.toggleContainer}>
      <span
        className={`${styles.label} ${locale === "en" ? styles.active : ""}`}
      >
        EN
      </span>
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={locale === "ru"}
          onChange={handleToggle}
        />
        <span className={styles.slider}></span>
      </label>
      <span
        className={`${styles.label} ${locale === "ru" ? styles.active : ""}`}
      >
        RU
      </span>
    </div>
  );
};

export default LanguageToggle;
