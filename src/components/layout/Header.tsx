import styles from "./Header.module.scss";
import logo from "../../assets/logo.svg";
import { Bell, ChevronDown, Search } from "lucide-react";
import avatar from "../../assets/avatar.png";

export default function Header({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={styles.menuBtn}
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          ☰
        </button>
      </div>

      <img src={logo} alt="Lendsqr logo" className={styles.logo} />

      <div className={styles.spacer} aria-hidden="true" />

      <div className={styles.search}>
        <label className={styles.srOnly} htmlFor="search">
          Search
        </label>
        <input
          id="search"
          className={styles.searchInput}
          placeholder="Search for anything"
        />
        <button className={styles.searchBtn} type="button" aria-label="Search">
          <Search size={16} />
        </button>
      </div>

      <div className={styles.right}>
        <a className={styles.docs} href="#" onClick={(e) => e.preventDefault()}>
          Docs
        </a>
        <button
          className={styles.iconBtn}
          type="button"
          aria-label="Notifications"
        >
          <Bell size={25} />
        </button>
        <div className={styles.profile}>
          <div className={styles.avatar} aria-hidden="true">
            <img src={avatar} alt="User avatar" />
          </div>
          <span className={styles.name}>Adedeji</span>
          <span className={styles.caret} aria-hidden="true">
            <ChevronDown size={16} />
          </span>
        </div>
      </div>
    </header>
  );
}
