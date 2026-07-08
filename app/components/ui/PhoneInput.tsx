"use client";

import { Fragment, useState } from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Field, Label } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

export const ASEAN_CODES = [
  { country: "Brunei", code: "+673", flag: "🇧🇳" },
  { country: "Cambodia", code: "+855", flag: "🇰🇭" },
  { country: "Indonesia", code: "+62", flag: "🇮🇩" },
  { country: "Laos", code: "+856", flag: "🇱🇦" },
  { country: "Malaysia", code: "+60", flag: "🇲🇾" },
  { country: "Myanmar", code: "+95", flag: "🇲🇲" },
  { country: "Philippines", code: "+63", flag: "🇵🇭" },
  { country: "Singapore", code: "+65", flag: "🇸🇬" },
  { country: "Thailand", code: "+66", flag: "🇹🇭" },
  { country: "Vietnam", code: "+84", flag: "🇻🇳" },
];

interface PhoneInputProps {
  id: string;
  label?: string;
  required?: boolean;
  onCountryChange?: (country: string) => void;
}

export function PhoneInput({ id, label = "Phone Number", required, onCountryChange }: PhoneInputProps) {
  const [dialCode, setDialCode] = useState("+65");
  const [number, setNumber] = useState("");

  const selected = ASEAN_CODES.find((c) => c.code === dialCode)!;

  function handleDialCodeChange(code: string) {
    setDialCode(code);
    const country = ASEAN_CODES.find((c) => c.code === code);
    if (country && onCountryChange) onCountryChange(country.country);
  }

  return (
    <Field className="flex flex-col gap-2">
      {label && (
        <Label htmlFor={id} className="text-base font-bold text-foreground">
          {label}
        </Label>
      )}
      <div className="flex mb-2">
        <Listbox value={dialCode} onChange={handleDialCodeChange}>
          <div className="relative">
            <ListboxButton className="flex items-center gap-1 rounded-l-[var(--radius)] border border-r-0 border-input bg-secondary px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer h-full">
              <span>{selected.flag} {selected.code}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
            </ListboxButton>

            <ListboxOptions className="absolute z-50 mt-1 max-h-60 w-56 overflow-auto rounded-[var(--radius)] border border-input bg-background py-1 text-sm shadow-lg focus:outline-none">
              {ASEAN_CODES.map(({ country, code, flag }) => (
                <ListboxOption key={code} value={code} as={Fragment}>
                  {({ selected: isSelected, focus }) => (
                    <li
                      className={`cursor-pointer select-none py-2 px-3 ${
                        focus ? "bg-secondary" : ""
                      } ${isSelected ? "font-medium text-primary" : "text-foreground"}`}
                    >
                      {flag} {code} ({country})
                    </li>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>

        <input
          id={id}
          type="tel"
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
          placeholder="12 345 6789"
          required={required}
          autoComplete="tel"
          className="flex-1 min-w-0 rounded-r-[var(--radius)] border border-input bg-background px-3 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input type="hidden" name={id} value={`${dialCode}${number}`} />
      </div>
    </Field>
  );
}
