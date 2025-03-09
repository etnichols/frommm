import * as React from 'react';
import * as Utilities from '@common/utilities';

import ButtonGroup from '@components/ButtonGroup';

interface ActionBarItem {
  hotkey?: string;
  onClick?: () => void;
  openHotkey?: string;
  selected?: boolean;
  body: React.ReactNode;
  items?: any;
}

interface ActionBarProps {
  items: ActionBarItem[];
}

const ActionBar: React.FC<ActionBarProps> = ({ items }) => {
  return (
    <div className="bg-[var(--theme-background)] shadow-[inset_0_0_0_1px_var(--theme-border)]">
      <ButtonGroup items={items} />
    </div>
  );
};

export default ActionBar;