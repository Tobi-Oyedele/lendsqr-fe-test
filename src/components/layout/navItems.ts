export type NavSection = "CUSTOMERS" | "BUSINESSES" | "SETTINGS";

export type NavItem = {
  label: string;
  to: string;
  section?: NavSection;
  iconSrc?: string;
};

import {
  dashboardIcon,
  usersIcon,
  guarantorsIcon,
  loansIcon,
  decisionModelsIcon,
  savingsIcon,
  loanRequestsIcon,
  whitelistIcon,
  karmaIcon,
  organizationIcon,
  savingsProductsIcon,
  feesChargesIcon,
  servicesIcon,
  transactionsIcon,
  serviceAccountIcon,
  settlementsIcon,
  reportsIcon,
  preferencesIcon,
  feesAndPricingIcon,
  auditLogsIcon,
} from "../../assets/icons";

export const topNavItems: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    iconSrc: dashboardIcon,
  },
];

export const navItems: NavItem[] = [
  // CUSTOMERS
  {
    label: "Users",
    to: "/users",
    section: "CUSTOMERS",
    iconSrc: usersIcon,
  },
  {
    label: "Guarantors",
    to: "/guarantors",
    section: "CUSTOMERS",
    iconSrc: guarantorsIcon,
  },
  {
    label: "Loans",
    to: "/loans",
    section: "CUSTOMERS",
    iconSrc: loansIcon,
  },
  {
    label: "Decision Models",
    to: "/decision-models",
    section: "CUSTOMERS",
    iconSrc: decisionModelsIcon,
  },
  {
    label: "Savings",
    to: "/savings",
    section: "CUSTOMERS",
    iconSrc: savingsIcon,
  },
  {
    label: "Loan Requests",
    to: "/loan-requests",
    section: "CUSTOMERS",
    iconSrc: loanRequestsIcon,
  },
  {
    label: "Whitelist",
    to: "/whitelist",
    section: "CUSTOMERS",
    iconSrc: whitelistIcon,
  },
  {
    label: "Karma",
    to: "/karma",
    section: "CUSTOMERS",
    iconSrc: karmaIcon,
  },

  // BUSINESSES
  {
    label: "Organization",
    to: "/organization",
    section: "BUSINESSES",
    iconSrc: organizationIcon,
  },
  {
    label: "Savings Products",
    to: "/savings-products",
    section: "BUSINESSES",
    iconSrc: savingsProductsIcon,
  },
  {
    label: "Fees and Charges",
    to: "/fees",
    section: "BUSINESSES",
    iconSrc: feesChargesIcon,
  },
  {
    label: "Transactions",
    to: "/transactions",
    section: "BUSINESSES",
    iconSrc: transactionsIcon,
  },
  {
    label: "Services",
    to: "/services",
    section: "BUSINESSES",
    iconSrc: servicesIcon,
  },
  {
    label: "Service Account",
    to: "/service-account",
    section: "BUSINESSES",
    iconSrc: serviceAccountIcon,
  },
  {
    label: "Settlements",
    to: "/settlements",
    section: "BUSINESSES",
    iconSrc: settlementsIcon,
  },
  {
    label: "Reports",
    to: "/reports",
    section: "BUSINESSES",
    iconSrc: reportsIcon,
  },

  // SETTINGS
  {
    label: "Preferences",
    to: "/preferences",
    section: "SETTINGS",
    iconSrc: preferencesIcon,
  },
  {
    label: "Fees and Pricing",
    to: "/fees-pricing",
    section: "SETTINGS",
    iconSrc: feesAndPricingIcon,
  },
  {
    label: "Audit Logs",
    to: "/audit-logs",
    section: "SETTINGS",
    iconSrc: auditLogsIcon,
  },
];
