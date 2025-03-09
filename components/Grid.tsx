import * as React from 'react';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Grid: React.FC<GridProps> = ({ children, ...rest }) => {
  return (
    <div 
      className="block py-[calc(var(--font-size)*var(--theme-line-height-base))] px-[2ch]" 
      {...rest}
    >
      {children}
    </div>
  );
};

export default Grid;