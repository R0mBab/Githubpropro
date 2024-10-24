// components/CookieConsent.tsx
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import Cookies from "js-cookie";
import styles from "../styles/CookieConsent.module.css";

const CookieConsent: React.FC = () => {
  const [show, setShow] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    const consent = Cookies.get("cookieConsent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set("cookieConsent", "true", { expires: 365 });
    setShow(false);
  };

  if (!show) {
    return null;
  }

  return (
    <div className={styles.cookieConsent}>
      <p>{intl.formatMessage({ id: "cookieConsentMessage" })}</p>
      <button onClick={handleAccept}>
        {intl.formatMessage({ id: "cookieConsentButton" })}
      </button>
    </div>
  );
};

export default CookieConsent;
