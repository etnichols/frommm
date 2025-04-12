import { Command as CommandPrimitive } from 'cmdk'
import { useState, useRef, useCallback, type KeyboardEvent, useEffect, useMemo } from 'react'
import * as Fuse from 'fuse.js'
import { Check } from 'lucide-react'
import { Skeleton } from './skeleton'
import { cn } from '@/lib/utils'
import { CommandGroup, CommandInput, CommandItem, CommandList } from './command'

export type Option = Record<'value' | 'label', string> & Record<string, string>

type AutoCompleteProps = {
  options: Option[]
  emptyMessage: string
  value?: Option
  onValueChange?: (value: Option) => void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
  resetKey?: number | string
}

export const AutoCompleteInput = ({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading = false,
  resetKey = 0,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setOpen] = useState(false)
  const [selected, setSelected] = useState<Option>(value as Option)
  const [inputValue, setInputValue] = useState<string>(value?.label || '')
  const [searchResults, setSearchResults] = useState<Fuse.FuseResult<Option>[]>([])

  // Initialize Fuse instance with options
  const fuse = useMemo(
    () =>
      new Fuse.default(options, {
        keys: ['label'],
        threshold: 0.3, // Lower threshold means more strict matching
        distance: 100, // How far to extend the matching
        minMatchCharLength: 1,
        ignoreLocation: true, // Ignore where in the string the match occurs
      }),
    [options],
  )

  // Update search results when input changes
  useEffect(() => {
    if (!inputValue.trim()) {
      setSearchResults(options.map((item) => ({ item, score: 1, refIndex: -1 })))
    } else {
      const results = fuse.search(inputValue)
      setSearchResults(results)
    }
  }, [inputValue, fuse, options])

  useEffect(() => {
    setSelected(value as Option)
    setInputValue(value?.label || '')
  }, [resetKey, value])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (!input) return

      if (!isOpen) setOpen(true)

      if (event.key === 'Enter' && input.value !== '') {
        const optionToSelect = searchResults[0]?.item
        if (optionToSelect) {
          setSelected(optionToSelect)
          onValueChange?.(optionToSelect)
        }
      }

      if (event.key === 'Escape') {
        input.blur()
      }
    },
    [isOpen, searchResults, onValueChange],
  )

  const handleBlur = useCallback(() => {
    setOpen(false)
    setInputValue(selected?.label || '')
  }, [selected])

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label)
      setSelected(selectedOption)
      onValueChange?.(selectedOption)

      setTimeout(() => {
        inputRef?.current?.blur()
      }, 0)
    },
    [onValueChange],
  )

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div>
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={isLoading ? undefined : setInputValue}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="text-base border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            'animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-white outline-none',
            isOpen ? 'block' : 'hidden',
          )}
        >
          <CommandList className="rounded-lg ring-1 ring-slate-200">
            {isLoading ? (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            ) : null}
            {searchResults.length > 0 && !isLoading ? (
              <CommandGroup>
                {searchResults.map(({ item: option }) => {
                  const isSelected = selected?.value === option.value
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onMouseDown={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                      onSelect={() => handleSelectOption(option)}
                      className={cn('flex w-full items-center gap-2', !isSelected ? 'pl-8' : null)}
                    >
                      {isSelected ? <Check className="w-4" /> : null}
                      {option.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ) : null}
            {!isLoading && searchResults.length === 0 ? (
              <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                {emptyMessage}
              </CommandPrimitive.Empty>
            ) : null}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  )
}
