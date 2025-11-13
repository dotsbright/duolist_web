import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: ReactNode;
  actions?: ReactNode;
}

export default function Card({ title, actions, className = '', children, ...rest }: CardProps) {
  return (
    <div className={`card ${className}`} {...rest}>
      {(title || actions) && (
        <div className="mb-3 flex items-center justify-between">
          {title ? <h3 className="m-0 text-[16px] font-semibold">{title}</h3> : <span />}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
