import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUsers } from "../../hooks/useUsers.ts";
import styles from "./Users.module.scss";
import { formatDate } from "../../utils/format";
import TableHeaderCell from "../../components/TableHeaderCell/TableHeaderCell";
import type { User, UserStatus } from "../../types/users";
import usersDataIcon from "../../assets/icons/users-data.svg";
import activeUSersIcon from "../../assets/icons/active-users-data.svg";
import usersWithLoansIcon from "../../assets/icons/users-with-loans.svg";
import usersWithSavingsIcon from "../../assets/icons/users-with-savings.svg";
import { UserRoundCheck, Eye, UserPlus } from "lucide-react";
import { cacheUser } from "../../utils/userCache";

type Filters = {
  organization: string;
  username: string;
  email: string;
  date: string;
  phone: string;
  status: "" | UserStatus;
};

const initialFilters: Filters = {
  organization: "",
  username: "",
  email: "",
  date: "",
  phone: "",
  status: "",
};

function includes(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}

function sameDate(dateJoined: string, yyyyMmDd: string) {
  if (!yyyyMmDd) return true;
  const d = new Date(dateJoined);
  if (Number.isNaN(d.getTime())) return true;
  const iso = d.toISOString().slice(0, 10);
  return iso === yyyyMmDd;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function getPageRange(current: number, max: number) {
  const pages: Array<number | "..."> = [];

  if (max <= 7) {
    for (let i = 1; i <= max; i++) pages.push(i);
    return pages;
  }

  const left = Math.max(2, current - 1);
  const right = Math.min(max - 1, current + 1);

  pages.push(1);
  if (left > 2) pages.push("...");

  for (let i = left; i <= right; i++) pages.push(i);

  if (right < max - 1) pages.push("...");
  pages.push(max);

  return pages;
}

export default function Users() {
  const { data, loading, error } = useUsers();
  const navigate = useNavigate();

  // Filters popover
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draft, setDraft] = useState<Filters>(initialFilters);
  const [applied, setApplied] = useState<Filters>(initialFilters);

  // Popover positioning
  const tableWrapRef = useRef<HTMLDivElement | null>(null);
  const orgHeaderRef = useRef<HTMLDivElement | null>(null);
  const filterPopoverRef = useRef<HTMLDivElement | null>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  // Pagination
  const [pageSize, setPageSize] = useState(15);
  const [page, setPage] = useState(1);

  // Actions menu per row
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const tableBodyRef = useRef<HTMLDivElement | null>(null);

  // Close row menu on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!openMenuId) return;
      const target = e.target as Node;
      if (!tableBodyRef.current) return;
      if (!tableBodyRef.current.contains(target)) setOpenMenuId(null);
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openMenuId]);

  // Close filter popover on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!filtersOpen) return;
      const target = e.target as Node;

      const pop = filterPopoverRef.current;
      const org = orgHeaderRef.current;

      // click inside popover OR on org filter trigger => do nothing
      if (pop?.contains(target) || org?.contains(target)) return;

      setFiltersOpen(false);
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [filtersOpen]);

  useEffect(() => {
    function positionPopover() {
      if (!filtersOpen) return;
      const wrap = tableWrapRef.current;
      const org = orgHeaderRef.current;
      if (!wrap || !org) return;

      const wrapRect = wrap.getBoundingClientRect();
      const orgRect = org.getBoundingClientRect();

      const left = orgRect.left - wrapRect.left;
      const top = orgRect.bottom - wrapRect.top + 8;

      setPopoverPos({ left, top });
    }

    positionPopover();
    window.addEventListener("resize", positionPopover);
    return () => window.removeEventListener("resize", positionPopover);
  }, [filtersOpen]);

  useEffect(() => {
    setPage(1);
  }, [applied]);

  const filtered = useMemo<User[]>(() => {
    if (!data) return [];
    return data.filter((u: User) => {
      if (
        applied.organization &&
        !includes(u.organization, applied.organization)
      )
        return false;

      if (applied.username && !includes(u.username, applied.username))
        return false;
      if (applied.email && !includes(u.email, applied.email)) return false;
      if (applied.phone && !includes(u.phone, applied.phone)) return false;
      if (applied.status && u.status !== applied.status) return false;
      if (applied.date && !sameDate(u.dateJoined, applied.date)) return false;

      return true;
    });
  }, [data, applied]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = clamp(page, 1, totalPages);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safePage]);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const visibleRows = useMemo<User[]>(() => {
    return filtered.slice(startIndex, startIndex + pageSize);
  }, [filtered, startIndex, pageSize]);

  function goToPage(next: number) {
    setPage(clamp(next, 1, totalPages));
  }

  function updateDraft<K extends keyof Filters>(key: K, value: Filters[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function applyFilters() {
    setApplied(draft);
    setFiltersOpen(false);
  }

  function resetFilters() {
    setDraft(initialFilters);
    setApplied(initialFilters);
    setFiltersOpen(false);
  }

  function toggleOrganizationFilter() {
    setFiltersOpen((v) => !v);
  }

  if (loading) return <div className={styles.state}>Loading users…</div>;
  if (error) return <div className={styles.state}>Error: {error}</div>;

  const users: User[] = data ?? [];

  // Cards
  const fmt = new Intl.NumberFormat();
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;

  const usersWithSavings = users.filter(
    (u) => (u.accountBalance ?? 0) > 0,
  ).length;

  const parseMoney = (v: unknown) => {
    const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const usersWithLoans = users.filter((u) => {
    const repayment = parseMoney(u.details?.employment?.loanRepayment);
    return repayment > 0;
  }).length;

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>Users</h1>
      </header>

      {/* ---- Summary Cards ---- */}
      <div className={styles.cardsRow}>
        <div className={styles.card}>
          <img src={usersDataIcon} alt="" className={styles.cardIcon} />
          <div className={styles.cardLabel}>USERS</div>
          <div className={styles.cardValue}>{fmt.format(totalUsers)}</div>
        </div>

        <div className={styles.card}>
          <img src={activeUSersIcon} alt="" className={styles.cardIcon} />
          <div className={styles.cardLabel}>ACTIVE USERS</div>
          <div className={styles.cardValue}>{fmt.format(activeUsers)}</div>
        </div>

        <div className={styles.card}>
          <img src={usersWithLoansIcon} alt="" className={styles.cardIcon} />
          <div className={styles.cardLabel}>USERS WITH LOANS</div>
          <div className={styles.cardValue}>{fmt.format(usersWithLoans)}</div>
        </div>

        <div className={styles.card}>
          <img src={usersWithSavingsIcon} alt="" className={styles.cardIcon} />
          <div className={styles.cardLabel}>USERS WITH SAVINGS</div>
          <div className={styles.cardValue}>{fmt.format(usersWithSavings)}</div>
        </div>
      </div>

      {/* ---- Table ---- */}
      <div className={styles.tableWrap} ref={tableWrapRef}>
        {/* Desktop Table */}
        <div className={styles.desktopTable}>
          <div className={styles.tableHeaderRow}>
            {/* ORGANIZATION: custom header with clickable filter icon */}
            <div className={styles.headerCellWithFilter} ref={orgHeaderRef}>
              <span>ORGANIZATION</span>

              <button
                type="button"
                className={styles.headerFilterBtn}
                aria-label="Filter organization"
                aria-expanded={filtersOpen}
                onClick={toggleOrganizationFilter}
              >
                {/* simple filter icon (no extra deps) */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3 5h18M6 12h12M10 19h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <TableHeaderCell label="USERNAME" />
            <TableHeaderCell label="EMAIL" />
            <TableHeaderCell label="PHONE NUMBER" />
            <TableHeaderCell label="DATE JOINED" />
            <TableHeaderCell label="STATUS" />
            <span aria-hidden="true" />
          </div>

          {/* Filter Popover (opens from Organization icon) */}
          {filtersOpen && (
            <div
              ref={filterPopoverRef}
              className={styles.filterPopover}
              style={{ top: popoverPos.top, left: popoverPos.left }}
            >
              <div className={styles.filterGridPopover}>
                <label className={styles.filterField}>
                  <span>Organization</span>
                  <input
                    value={draft.organization}
                    onChange={(e) =>
                      updateDraft("organization", e.target.value)
                    }
                    placeholder="Organization"
                  />
                </label>

                <label className={styles.filterField}>
                  <span>Username</span>
                  <input
                    value={draft.username}
                    onChange={(e) => updateDraft("username", e.target.value)}
                    placeholder="User"
                  />
                </label>

                <label className={styles.filterField}>
                  <span>Email</span>
                  <input
                    value={draft.email}
                    onChange={(e) => updateDraft("email", e.target.value)}
                    placeholder="Email"
                  />
                </label>

                <label className={styles.filterField}>
                  <span>Date</span>
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(e) => updateDraft("date", e.target.value)}
                  />
                </label>

                <label className={styles.filterField}>
                  <span>Phone Number</span>
                  <input
                    value={draft.phone}
                    onChange={(e) => updateDraft("phone", e.target.value)}
                    placeholder="Phone Number"
                  />
                </label>

                <label className={styles.filterField}>
                  <span>Status</span>
                  <select
                    value={draft.status}
                    onChange={(e) =>
                      updateDraft("status", e.target.value as Filters["status"])
                    }
                  >
                    <option value="">Select</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                    <option value="Blacklisted">Blacklisted</option>
                  </select>
                </label>
              </div>

              <div className={styles.filterActionsPopover}>
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={resetFilters}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className={styles.applyBtn}
                  onClick={applyFilters}
                >
                  Filter
                </button>
              </div>
            </div>
          )}

          <div className={styles.tableBody} ref={tableBodyRef}>
            {visibleRows.length === 0 ? (
              <div className={styles.emptyState}>
                No users match your filters.
              </div>
            ) : (
              visibleRows.map((u: User) => (
                <div key={u.id} className={styles.tableRow}>
                  <span className={styles.cell}>{u.organization}</span>
                  <span className={styles.cell}>{u.username}</span>
                  <span className={styles.cell}>{u.email}</span>
                  <span className={styles.cell}>{u.phone}</span>
                  <span className={styles.cell}>
                    {formatDate(u.dateJoined)}
                  </span>

                  <span className={styles.cell}>
                    <span
                      className={`${styles.status} ${styles[`status_${u.status}`]}`}
                    >
                      {u.status}
                    </span>
                  </span>

                  <div className={styles.actionsCell}>
                    <button
                      type="button"
                      className={styles.moreBtn}
                      aria-haspopup="menu"
                      aria-expanded={openMenuId === u.id}
                      aria-label={`Open actions for ${u.fullName}`}
                      onClick={() =>
                        setOpenMenuId((prev) => (prev === u.id ? null : u.id))
                      }
                    >
                      ⋮
                    </button>

                    {openMenuId === u.id && (
                      <div className={styles.menu} role="menu">
                        <button
                          type="button"
                          className={styles.menuItem}
                          role="menuitem"
                          onClick={() => {
                            cacheUser(u);
                            setOpenMenuId(null);
                            navigate(`/users/${u.id}`);
                          }}
                        >
                          <Eye size={16} />
                          View details
                        </button>

                        <button
                          type="button"
                          className={styles.menuItem}
                          role="menuitem"
                          onClick={() => setOpenMenuId(null)}
                        >
                          <UserPlus size={16} />
                          Blacklist user
                        </button>

                        <button
                          type="button"
                          className={styles.menuItem}
                          role="menuitem"
                          onClick={() => setOpenMenuId(null)}
                        >
                          <UserRoundCheck size={16} />
                          Activate user
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <div className={styles.paginationLeft}>
              <span>Showing</span>

              <select
                className={styles.pageSize}
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                aria-label="Rows per page"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>

              <span>
                {total === 0 ? "0" : `${startIndex + 1}-${endIndex}`} out of{" "}
                {total}
              </span>
            </div>

            <div className={styles.paginationRight}>
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage === 1}
                aria-label="Previous page"
              >
                ‹
              </button>

              {getPageRange(safePage, totalPages).map((p, idx) =>
                p === "..." ? (
                  <span key={`dots-${idx}`} className={styles.dots}>
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    className={`${styles.pageNumber} ${
                      p === safePage ? styles.pageNumberActive : ""
                    }`}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage === totalPages}
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
