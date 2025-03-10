import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  placeholder?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, placeholder, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false)
    const [value, setValue] = React.useState('')

    return (
      <div className="relative block">
        {label && (
          <label className="block bg-border" htmlFor={props.id}>
            {label}
          </label>
        )}

        <div className="relative block">
          <div
            className={cn(
              'overflow-hidden whitespace-nowrap pointer-events-none break-words bg-background-input shadow-[inset_0_0_0_2px_var(--theme-border)]',
              focused && 'focused',
            )}
          >
            {value ? (
              <span>{value}</span>
            ) : (
              <span className="italic text-overlay">{placeholder}</span>
            )}
            <span
              className={cn(
                'inline-block min-w-[1ch] bg-text text-background h-[calc(var(--font-size)*var(--theme-line-height-base))] align-bottom',
                focused && 'bg-focused-foreground',
                focused && 'animate-[blink_1s_step-start_0s_infinite]',
              )}
            ></span>
          </div>

          <input
            type={type}
            className={cn(
              'absolute top-0 left-0 w-full text-transparent bg-transparent caret-transparent border-none outline-none overflow-hidden p-0 m-0 leading-[var(--theme-line-height-base)] text-[var(--font-size)] font-inherit [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_var(--theme-focused-foreground)_inset]',
              className,
            )}
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            {...props}
          />
        </div>
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
