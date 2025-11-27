import { FC } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Link, useLocation } from 'react-router-dom'
import { Dropdown1 } from '../../../_metronic/partials'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import { useAuth } from '../auth/core/Auth'

const ProfileHeader: FC = () => {
  const location = useLocation()
  const { currentUser, logout } = useAuth()

  const displayName =
    currentUser?.first_name && currentUser?.last_name
      ? `${currentUser.first_name} ${currentUser.last_name}`
      : currentUser?.username || currentUser?.user?.username
  const email = currentUser?.username || currentUser?.user?.useremail
  const designation = currentUser?.user?.usertype || 'Employee'
  const firstInitial = currentUser?.user?.username
    ? currentUser.user.username.charAt(0).toUpperCase()
    : '';



  return (
    <>
      <ToolbarWrapper />
      <Content>
        <div className='card mb-5 mb-xl-10'>
          <div className='card-body pt-9 pb-0'>
            <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
              <div className='me-7 mb-4'>
                <div className="symbol symbol-60px symbol-lg-100px symbol-fixed position-relative">
                    {firstInitial ? (
                      <span className="symbol-label bg-light-primary text-primary fw-bold fs-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'rem(50px)' }}>
                        {firstInitial}
                      </span>
                    ) : null}
                </div>
              </div>
              <div className='flex-grow-1'>
                <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
                  <div className='d-flex flex-column'>
                    <div className='d-flex align-items-center mb-2'>
                      <span className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
                        {displayName}
                      </span>
                      <KTIcon iconName='verify' className='fs-1 text-primary' />
                    </div>

                    <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                      <span className='d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2'>
                        <KTIcon iconName='profile-circle' className='fs-4 me-1' />
                        {designation}
                      </span>
                      <span className='d-flex align-items-center text-gray-500 text-hover-primary mb-2'>
                        <KTIcon iconName='sms' className='fs-4 me-1' />
                        {email}
                      </span>
                    </div>
                  </div>

                  <div className='d-flex my-4'>
                    <a href='#' className='btn btn-sm btn-primary me-3' onClick={logout}>
                      Sign Out
                    </a>
                    <div className='me-0'>
                      <button
                        className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                        data-kt-menu-flip='top-end'
                      >
                        <i className='bi bi-three-dots fs-3'></i>
                      </button>
                      <Dropdown1 />
                    </div>
                  </div>
                </div>

                {/* Optional stats section can remain the same */}

              </div>
            </div>

           
          </div>
        </div>
      </Content>
    </>
  )
}

export { ProfileHeader }
