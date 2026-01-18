import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import { navItems, topNavItems } from "./navItems";
import { ChevronDown } from "lucide-react";
import { organizationIcon } from "../../assets/icons";

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.sectionTop}>
        <button className={styles.switchOrg} type="button">
          <span className={styles.iconWrap}>
            <img src={organizationIcon} alt="" aria-hidden="true" />
          </span>

          <span className={styles.label}>Switch Organization</span>

          <ChevronDown
            size={16}
            className={styles.chevron}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className={styles.section}>
        {topNavItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            {item.iconSrc && (
              <img
                src={item.iconSrc}
                className={styles.icon}
                alt=""
                aria-hidden="true"
              />
            )}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>CUSTOMERS</div>
        {navItems
          .filter((i) => i.section === "CUSTOMERS")
          .map((item) => (
            <NavLink
              key={item.label}
              to={item.to ?? "#"}
              onClick={onNavigate}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {item.iconSrc ? (
                <img
                  className={styles.icon}
                  src={item.iconSrc}
                  alt=""
                  aria-hidden="true"
                />
              ) : (
                <span className={styles.iconPlaceholder} aria-hidden="true" />
              )}
              <span>{item.label}</span>
            </NavLink>
          ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>BUSINESSES</div>
        {navItems
          .filter((i) => i.section === "BUSINESSES")
          .map((item) => (
            <NavLink
              key={item.label}
              to={item.to ?? "#"}
              onClick={onNavigate}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {item.iconSrc ? (
                <img
                  className={styles.icon}
                  src={item.iconSrc}
                  alt=""
                  aria-hidden="true"
                />
              ) : (
                <span className={styles.iconPlaceholder} aria-hidden="true" />
              )}
              <span>{item.label}</span>
            </NavLink>
          ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>SETTINGS</div>
        {navItems
          .filter((i) => i.section === "SETTINGS")
          .map((item) => (
            <NavLink
              key={item.label}
              to={item.to ?? "#"}
              onClick={onNavigate}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {item.iconSrc ? (
                <img
                  className={styles.icon}
                  src={item.iconSrc}
                  alt=""
                  aria-hidden="true"
                />
              ) : (
                <span className={styles.iconPlaceholder} aria-hidden="true" />
              )}
              <span>{item.label}</span>
            </NavLink>
          ))}
      </div>
    </nav>
  );
}
