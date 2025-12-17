import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../app/modules/auth';
import { Languages } from './Languages';

const HeaderUserMenu: FC = () => {
  const { currentUser, logout } = useAuth();

  // Access the nested user object according to your UserModel interface
  const userData = currentUser?.user;

  // Safe initialization with correct nested structure
  const first = userData?.username?.charAt(0) || currentUser?.first_name?.charAt(0) || '';
  const displayName =
    userData?.username ||
    currentUser?.username ||
    `${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`.trim() ||
    'User';
  const email = userData?.useremail || currentUser?.email || 'No email';
  const role = userData?.userrole || userData?.usertype || 'User';
  const designation = userData?.designation || currentUser?.occupation || '';

  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px"
      data-kt-menu="true"
    >
      <div className="menu-item px-3">
        <div className="menu-content d-flex align-items-center px-3">
          <div className="symbol symbol-50px me-5">
            <span className="symbol-label fs-2 bg-light-primary text-primary">{first || 'U'}</span>
          </div>

          <div className="d-flex flex-column">
            <div className="fw-bolder d-flex align-items-center fs-5">
              {displayName}
              <span className="badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2">
                {role === 'admin' ? 'Admin' : 'Pro'}
              </span>
            </div>
            <a href="#" className="fw-bold text-muted text-hover-primary fs-7">
              {email}
            </a>
            {designation && <span className="fw-bold text-muted fs-8 mt-1">{designation}</span>}
          </div>
        </div>
      </div>

      <div className="separator my-2"></div>

      <div className="menu-item px-5">
        <Link to={'/crafted/pages/profile'} className="menu-link px-5">
          My Profile
        </Link>
      </div>

      <div className="separator my-2"></div>

      <Languages />

      <div className="menu-item px-5">
        <a onClick={logout} className="menu-link px-5">
          Sign Out
        </a>
      </div>
    </div>
  );
};

export { HeaderUserMenu };
