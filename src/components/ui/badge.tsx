'use client'

import * as React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
}

const Badge: React.FC<BadgeProps> = ({ children, ...rest }) => {
  return (
    <span
      className="inline-block align-top text-center font-normal m-0 outline-0 border-0 font-mono min-h-[calc(var(--theme-line-height-base)*var(--font-size))] uppercase transition-all duration-200 ease-in-out bg-[var(--theme-border)] px-[1ch]"
      {...rest}
    >
      {children}
    </span>
  )
}

export default Badge
