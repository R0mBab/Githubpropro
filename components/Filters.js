// components/Filters.js
import { useIntl } from "react-intl";
import styles from "../styles/Filters.module.css";

const Filters = ({ categories, selectedCategory, onCategorySelect }) => {
  const intl = useIntl();

  return (
    <div className={styles.filterContainer}>
      <h2>{intl.formatMessage({ id: "filterLabel" })}</h2>
      <div className={styles.filterCloud}>
        <button
          className={`${styles.filterButton} ${!selectedCategory ? styles.active : ""}`}
          onClick={() => onCategorySelect(null)}
        >
          {intl.formatMessage({ id: "allCategories" })}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ""}`}
            onClick={() => onCategorySelect(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filters;
