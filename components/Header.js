import { useIntl } from "react-intl";

const Header = () => {
  const intl = useIntl();

  return (
    <header>
      <h1>{intl.formatMessage({ id: "siteTitle" })}</h1>
    </header>
  );
};

export default Header;
