// pages/index.tsx
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import Cookies from "js-cookie";
import Head from "next/head";
import Header from "../components/Header";
import Filters from "../components/Filters";
import PromptList from "../components/PromptList";
import PromptModal from "../components/PromptModal";
import LanguageToggle from "../components/LanguageToggle";
import RegisterModal from "../components/RegisterModal";
import CookieConsent from "../components/CookieConsent";
import translations from "../translations.json";
import SearchBar from "../components/SearchBar";

interface HomeProps {
  locale: string;
  setLocale: (locale: string) => void;
}

const Home: React.FC<HomeProps> = ({ locale, setLocale }) => {
  const intl = useIntl();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<any | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const allPrompts = translations[locale].prompts;

  const categories = Array.from(
    new Set(allPrompts.map((prompt) => prompt.category))
  );

  const filteredPrompts = selectedCategory
    ? allPrompts.filter((prompt) => prompt.category === selectedCategory)
    : allPrompts;

  useEffect(() => {
    const cookieConsent = Cookies.get("cookieConsent");
    const hasShownRegisterModal = Cookies.get("hasShownRegisterModal");

    if (cookieConsent === "true" && !hasShownRegisterModal) {
      const timer = setTimeout(() => {
        setShowRegisterModal(true);
        Cookies.set("hasShownRegisterModal", "true", { expires: 30 }); // Cookie expires in 30 days
      }, 3 * 60 * 1000); // 3 минуты

      return () => clearTimeout(timer);
    }
  }, []);

  const handlePromptSelect = (prompt: any) => {
    setSelectedPrompt(prompt);
  };

  const handleCloseModal = () => {
    setSelectedPrompt(null);
  };

  const handleRegister = async (data: {
    email: string;
    name: string;
    password: string;
  }) => {
    try {
      // Здесь будет логика отправки данных на сервер
      console.log("Регистрация успешна!", data);
      alert(intl.formatMessage({ id: "registerSuccess" }));
      setShowRegisterModal(false);
      Cookies.set("hasShownRegisterModal", "true", { expires: 30 }); // Cookie expires in 30 days
    } catch (error) {
      console.error("Регистрация не удалась:", error);
      alert(intl.formatMessage({ id: "registerError" }));
    }
  };

  return (
    <div>
      <Head>
        <title>{intl.formatMessage({ id: "pageTitle" })}</title>
        <meta name="description" content={intl.formatMessage({ id: "pageDescription" })} />
      </Head>
      <Header />
      <LanguageToggle locale={locale} setLocale={setLocale} />
      <Filters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <PromptList
        prompts={filteredPrompts}
        onPromptSelect={handlePromptSelect}
      />
      {selectedPrompt && (
        <PromptModal prompt={selectedPrompt} onClose={handleCloseModal} />
      )}
      {showRegisterModal && (
        <RegisterModal
          onClose={() => {
            setShowRegisterModal(false);
            Cookies.set("hasShownRegisterModal", "true", { expires: 30 }); // Cookie expires in 30 days
          }}
          onRegister={handleRegister}
        />
      )}
      <CookieConsent />
    </div>
  );
};

export default Home;