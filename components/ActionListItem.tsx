import styles from "@components/ActionListItem.module.scss";
import { cn } from "@root/lib/utils";

interface ActionListItemProps {
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const ActionListItem: React.FC<ActionListItemProps> = (props) => {
  const { onClick, children, icon, style, disabled, onKeyDown } = props;

  return (
    <button
      type="button"
      className={cn(
        styles.item,
        "disabled:cursor-not-allowed disabled:opacity-50"
      )}
      onClick={onClick}
      style={style}
      tabIndex={0}
      onKeyDown={onKeyDown}
      disabled={disabled}
    >
      <figure className={styles.icon}>{icon}</figure>
      <span className={styles.text}>{children}</span>
    </button>
  );
};

export default ActionListItem;
