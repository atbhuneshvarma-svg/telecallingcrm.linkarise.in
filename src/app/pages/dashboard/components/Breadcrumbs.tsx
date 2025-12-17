import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const Breadcrumbs: FC = () => {
  const location = useLocation();

  // Split the path into segments
  const pathnames = location.pathname.split('/').filter(x => x);
//abc
  return (
    <nav aria-label="breadcrumb" className="py-2 px-4">
      <ol className="breadcrumb mb-0">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          // Convert route segment to readable text
          const displayName = name
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase()); // capitalize

          return (
            <li
              key={routeTo}
              className={clsx('breadcrumb-item', { 'active': isLast })}
              aria-current={isLast ? 'page' : undefined}
            >
              {isLast ? (
                displayName
              ) : (
                <Link to={routeTo}>{displayName}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export { Breadcrumbs };
