import { useEffect, useState } from "react";
import styles from "./AppLayout.module.scss";
import Header from "./Header";
import Sidebar from "./SideBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className={styles.layout}>
      <Header onOpenSidebar={() => setSidebarOpen(true)} />

      {/* Desktop sidebar */}
      <aside className={styles.sidebarDesktop}>
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div
          className={styles.drawerOverlay}
          role="presentation"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Sidebar navigation"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.drawerTop}>
              <button
                className={styles.closeBtn}
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                ✕
              </button>
            </div>
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <main className={styles.main} role="main">
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
