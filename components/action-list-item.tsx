import * as React from 'react';

interface ActionListItemProps {
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  href?: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
}

const ActionListItem: React.FC<ActionListItemProps> = (props) => {
  const { href, target, onClick, children, icon, style } = props;

  const itemClasses = "items-start bg-transparent text-[var(--theme-text)] cursor-pointer flex justify-between outline-0 border-0 no-underline visited:bg-transparent visited:text-[var(--theme-text)] hover:bg-transparent hover:text-[var(--theme-text)] hover:[&_.icon]:bg-[var(--theme-focused-foreground)] focus:[&_.icon]:bg-[var(--theme-focused-foreground)]";
  
  const iconClasses = "icon items-center bg-[var(--theme-button-foreground)] inline-flex flex-shrink-0 h-[calc(var(--font-size)*var(--theme-line-height-base))] justify-center w-[3ch] select-none";
  
  const textClasses = "items-center self-stretch bg-[var(--theme-button-background)] inline-flex justify-start min-w-[10%] px-[1ch] select-none w-full";

  if (href) {
    return (
      <a className={itemClasses} href={href} target={target} style={style} tabIndex={0} role="link">
        <figure className={iconClasses}>{icon}</figure>
        <span className={textClasses}>{children}</span>
      </a>
    );
  }

  return (
    <div className={itemClasses} onClick={onClick} style={style} tabIndex={0} role="button">
      <figure className={iconClasses}>{icon}</figure>
      <span className={textClasses}>{children}</span>
    </div>
  );
};

export default ActionListItem;