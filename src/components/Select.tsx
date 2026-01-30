import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState } from 'react'
import type { ReactNode } from 'react'

export type SelectOption = {
  id: number
  label: ReactNode
}

type SelectProps = {
  options: SelectOption[]
  value?: SelectOption
  onChange?: (opt: SelectOption) => void
  renderOption?: (opt: SelectOption) => ReactNode
  className?: string
}

export default function Select({
  options,
  value,
  onChange,
  renderOption,
  className,
}: SelectProps) {
  // Use undefined instead of null
  const [internalValue, setInternalValue] = useState<SelectOption | undefined>(
    options.length > 0 ? options[0] : undefined
  )

  const selected = value ?? internalValue

  const handleChange = (opt: SelectOption) => {
    if (onChange) onChange(opt)
    else setInternalValue(opt)
  }

  // If no options, render safe fallback
  if (!options || options.length === 0) {
    return (
      <div className={clsx('w-full', className)}>
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-500">
          No options available
        </div>
      </div>
    )
  }

  return (
    <div className={clsx('w-full', className)}>
      <Listbox value={selected} onChange={handleChange}>
        <ListboxButton
          className={clsx(
            'relative block w-full rounded-lg bg-white text-gray-900 outline outline-1 outline-gray-300 py-1.5 pr-8 pl-3 text-left text-sm',
            'dark:bg-gray-800 dark:text-white dark:outline-gray-700'
          )}
        >
          {renderOption ? renderOption(selected!) : selected!.label}

          <ChevronDownIcon
            className="pointer-events-none absolute top-2.5 right-2.5 size-4 text-gray-500 dark:fill-white/60"
            aria-hidden="true"
          />
        </ListboxButton>

        <ListboxOptions
          anchor="bottom"
          transition
          className={clsx(
            'w-[var(--button-width)] rounded-xl border border-gray-200 bg-white p-1 shadow-md focus:outline-none',
            'dark:border-white/5 dark:bg-gray-800',
            'transition duration-100 ease-in data-leave:data-closed:opacity-0'
          )}
        >
          {options.map((opt) => (
            <ListboxOption
              key={opt.id}
              value={opt}
              className={clsx(
                'group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none',
                'data-focus:bg-gray-100 dark:data-focus:bg-white/10'
              )}
            >
              {renderOption ? renderOption(opt) : opt.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  )
}
