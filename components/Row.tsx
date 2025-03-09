'use client';

import * as React from 'react';

type RowProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

const Row = React.forwardRef<HTMLElement, RowProps>(({ children, ...rest }, ref) => {
  return (
    <section 
      className="block outline-0 border-0 transition-[background] duration-200 ease-in-out mb-4 focus:bg-[var(--theme-focused-foreground)]" 
      ref={ref} 
      {...rest}
    >
      {children}
    </section>
  );
});

Row.displayName = 'Row';

export default Row;
