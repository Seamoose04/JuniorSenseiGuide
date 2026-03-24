import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockPb, resetPocketBaseMocks, createMockShopItem } from '../mocks/pocketbase'
import { revalidatePath } from 'next/cache'

// Mock the pocketbase module
vi.mock('@/lib/pocketbase', () => ({
  default: mockPb,
}))

// Import after mocking
import { createShopItem, updateShopItem, deleteShopItem } from '@/app/shop/actions'

describe('Shop Actions', () => {
  beforeEach(() => {
    resetPocketBaseMocks()
    vi.clearAllMocks()
  })

  describe('createShopItem', () => {
    it('should create a shop item with valid data', async () => {
      const mockCreate = vi.fn().mockResolvedValue(
        createMockShopItem({ name: 'Sticker', cost: 3 })
      )
      mockPb.collection.mockReturnValue({
        create: mockCreate,
      })

      await createShopItem({
        name: 'Sticker',
        cost: 3,
        description: 'A cool sticker',
      })

      expect(mockPb.collection).toHaveBeenCalledWith('shop_items')
      expect(mockCreate).toHaveBeenCalledWith({
        name: 'Sticker',
        cost: 3,
        description: 'A cool sticker',
      })
      expect(revalidatePath).toHaveBeenCalledWith('/shop')
    })

    it('should create an item with zero cost', async () => {
      const mockCreate = vi.fn().mockResolvedValue(createMockShopItem({ cost: 0 }))
      mockPb.collection.mockReturnValue({
        create: mockCreate,
      })

      await createShopItem({
        name: 'Free Item',
        cost: 0,
        description: 'Free!',
      })

      expect(mockCreate).toHaveBeenCalledWith({
        name: 'Free Item',
        cost: 0,
        description: 'Free!',
      })
    })

    it('should throw error when creation fails', async () => {
      const mockCreate = vi.fn().mockRejectedValue(new Error('Creation failed'))
      mockPb.collection.mockReturnValue({
        create: mockCreate,
      })

      await expect(
        createShopItem({ name: 'Test', cost: 5, description: '' })
      ).rejects.toThrow('Creation failed')
    })
  })

  describe('updateShopItem', () => {
    it('should update a shop item', async () => {
      const mockUpdate = vi.fn().mockResolvedValue(
        createMockShopItem({ id: 'item-1', name: 'Updated Pencil', cost: 10 })
      )
      mockPb.collection.mockReturnValue({
        update: mockUpdate,
      })

      await updateShopItem('item-1', {
        name: 'Updated Pencil',
        cost: 10,
        description: 'An updated pencil',
      })

      expect(mockPb.collection).toHaveBeenCalledWith('shop_items')
      expect(mockUpdate).toHaveBeenCalledWith('item-1', {
        name: 'Updated Pencil',
        cost: 10,
        description: 'An updated pencil',
      })
      expect(revalidatePath).toHaveBeenCalledWith('/shop')
    })

    it('should throw error when item not found', async () => {
      const mockUpdate = vi.fn().mockRejectedValue(new Error('Record not found'))
      mockPb.collection.mockReturnValue({
        update: mockUpdate,
      })

      await expect(
        updateShopItem('nonexistent', { name: 'Test', cost: 5, description: '' })
      ).rejects.toThrow('Record not found')
    })
  })

  describe('deleteShopItem', () => {
    it('should delete a shop item', async () => {
      const mockDelete = vi.fn().mockResolvedValue(true)
      mockPb.collection.mockReturnValue({
        delete: mockDelete,
      })

      await deleteShopItem('item-1')

      expect(mockPb.collection).toHaveBeenCalledWith('shop_items')
      expect(mockDelete).toHaveBeenCalledWith('item-1')
      expect(revalidatePath).toHaveBeenCalledWith('/shop')
    })

    it('should throw error when delete fails', async () => {
      const mockDelete = vi.fn().mockRejectedValue(new Error('Delete failed'))
      mockPb.collection.mockReturnValue({
        delete: mockDelete,
      })

      await expect(deleteShopItem('item-1')).rejects.toThrow('Delete failed')
    })
  })
})
