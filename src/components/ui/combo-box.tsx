'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export interface ComboboxItem {
  _id: string
  value: string
  label: string
}

interface ComboboxProps {
  items: ComboboxItem[]
  onChange: (e?: ComboboxItem) => void
}

export function Combobox({ items, onChange }: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[270px] justify-between"
        >
          {value ? items.find((item) => item.value === value)?.label : 'Select quiz...'}
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
                onSelect={(currentValue) => {
                  const newValue = currentValue === value ? '' : currentValue
                  const newItem = newValue
                    ? items.find((item) => item.value === currentValue)
                    : undefined
                  onChange(newItem)
                  setValue(newValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn('mr-2 h-4 w-4', value === item.value ? 'opacity-100' : 'opacity-0')}
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