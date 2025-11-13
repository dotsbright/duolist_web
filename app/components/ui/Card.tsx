import type { ReactNode, HTMLAttributes } from 'react';

import type { PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<Omit<HTMLAttributes<HTMLDivElement>, 'title'>> & {
  title?: ReactNode;
  actions?: ReactNode;
  htmlTitle?: string;
};

export default function Card({ title, actions, className = '', children, htmlTitle, ...rest }: CardProps) {
  return (
    <div className={`card ${className}`} {...rest} title={htmlTitle}>
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
