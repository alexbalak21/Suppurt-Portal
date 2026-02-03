import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState } from 'react'

const people = [
  { id: 1, name: 'Tom Cook', color: 'red' },
  { id: 2, name: 'Wade Cooper', color: 'green' },
  { id: 3, name: 'Tanya Fox', color: 'blue' },
  { id: 4, name: 'Arlene Mccoy', color: 'yellow' },
  { id: 5, name: 'Devon Webb', color: 'purple' },
]

export default function ListboxSelect() {
  const [selected, setSelected] = useState(people[1])

  return (
    <div className="mx-auto h-screen w-52 pt-20">
      <Listbox value={selected} onChange={setSelected}>
        <ListboxButton
          className={clsx(
            'relative block w-full rounded-lg outline-1 bg-white py-1.5 pr-8 pl-3 text-left text-sm/6 text-black',
          )}
        >
          {selected.name}
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black/60"
            aria-hidden="true"
          />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          className={clsx(
            'w-(--button-width) rounded-xl border border-black/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)] focus:outline-none'
          )}
        >
          {people.map((person) => (
            <ListboxOption
              key={person.name}
              value={person}
              className={clsx(`bg-${person.color}-500`, "group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none")}
            >
              <div className="text-sm/6 text-black">{person.name}</div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  )
}