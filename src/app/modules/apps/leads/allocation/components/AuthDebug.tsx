import React, { useEffect, useState } from 'react'

interface AuthInfo {
  tokens?: Record<string, string | null>
  globalAuth?: any
  cookies?: string
  localStorageKeys?: string[]
  sessionStorageKeys?: string[]
}

const AuthDebug: React.FC = () => {
  const [authInfo, setAuthInfo] = useState<AuthInfo>({})

  useEffect(() => {
    const tokens: Record<string, string | null> = {
      'localStorage auth_token': localStorage.getItem('auth_token'),
      'localStorage token': localStorage.getItem('token'),
      'sessionStorage auth_token': sessionStorage.getItem('auth_token'),
      'sessionStorage token': sessionStorage.getItem('token'),
      'localStorage access_token': localStorage.getItem('access_token'),
      'localStorage user': localStorage.getItem('user'),
    }

    // @ts-ignore
    const globalAuth = window.auth || window.Auth || window.userAuth

    setAuthInfo({
      tokens,
      globalAuth,
      cookies: document.cookie,
      localStorageKeys: Object.keys(localStorage),
      sessionStorageKeys: Object.keys(sessionStorage),
    })
  }, [])

  const testAuth = async () => {
    try {
      const response = await fetch('https://financecrm.linkarise.in/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          Accept: 'application/json',
        },
        credentials: 'include',
      })

      if (response.ok) {
        const userData = await response.json()
        alert('✅ Auth successful! User: ' + JSON.stringify(userData))
      } else {
        alert('❌ Auth failed: ' + response.status)
      }
    } catch (error: any) {
      alert('❌ Auth test error: ' + String(error))
    }
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-warning">
        <h5 className="card-title mb-0">🔐 Authentication Debug</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h6>Token Status:</h6>
            <ul className="list-unstyled">
              {(Object.entries(authInfo.tokens || {}) as [string, string | null][]).map(
                ([key, value]) => {
                  const safeValue = value ?? null
                  return (
                    <li key={key}>
                      <strong>{key}:</strong>{' '}
                      {safeValue ? '✅ Present' : '❌ Missing'}
                      {safeValue && (
                        <small className="text-muted ms-2">
                          ({String(safeValue).length} chars)
                        </small>
                      )}
                    </li>
                  )
                }
              )}
            </ul>
          </div>

          <div className="col-md-6">
            <h6>Actions:</h6>
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-sm btn-primary" onClick={testAuth}>
                Test Auth
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  const token = prompt('Enter auth token:')
                  if (token) {
                    localStorage.setItem('auth_token', token)
                    window.location.reload()
                  }
                }}
              >
                Set Token
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => {
                  localStorage.clear()
                  sessionStorage.clear()
                  window.location.reload()
                }}
              >
                Clear All
              </button>
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => {
                  window.location.href = '/auth/login'
                }}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>

        {Array.isArray(authInfo.localStorageKeys) && (
          <div className="mt-3">
            <h6>LocalStorage Contents:</h6>
            <code className="small">
              {authInfo.localStorageKeys.join(', ')}
            </code>
          </div>
        )}

        {authInfo && Object.keys(authInfo).length > 0 && (
          <div className="mt-3">
            <h6>Full Auth Info (Debug):</h6>
            <pre className="small bg-light p-2 rounded text-break">
              {JSON.stringify(authInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthDebug
