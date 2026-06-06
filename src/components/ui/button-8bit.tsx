import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface Button8bitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-black text-white border-white ' +
    '[box-shadow:4px_4px_0_#ffffff,_inset_-4px_-4px_0_#555] ' +
    'hover:[box-shadow:2px_2px_0_#ffffff,_inset_-2px_-2px_0_#555] ' +
    'active:[box-shadow:inset_2px_2px_0_#555] active:translate-x-[2px] active:translate-y-[2px] ' +
    'hover:bg-gray-900',
  secondary:
    'bg-white text-black border-black ' +
    '[box-shadow:4px_4px_0_#000,_inset_-4px_-4px_0_#aaa] ' +
    'hover:[box-shadow:2px_2px_0_#000,_inset_-2px_-2px_0_#aaa] ' +
    'active:[box-shadow:inset_2px_2px_0_#aaa] active:translate-x-[2px] active:translate-y-[2px] ' +
    'hover:bg-gray-100',
  destructive:
    'bg-red-600 text-white border-red-900 ' +
    '[box-shadow:4px_4px_0_#7f1d1d,_inset_-4px_-4px_0_#991b1b] ' +
    'hover:[box-shadow:2px_2px_0_#7f1d1d,_inset_-2px_-2px_0_#991b1b] ' +
    'active:[box-shadow:inset_2px_2px_0_#991b1b] active:translate-x-[2px] active:translate-y-[2px] ' +
    'hover:bg-red-700',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-4 py-2 text-[8px] leading-relaxed',
  md: 'px-6 py-3 text-[10px] leading-relaxed',
  lg: 'px-8 py-4 text-[12px] leading-relaxed',
};

export function Button8bit({
  className,
  variant = 'primary',
  size = 'md',
  asChild = false,
  children,
  disabled,
  ...props
}: Button8bitProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(
        'font-pixel inline-flex cursor-pointer items-center justify-center border-2',
        'select-none transition-all duration-75',
        'disabled:pointer-events-none disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </Comp>
  );
}
