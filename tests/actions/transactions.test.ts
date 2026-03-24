import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockPb, resetPocketBaseMocks, createMockTransaction } from '../mocks/pocketbase'
import { revalidatePath } from 'next/cache'

// Mock the pocketbase module
vi.mock('@/lib/pocketbase', () => ({
  default: mockPb,
}))

// Import after mocking
import { createTransaction } from '@/app/shop/student/[id]/actions'

describe('createTransaction', () => {
  beforeEach(() => {
    resetPocketBaseMocks()
    vi.clearAllMocks()
  })

  it('should create a positive transaction (award points)', async () => {
    const mockCreate = vi.fn().mockResolvedValue(
      createMockTransaction({ student: 'student-1', amount: 10, reason: 'Good work' })
    )
    mockPb.collection.mockReturnValue({
      create: mockCreate,
    })

    await createTransaction('student-1', 10, 'Good work')

    expect(mockPb.collection).toHaveBeenCalledWith('point_transactions')
    expect(mockCreate).toHaveBeenCalledWith({
      student: 'student-1',
      amount: 10,
      reason: 'Good work',
    })
    expect(revalidatePath).toHaveBeenCalledWith('/students/student-1')
  })

  it('should create a negative transaction (deduct points)', async () => {
    const mockCreate = vi.fn().mockResolvedValue(
      createMockTransaction({ student: 'student-1', amount: -5, reason: 'Purchased item' })
    )
    mockPb.collection.mockReturnValue({
      create: mockCreate,
    })

    await createTransaction('student-1', -5, 'Purchased item')

    expect(mockCreate).toHaveBeenCalledWith({
      student: 'student-1',
      amount: -5,
      reason: 'Purchased item',
    })
  })

  it('should create a zero-value transaction', async () => {
    const mockCreate = vi.fn().mockResolvedValue(
      createMockTransaction({ amount: 0, reason: 'Adjustment' })
    )
    mockPb.collection.mockReturnValue({
      create: mockCreate,
    })

    await createTransaction('student-1', 0, 'Adjustment')

    expect(mockCreate).toHaveBeenCalledWith({
      student: 'student-1',
      amount: 0,
      reason: 'Adjustment',
    })
  })

  it('should handle empty reason', async () => {
    const mockCreate = vi.fn().mockResolvedValue(
      createMockTransaction({ reason: '' })
    )
    mockPb.collection.mockReturnValue({
      create: mockCreate,
    })

    await createTransaction('student-1', 5, '')

    expect(mockCreate).toHaveBeenCalledWith({
      student: 'student-1',
      amount: 5,
      reason: '',
    })
  })

  it('should throw error when creation fails', async () => {
    const mockCreate = vi.fn().mockRejectedValue(new Error('Database error'))
    mockPb.collection.mockReturnValue({
      create: mockCreate,
    })

    await expect(
      createTransaction('student-1', 10, 'Test')
    ).rejects.toThrow('Database error')
  })

  it('should revalidate the correct student path', async () => {
    const mockCreate = vi.fn().mockResolvedValue(createMockTransaction())
    mockPb.collection.mockReturnValue({
      create: mockCreate,
    })

    await createTransaction('student-abc-123', 10, 'Test')

    expect(revalidatePath).toHaveBeenCalledWith('/students/student-abc-123')
  })
})
