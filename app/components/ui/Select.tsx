"use client";

import { Fragment } from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Field, Label } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  id?: string;
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Select({ id, label, options, value, onChange, placeholder = "Select an option", className = "" }: SelectProps) {
  const selected = options.find((o) => o.value === value);

  return (
    <Field className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <Label htmlFor={id} className="text-base font-bold text-foreground">
          {label}
        </Label>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative mb-2">
          <ListboxButton
            id={id}
            className="relative w-full rounded-[var(--radius)] border border-input bg-background px-3 py-3 text-left text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            <span className={selected ? "" : "text-muted-foreground"}>
              {selected?.label || placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </span>
          </ListboxButton>

          <ListboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-[var(--radius)] border border-input bg-background py-1 text-base shadow-lg focus:outline-none">
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                as={Fragment}
              >
                {({ selected: isSelected, focus }) => (
                  <li
                    className={`relative cursor-pointer select-none py-2.5 pl-10 pr-4 ${
                      focus ? "bg-secondary text-foreground" : "text-foreground"
                    } ${option.disabled ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    {isSelected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                    <span className={isSelected ? "font-medium" : "font-normal"}>
                      {option.label}
                    </span>
                  </li>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </Field>
  );
}
