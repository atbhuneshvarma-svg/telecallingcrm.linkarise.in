
import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {getUserByToken, login} from '../core/_requests'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {useAuth} from '../core/Auth'

const loginSchema = Yup.object().shape({
  userloginid: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Login ID is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
});


const initialValues = {
  userloginid: '', // your default loginid
  password: '', // your default password
};
/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const [loading, setLoading] = useState(false)
  const {saveAuth, setCurrentUser} = useAuth()

 const formik = useFormik({
  initialValues,
  validationSchema: loginSchema,
  onSubmit: async (values, { setStatus, setSubmitting }) => {
    setLoading(true)
    try {
      const { data: auth } = await login(values.userloginid, values.password)
      saveAuth(auth)
      const { data: user } = await getUserByToken(auth.api_token)
      setCurrentUser(user)
    } catch (error) {
      console.error(error)
      saveAuth(undefined)
      setStatus('The login details are incorrect')
      setSubmitting(false)
      setLoading(false)
    }
  },
})

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      {/* begin::Heading */}
      <div className='text-center mb-11'>
        <h1 className='text-gray-900 fw-bolder mb-3'>Sign In</h1>
        <div className='text-gray-500 fw-semibold fs-6'>Your Finance Crm</div>
      </div>
      {/* begin::Heading */}
    
           <div className="d-flex flex-center flex-column flex-lg-row-fluid">

        <img src={toAbsoluteUrl('media/logos/default.png')}
          className='h-150px'
        />
      </div>

      {/* begin::Separator */}
      <div className='separator separator-content my-14'>
        <span className='w-125px text-gray-500 fw-semibold fs-7'>Login ID</span>
      </div>
      {/* end::Separator */}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <input
          placeholder='Login ID'
          {...formik.getFieldProps('userloginid')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.userloginid && formik.errors.userloginid},
            {
              'is-valid': formik.touched.userloginid && !formik.errors.userloginid,
            }
          )}
          type='text'
          name='userloginid'
          autoComplete='off'
        />
        {formik.touched.userloginid && formik.errors.userloginid && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.userloginid}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-3'>
        <input
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.password && formik.errors.password,
            },
            {
              'is-valid': formik.touched.password && !formik.errors.password,
            }
          )}
          name='password'
          placeholder='Password'
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}


      {/* begin::Action */}
      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-primary'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Continue</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}
    </form>
  )
}
