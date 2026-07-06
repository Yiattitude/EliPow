import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function Home() {
  const { token, hasProfile } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true })
    } else {
      navigate(hasProfile ? '/dashboard' : '/onboarding', { replace: true })
    }
  }, [token, hasProfile, navigate])

  return null
}
