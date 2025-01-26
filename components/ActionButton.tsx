import styles from "@components/ActionButton.module.scss";

import * as React from "react";
import * as Utilities from "@common/utilities";

interface ActionButtonProps {
  onClick?: () => void;
  hotkey?: any;
  children?: React.ReactNode;
  style?: any;
  rootStyle?: any;
  isSelected?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    { onClick, hotkey, children, style, rootStyle, isSelected, onKeyDown },
    ref
  ) => {
    return (
      <button
        type="button"
        className={Utilities.classNames(
          styles.root,
          isSelected ? styles.selected : null
        )}
        style={rootStyle}
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={0}
        ref={ref}
      >
        {Utilities.isEmpty(hotkey) ? null : (
          <span className={styles.hotkey}>{hotkey}</span>
        )}
        <span className={styles.content} style={style}>
          {children}
        </span>
      </button>
    );
  }
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
