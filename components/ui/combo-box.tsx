'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

import { Button } from '@components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export interface ComboboxItem {
  _id: string
  value: string
  label: string
}

interface ComboboxProps {
  items: ComboboxItem[]
  selected: ComboboxItem | undefined
  onChange: (e?: ComboboxItem) => void
}

export function Combobox({ items, onChange, selected }: ComboboxProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[270px] justify-between"
        >
          {selected?.label || 'Select quiz...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[270px] p-0">
        <Command>
          <CommandInput placeholder="Search quizzes..." />
          <CommandEmpty>No Quiz Found</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(value) => {
                  console.log('onSelect', value)
                  // Deselect the item if it's already selected
                  const newValue = selected?.value === value ? '' : value
                  // Find the item that matches the value
                  const newItem = newValue ? items.find((item) => item.value === value) : undefined
                  onChange(newItem)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selected?.value === item.value ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
