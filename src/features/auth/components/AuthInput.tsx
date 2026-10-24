import type { InputHTMLAttributes, ReactNode } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  hasError?: boolean;
  /** Optional content on the right of the label row, e.g. "Forgot password" */
  labelAside?: ReactNode;
}

const base =
  'w-full h-[31px] px-[7px] py-[3px] text-[13px] bg-white border rounded-[3px] mb-[14px] outline-none ' +
  'shadow-[0_1px_0_rgba(255,255,255,0.5),inset_0_1px_0_rgba(0,0,0,0.07)] ' +
  'focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]';
const ok = 'border-[#a6a6a6] border-t-[#949494]';
const err = 'border-[#d00] shadow-[0_0_3px_2px_rgba(221,0,0,0.3)]';

export default function AuthInput({
  id,
  label,
  hasError = false,
  labelAside,
  className = '',
  ...rest
}: AuthInputProps) {
  return (
    <>
      <div className="flex justify-between items-baseline">
        <label htmlFor={id} className="block text-[13px] font-bold pb-0.5">
          {label}
        </label>
        {labelAside}
      </div>
      <input
        id={id}
        aria-invalid={hasError}
        className={`${base} ${hasError ? err : ok} ${className}`}
        {...rest}
      />
    </>
  );
}