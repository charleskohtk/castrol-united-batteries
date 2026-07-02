"use client";

import { useState } from "react";

const ASEAN_CODES = [
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
}

export function PhoneInput({ id, label = "Phone Number", required }: PhoneInputProps) {
  const [dialCode, setDialCode] = useState("+65");
  const [number, setNumber] = useState("");

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-base font-bold text-foreground">
          {label}
        </label>
      )}
      <div className="flex">
        <select
          value={dialCode}
          onChange={(e) => setDialCode(e.target.value)}
          aria-label="Country code"
          className="rounded-l-[var(--radius)] border border-r-0 border-input bg-secondary text-foreground text-sm px-3 py-3 focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
        >
          {ASEAN_CODES.map(({ country, code, flag }) => (
            <option key={code} value={code}>
              {flag} {code} ({country})
            </option>
          ))}
        </select>
        <input
          id={id}
          type="tel"
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
          placeholder="12 345 6789"
          required={required}
          autoComplete="tel"
          className="flex-1 min-w-0 rounded-r-[var(--radius)] border border-input bg-background px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {/* Hidden combined value for form submission */}
        <input type="hidden" name={id} value={`${dialCode}${number}`} />
      </div>
    </div>
  );
}
