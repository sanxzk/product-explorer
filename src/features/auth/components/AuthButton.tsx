import type { ButtonHTMLAttributes } from 'react';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const base =
  'w-full h-[31px] text-[13px] rounded-[3px] cursor-pointer text-[#0f1111] border ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e77600] ' +
  'disabled:opacity-70 disabled:cursor-default';

const variants = {
  primary:
    'border-[#a88734] border-b-[#846a29] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] ' +
    'bg-[linear-gradient(to_bottom,#f7dfa5,#f0c14b)] ' +
    'hover:bg-[linear-gradient(to_bottom,#f5d78e,#eeb933)] active:bg-[#f0c14b]',
  secondary:
    'border-[#adb1b8] border-b-[#8d9096] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ' +
    'bg-[linear-gradient(to_bottom,#f7f8fa,#e7e9ec)] ' +
    'hover:bg-[linear-gradient(to_bottom,#e7eaf0,#d9dce1)]',
};

export default function AuthButton({
  variant = 'primary',
  type = 'button',
  className = '',
  ...rest
}: AuthButtonProps) {
  return <button type={type} className={`${base} ${variants[variant]} ${className}`} {...rest} />;
}