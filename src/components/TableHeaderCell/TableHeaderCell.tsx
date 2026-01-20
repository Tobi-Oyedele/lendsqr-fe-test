import { ListFilter, type LucideIcon } from "lucide-react";
import styles from "./TableHeaderCell.module.scss";

type TableHeaderCellProps = {
  label: string;
  icon?: LucideIcon;
};

export default function TableHeaderCell({
  label,
  icon: Icon = ListFilter,
}: TableHeaderCellProps) {
  return (
    <span className={styles.headerCell}>
      {label}
      <Icon size={15} className={styles.icon} aria-hidden="true" />
    </span>
  );
}
