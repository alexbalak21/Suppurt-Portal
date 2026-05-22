import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState } from "react";

type SimpleSelectProps = {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
};

export default function SimpleSelect({ options, value, onChange }: SimpleSelectProps) {
  // fallback internal state
  const initialValue = options[0] ?? "";
  const [internalValue, setInternalValue] = useState(initialValue);

  const selected = value ?? internalValue ?? initialValue;

  const handleChange = (val: string) => {
    if (onChange) {
      onChange(val);
    } else {
      setInternalValue(val);
    }
  };

  return (
    <div className="relative w-52">
      <Listbox value={selected} onChange={handleChange}>
        <ListboxButton
          className={clsx(
            "relative block w-full rounded-lg bg-white text-gray-900 outline-1 outline-gray-300 py-1.5 pr-8 pl-3 text-left text-sm",
            "dark:bg-gray-800 dark:text-white dark:outline-gray-700"
          )}
        >
          {selected}
          <ChevronDownIcon
            className="pointer-events-none absolute top-2.5 right-2.5 size-4 text-gray-500 dark:fill-white/60"
            aria-hidden="true"
          />
        </ListboxButton>

        <ListboxOptions
          anchor="bottom"
          transition
          className={clsx(
            "w-(--button-width) rounded-xl border border-gray-200 bg-white p-1 shadow-md focus:outline-none",
            "dark:border-white/5 dark:bg-gray-800",
            "transition duration-100 ease-in data-leave:data-closed:opacity-0"
          )}
        >
          {options.map((opt, index) => (
            <ListboxOption
              key={index}
              value={opt}
              className={clsx(
                "group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none",
                "data-focus:bg-gray-100 dark:data-focus:bg-white/10 dark:text-white"
              )}
            >
              {opt}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
