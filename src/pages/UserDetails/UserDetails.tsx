import { useState } from "react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUsers } from "../../hooks/useUsers";
import { readCachedUser } from "../../utils/userCache";
import type { User } from "../../types/users";
import styles from "./UserDetails.module.scss";
import { UserRound } from "lucide-react";

export default function UserDetails() {
  const [activeTab, setActiveTab] = useState<
    "general" | "documents" | "bank" | "loans" | "savings" | "system"
  >("general");

  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading, error } = useUsers();

  const user: User | null = useMemo(() => {
    if (!id) return null;

    const fromList = data?.find((u) => u.id === id);
    if (fromList) return fromList;

    const cached = readCachedUser();
    if (cached?.id === id) return cached;

    return null;
  }, [data, id]);

  if (loading) return <div className={styles.state}>Loading user…</div>;
  if (error) return <div className={styles.state}>Error: {error}</div>;
  if (!user) {
    return (
      <div className={styles.state}>
        User not found.
        <button onClick={() => navigate("/users")}>Back to Users</button>
      </div>
    );
  }

  return (
    <section className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back to Users
      </button>

      <div className={styles.pageHeader}>
        <h1 className={styles.title}>User Details</h1>

        <div className={styles.headerActions}>
          <button className={styles.blacklistBtn}>BLACKLIST USER</button>
          <button className={styles.activateBtn}>ACTIVATE USER</button>
        </div>
      </div>

      {/* ===== Summary Card ===== */}
      <div className={styles.summaryCard}>
        <div className={styles.left}>
          <div className={styles.avatar}>
            <UserRound size={32} strokeWidth={1.5} />
          </div>

          <div>
            <div className={styles.name}>{user.fullName}</div>
            <div className={styles.code}>{user.accountNumber}</div>
          </div>
        </div>

        <div className={styles.mid}>
          <span>User’s Tier</span>
          <span className={styles.stars}>★☆☆</span>
        </div>

        <div className={styles.right}>
          <div className={styles.balance}>
            ₦{user.accountBalance.toLocaleString()}
          </div>
          <div className={styles.bank}>
            {user.accountNumber} / Providus Bank
          </div>
        </div>
      </div>

      {/* ===== Tabs ===== */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "general" ? styles.active : ""}`}
          onClick={() => setActiveTab("general")}
        >
          General Details
        </button>

        <button
          className={`${styles.tab} ${activeTab === "documents" ? styles.active : ""}`}
          onClick={() => setActiveTab("documents")}
        >
          Documents
        </button>

        <button
          className={`${styles.tab} ${activeTab === "bank" ? styles.active : ""}`}
          onClick={() => setActiveTab("bank")}
        >
          Bank Details
        </button>

        <button
          className={`${styles.tab} ${activeTab === "loans" ? styles.active : ""}`}
          onClick={() => setActiveTab("loans")}
        >
          Loans
        </button>

        <button
          className={`${styles.tab} ${activeTab === "savings" ? styles.active : ""}`}
          onClick={() => setActiveTab("savings")}
        >
          Savings
        </button>

        <button
          className={`${styles.tab} ${activeTab === "system" ? styles.active : ""}`}
          onClick={() => setActiveTab("system")}
        >
          App and System
        </button>
      </div>

      {/* ===== Details Card ===== */}
      <div className={styles.detailsCard}>
        {/* Personal Info */}
        <Section title="Personal Information">
          <Info label="Full Name" value={user.fullName} />
          <Info label="Phone Number" value={user.phone} />
          <Info label="Email Address" value={user.email} />
          <Info label="BVN" value={user.details.bvn} />
          <Info label="Gender" value={user.gender ?? "—"} />
          <Info label="Marital Status" value={user.details.maritalStatus} />
          <Info label="Children" value={user.details.children} />
          <Info label="Type of Residence" value={user.details.residenceType} />
        </Section>

        {/* Employment */}
        <Section title="Education and Employment">
          <Info
            label="Level of Education"
            value={user.details.employment.levelOfEducation}
          />
          <Info
            label="Employment Status"
            value={user.details.employment.employmentStatus}
          />
          <Info
            label="Sector of Employment"
            value={user.details.employment.sector}
          />
          <Info
            label="Duration of Employment"
            value={user.details.employment.duration}
          />
          <Info
            label="Office Email"
            value={user.details.employment.officeEmail}
          />
          <Info
            label="Monthly Income"
            value={`₦${user.details.employment.monthlyIncome}`}
          />
          <Info
            label="Loan Repayment"
            value={user.details.employment.loanRepayment}
          />
        </Section>

        {/* Socials */}
        <Section title="Socials">
          <Info label="Twitter" value={user.details.socials.twitter} />
          <Info label="Facebook" value={user.details.socials.facebook} />
          <Info label="Instagram" value={user.details.socials.instagram} />
        </Section>

        {/* Guarantor — NOT using <Section /> */}
        <h2 className={styles.sectionTitle}>Guarantor</h2>

        {user.details.guarantors.map((g, index) => (
          <div key={index}>
            <div className={styles.guarantorGrid}>
              <Info label="Full Name" value={g.fullName} />
              <Info label="Phone Number" value={g.phone} />
              <Info label="Email Address" value={g.email} />
              <Info label="Relationship" value={g.relationship} />
            </div>

            {index !== user.details.guarantors.length - 1 && (
              <hr className={styles.divider} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== Small Components ===== */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.grid}>{children}</div>
      <hr className={styles.divider} />
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className={styles.infoLabel}>{label}</div>
      <div className={styles.infoValue}>{value}</div>
    </div>
  );
}
