'use client'

import { useEffect, useState, forwardRef } from 'react'
import { AutoCompleteInput, type Option } from './autocomplete-input'
import type { Origin } from '@/lib/server/origins'
import { fetchOrigins } from '@/lib/server/origins'

type OriginsAutocompleteProps = {
  value?: Origin
  emptyMessage?: string
  onValueChange?: (option: Origin) => void
  resetKey?: number | string
  placeholder?: string
}

export const OriginsAutocomplete = forwardRef<HTMLInputElement, OriginsAutocompleteProps>(
  ({ value, emptyMessage = 'No results found', onValueChange, resetKey, placeholder }, ref) => {
    const [options, setOptions] = useState<Option[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Convert Origin to Option
    const mapOriginToOption = (origin: Origin): Option => ({
      value: origin.id.toString(),
      label: origin.name,
      // Include original properties to preserve the full Origin data
      id: origin.id.toString(),
      name: origin.name,
      created_at: origin.created_at,
      type: origin.type.toString(),
    })

    // Convert Option back to Origin for the consumer
    const handleValueChange = (option: Option) => {
      if (onValueChange) {
        const origin: Origin = {
          id: parseInt(option.value),
          name: option.label,
          created_at: option.created_at,
          type: parseInt(option.type),
        }
        onValueChange(origin)
      }
    }

    // Convert value (Origin) to Option for the AutoCompleteInput
    const optionValue = value ? mapOriginToOption(value) : undefined

    useEffect(() => {
      const getOrigins = async () => {
        setIsLoading(true)
        try {
          const origins = await fetchOrigins()
          setOptions(origins.map(mapOriginToOption))
        } catch (error) {
          console.error('Error loading origins:', error)
        } finally {
          setIsLoading(false)
        }
      }

      getOrigins()
    }, [])

    return (
      <AutoCompleteInput
        ref={ref}
        options={options}
        value={optionValue}
        emptyMessage={emptyMessage}
        onValueChange={handleValueChange}
        isLoading={isLoading}
        resetKey={resetKey}
        placeholder={placeholder || 'Search for origin...'}
      />
    )
  },
)

OriginsAutocomplete.displayName = 'OriginsAutocomplete'
