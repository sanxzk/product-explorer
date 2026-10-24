import type { AnchorHTMLAttributes } from 'react';

export default function AuthLink({
  className = '',
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={`text-[#0066c0] hover:text-[#c45500] hover:underline ${className}`}
      {...rest}
    />
  );
}