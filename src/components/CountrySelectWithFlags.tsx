"use client";

interface CountrySelectProps {
  value: string;
  onChange: (val: string) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
        Country
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-11 rounded-xl border px-3 text-sm
          bg-white text-black border-neutral-300
          focus:outline-none focus:ring-2 focus:ring-blue-500
          dark:bg-neutral-900 dark:text-white dark:border-neutral-700
        "
      >
        <option value="" className="dark:bg-neutral-900">
          Select country
        </option>
        <option value="India" className="dark:bg-neutral-900">
          🇮🇳 India
        </option>
        <option value="US" className="dark:bg-neutral-900">
          🇺🇸 United States
        </option>
        <option value="UK" className="dark:bg-neutral-900">
          🇬🇧 United Kingdom
        </option>
        <option value="Canada" className="dark:bg-neutral-900">
          🇨🇦 Canada
        </option>
        <option value="Australia" className="dark:bg-neutral-900">
          🇦🇺 Australia
        </option>
      </select>
    </div>
  );
};

export default CountrySelect;
