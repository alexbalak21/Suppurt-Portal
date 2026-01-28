import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState } from 'react'

const people = [
  { id: 1, name: 'Tom Cook' },
  { id: 2, name: 'Wade Cooper' },
  { id: 3, name: 'Tanya Fox' },
  { id: 4, name: 'Arlene Mccoy' },
  { id: 5, name: 'Devon Webb' },
]

export default function Select() {
  const [selected, setSelected] = useState(people[1])

  return (
    <div className="mx-auto h-screen w-52 pt-20">
      <Listbox value={selected} onChange={setSelected}>
        <ListboxButton
          className={clsx(
            // light mode
            'relative block w-full rounded-lg bg-white text-gray-900 outline outline-1 outline-gray-300 py-1.5 pr-8 pl-3 text-left text-sm',
            // dark mode
            'dark:bg-gray-800 dark:text-white dark:outline-gray-700'
          )}
        >
          {selected.name}
          <ChevronDownIcon
            className="pointer-events-none absolute top-2.5 right-2.5 size-4 text-gray-500 dark:fill-white/60"
            aria-hidden="true"
          />
        </ListboxButton>

        <ListboxOptions
          anchor="bottom"
          transition
          className={clsx(
            // light mode
            'w-(--button-width) rounded-xl border border-gray-200 bg-white p-1 shadow-md focus:outline-none',
            // dark mode
            'dark:border-white/5 dark:bg-gray-800',
            'transition duration-100 ease-in data-leave:data-closed:opacity-0'
          )}
        >
          {people.map((person) => (
            <ListboxOption
              key={person.name}
              value={person}
              className={clsx(
                'group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none',
                // light hover
                'data-focus:bg-gray-100',
                // dark hover
                'dark:data-focus:bg-white/10'
              )}
            >
              <CheckIcon className="invisible size-4 text-blue-600 dark:text-blue-400 group-data-selected:visible" />
              <div className="text-sm text-gray-900 dark:text-white">{person.name}</div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  )
}
