import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockPb, resetPocketBaseMocks } from '../mocks/pocketbase'

// Mock the pocketbase module
vi.mock('@/lib/pocketbase', () => ({
  default: mockPb,
}))

// Import after mocking
import { loginAction } from '@/app/actions/auth'

describe('loginAction', () => {
  beforeEach(() => {
    resetPocketBaseMocks()
    vi.clearAllMocks()
  })

  it('should return success when credentials are valid', async () => {
    const mockAuthWithPassword = vi.fn().mockResolvedValue({
      token: 'valid-token',
      record: { id: 'user-1', email: 'test@test.com' },
    })
    mockPb.collection.mockReturnValue({
      authWithPassword: mockAuthWithPassword,
    })
    mockPb.authStore.token = 'valid-token'

    const result = await loginAction('test@test.com', 'password123')

    expect(result.success).toBe(true)
    expect(mockPb.collection).toHaveBeenCalledWith('users')
    expect(mockAuthWithPassword).toHaveBeenCalledWith('test@test.com', 'password123')
  })

  it('should return error when credentials are invalid', async () => {
    const mockAuthWithPassword = vi.fn().mockRejectedValue(new Error('Invalid credentials'))
    mockPb.collection.mockReturnValue({
      authWithPassword: mockAuthWithPassword,
    })

    const result = await loginAction('wrong@test.com', 'wrongpassword')

    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid credentials')
  })

  it('should handle empty email', async () => {
    const mockAuthWithPassword = vi.fn().mockRejectedValue(new Error('Email required'))
    mockPb.collection.mockReturnValue({
      authWithPassword: mockAuthWithPassword,
    })

    const result = await loginAction('', 'password123')

    expect(result.success).toBe(false)
  })

  it('should handle empty password', async () => {
    const mockAuthWithPassword = vi.fn().mockRejectedValue(new Error('Password required'))
    mockPb.collection.mockReturnValue({
      authWithPassword: mockAuthWithPassword,
    })

    const result = await loginAction('test@test.com', '')

    expect(result.success).toBe(false)
  })
})
