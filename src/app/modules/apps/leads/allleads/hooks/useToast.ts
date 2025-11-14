import { useCallback } from 'react'
import { toast } from 'react-toastify'

export const useToast = () => {
  const showSuccess = useCallback((message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }, [])

  const showError = useCallback((error: any) => {
    // Handle different error formats
    let message = 'Something went wrong'
    
    if (typeof error === 'string') {
      message = error
    } else if (error?.response?.data?.message) {
      // Axios error with response
      message = error.response.data.message
    } else if (error?.message) {
      // Error object with message
      message = error.message
    } else if (error?.data?.message) {
      // Other response formats
      message = error.data.message
    } else if (error?.success !== undefined && error?.message) {
      // Handle cases where we might get a success response incorrectly passed as error
      // If it's actually a success response, we should show success instead
      if (error.success) {
        showSuccess(error.message)
        return
      }
      message = error.message
    }

    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }, [showSuccess])

  const showWarning = useCallback((message: string) => {
    toast.warn(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }, [])

  const showInfo = useCallback((message: string) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }, [])

  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const result = window.confirm(message)
      resolve(result)
    })
  }, [])

  return { 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo, 
    showConfirm 
  }
}