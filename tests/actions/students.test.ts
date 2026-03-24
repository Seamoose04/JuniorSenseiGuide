import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockPb, resetPocketBaseMocks } from '../mocks/pocketbase'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

// Mock the pocketbase module
vi.mock('@/lib/pocketbase', () => ({
  default: mockPb,
}))

// Import after mocking
import { createStudent } from '@/app/actions/students'

describe('createStudent', () => {
  beforeEach(() => {
    resetPocketBaseMocks()
    vi.clearAllMocks()
  })

  it('should create a student with valid data', async () => {
    const mockCreate = vi.fn().mockResolvedValue({
      id: 'new-student',
      first_name: 'Jane',
      last_name: 'Smith',
    })
    mockPb.collection.mockReturnValue({
      create: mockCreate,
    })

    const formData = new FormData()
    formData.set('first_name', 'Jane')
    formData.set('last_name', 'Smith')
    formData.set('nickname', 'JJ')
    formData.set('cohort', 'Spring 2025')
    formData.set('contact', 'jane@example.com')
    formData.set('enrollment_date', '2025-01-15')

    const result = await createStudent(formData)

    expect(result).toBeNull() // null means success
    expect(mockPb.collection).toHaveBeenCalledWith('students')
    expect(mockCreate).toHaveBeenCalledWith({
      first_name: 'Jane',
      last_name: 'Smith',
      nickname: 'JJ',
      cohort: 'Spring 2025',
      contact: 'jane@example.com',
      enrollment_date: '2025-01-15',
    })
    expect(revalidatePath).toHaveBeenCalledWith('/students')
  })

  it('should create a student with minimal required fields', async () => {
    const mockCreate = vi.fn().mockResolvedValue({
      id: 'new-student',
      first_name: 'John',
      last_name: 'Doe',
    })
    mockPb.collection.mockReturnValue({
      create: mockCreate,
    })

    const formData = new FormData()
    formData.set('first_name', 'John')
    formData.set('last_name', 'Doe')

    const result = await createStudent(formData)

    expect(result).toBeNull()
    expect(mockCreate).toHaveBeenCalledWith({
      first_name: 'John',
      last_name: 'Doe',
      nickname: '',
      cohort: '',
      contact: '',
      enrollment_date: '',
    })
  })

  it('should return error when not authenticated', async () => {
    // Override the cookies mock for this test
    vi.mocked(cookies).mockResolvedValueOnce({
      get: vi.fn().mockReturnValue(undefined),
      set: vi.fn(),
    } as ReturnType<typeof cookies> extends Promise<infer T> ? T : never)

    const formData = new FormData()
    formData.set('first_name', 'John')
    formData.set('last_name', 'Doe')

    const result = await createStudent(formData)

    expect(result).toBe('Not authenticated')
    expect(mockPb.collection).not.toHaveBeenCalled()
  })

  it('should return error message when creation fails', async () => {
    const mockCreate = vi.fn().mockRejectedValue(new Error('Database error'))
    mockPb.collection.mockReturnValue({
      create: mockCreate,
    })

    const formData = new FormData()
    formData.set('first_name', 'John')
    formData.set('last_name', 'Doe')

    const result = await createStudent(formData)

    expect(result).toBe('Database error')
  })

  it('should return generic error for non-Error exceptions', async () => {
    const mockCreate = vi.fn().mockRejectedValue('Unknown error')
    mockPb.collection.mockReturnValue({
      create: mockCreate,
    })

    const formData = new FormData()
    formData.set('first_name', 'John')
    formData.set('last_name', 'Doe')

    const result = await createStudent(formData)

    expect(result).toBe('Failed to create student')
  })
})
