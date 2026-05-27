import React, { useState } from 'react'
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react'
import { authAPI } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { show } = useToast()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const data = await authAPI.register(formData)

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setMessage('Success! Account created successfully.')
        show({
          type: 'success',
          title: 'Account created',
          message: 'Welcome to Skivvy. Redirecting you now.'
        })
        // Reset form
        setFormData({ username: '', email: '', password: '' })
        // Trigger storage event to update header and fetch fresh profile data
        window.dispatchEvent(new Event('storage'))
        // Also dispatch a custom 'user-updated' event (payload: user) so components can update immediately
        try { window.dispatchEvent(new CustomEvent('user-updated', { detail: data.user })) } catch (e) {}
        // Redirect to profile page after successful signup
        setTimeout(() => {
          navigate('/Profile')
        }, 1500)
      } else {
        const errorMessage = data.message || 'Registration failed. Please check your details.'
        setMessage(errorMessage)
        show({
          type: 'error',
          title: 'Signup failed',
          message: errorMessage
        })
      }
    } catch (error) {
      const errorMessage = 'An error occurred. Please try again.'
      setMessage(errorMessage)
      show({
        type: 'error',
        title: 'Signup failed',
        message: errorMessage
      })
      console.error('Signup error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed_0%,_#ffedd5_38%,_#fed7aa_100%)] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_-32px_rgba(234,88,12,0.45)] backdrop-blur">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400" />
=======
    <div className="min-h-screen bg-card flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-2xl p-8 w-full max-w-md">
>>>>>>> 249afa5ced7a6307bcaf8dcb7d2363498f337aad
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            Join Skivvy
          </h1>
          <p className="text-gray-600">
            Create your account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
<<<<<<< HEAD
              autoComplete="username"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
=======
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white/60 dark:bg-black/70"
>>>>>>> 249afa5ced7a6307bcaf8dcb7d2363498f337aad
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
<<<<<<< HEAD
              autoComplete="email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
=======
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white/60 dark:bg-black/70"
>>>>>>> 249afa5ced7a6307bcaf8dcb7d2363498f337aad
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
<<<<<<< HEAD
              autoComplete="new-password"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
=======
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white/60 dark:bg-black/70"
>>>>>>> 249afa5ced7a6307bcaf8dcb7d2363498f337aad
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password Requirements */}
          <div className="text-xs text-gray-500">
            Password must be at least 6 characters long
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('Success') 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Link to Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="ml-2 text-orange-600 hover:text-orange-700 font-semibold"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Terms and Privacy */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <a href="#" className="text-orange-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
