import { Outlet } from "react-router-dom";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/SideBar";
import styles from "./AppLayout.module.scss";
import { useState } from "react";

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Header onOpenSidebar={() => setDrawerOpen(true)} />

      {/* Desktop sidebar */}
      <aside className={styles.sidebarDesktop}>
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          className={styles.drawerOverlay}
          onClick={() => setDrawerOpen(false)}
        >
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerTop}>
              <button
                className={styles.closeBtn}
                onClick={() => setDrawerOpen(false)}
                aria-label="Close sidebar"
                type="button"
              >
                ✕
              </button>
            </div>

            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
