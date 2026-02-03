import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
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
    <div className="relative w-60">
      <Listbox value={selected} onChange={setSelected}>
        <ListboxButton className="w-full border px-3 py-2 rounded bg-white text-left">
          {selected.name}
        </ListboxButton>

        <ListboxOptions className="absolute mt-1 w-full bg-white shadow-lg rounded max-h-60 overflow-auto z-50 border">
          {people.map((person) => (
            <ListboxOption
              key={person.id}
              value={person}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100"
            >
              {person.name}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  )
}
