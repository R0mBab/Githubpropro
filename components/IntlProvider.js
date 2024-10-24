// components/IntlProvider.js
import { IntlProvider } from "react-intl";
import translations from "../translations.json";

const IntlProviderComponent = ({ children }) => {
  return (
    <IntlProvider locale="en" messages={translations.en}>
      {children}
    </IntlProvider>
  );
};

export default IntlProviderComponent;
