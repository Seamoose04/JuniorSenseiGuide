import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockPb, resetPocketBaseMocks } from '../mocks/pocketbase'
import { revalidatePath } from 'next/cache'

vi.mock('@/lib/pocketbase', () => ({
  default: mockPb,
}))

import {
  createSection,
  updateSection,
  deleteSection,
  createProject,
  updateProject,
  deleteProject,
  createCircuitsProject,
  updateCircuitsProject,
  deleteCircuitsProject,
  createRoboticsProject,
  updateRoboticsProject,
  deleteRoboticsProject,
} from '@/app/curriculum/actions'

describe('Curriculum Actions', () => {
  beforeEach(() => {
    resetPocketBaseMocks()
    vi.clearAllMocks()
  })

  describe('createSection', () => {
    it('should create a section and revalidate', async () => {
      const mockCreate = vi.fn().mockResolvedValue({ id: 'sec-1', name: 'Chapter 1' })
      mockPb.collection.mockReturnValue({ create: mockCreate })

      await createSection({ name: 'Chapter 1' })

      expect(mockPb.collection).toHaveBeenCalledWith('codespark_sections')
      expect(mockCreate).toHaveBeenCalledWith({ name: 'Chapter 1' })
      expect(revalidatePath).toHaveBeenCalledWith('/curriculum')
    })

    it('should throw when creation fails', async () => {
      mockPb.collection.mockReturnValue({
        create: vi.fn().mockRejectedValue(new Error('Creation failed')),
      })

      await expect(createSection({ name: 'Chapter 1' })).rejects.toThrow('Creation failed')
    })
  })

  describe('updateSection', () => {
    it('should update a section and revalidate', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ id: 'sec-1', name: 'Updated' })
      mockPb.collection.mockReturnValue({ update: mockUpdate })

      await updateSection('sec-1', { name: 'Updated' })

      expect(mockPb.collection).toHaveBeenCalledWith('codespark_sections')
      expect(mockUpdate).toHaveBeenCalledWith('sec-1', { name: 'Updated' })
      expect(revalidatePath).toHaveBeenCalledWith('/curriculum')
    })
  })

  describe('deleteSection', () => {
    it('should delete a section and revalidate', async () => {
      const mockDelete = vi.fn().mockResolvedValue(true)
      mockPb.collection.mockReturnValue({ delete: mockDelete })

      await deleteSection('sec-1')

      expect(mockPb.collection).toHaveBeenCalledWith('codespark_sections')
      expect(mockDelete).toHaveBeenCalledWith('sec-1')
      expect(revalidatePath).toHaveBeenCalledWith('/curriculum')
    })
  })

  describe('createProject', () => {
    it('should create a project and revalidate', async () => {
      const mockCreate = vi.fn().mockResolvedValue({ id: 'proj-1', name: 'Loops', section: 'sec-1', order: 1 })
      mockPb.collection.mockReturnValue({ create: mockCreate })

      await createProject({ name: 'Loops', section: 'sec-1', order: 1 })

      expect(mockPb.collection).toHaveBeenCalledWith('codespark_projects')
      expect(mockCreate).toHaveBeenCalledWith({ name: 'Loops', section: 'sec-1', order: 1 })
      expect(revalidatePath).toHaveBeenCalledWith('/curriculum')
    })

    it('should throw when creation fails', async () => {
      mockPb.collection.mockReturnValue({
        create: vi.fn().mockRejectedValue(new Error('Creation failed')),
      })

      await expect(
        createProject({ name: 'Loops', section: 'sec-1', order: 1 })
      ).rejects.toThrow('Creation failed')
    })
  })

  describe('updateProject', () => {
    it('should update a project and revalidate', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ id: 'proj-1', name: 'Updated', order: 2 })
      mockPb.collection.mockReturnValue({ update: mockUpdate })

      await updateProject('proj-1', { name: 'Updated', order: 2 })

      expect(mockPb.collection).toHaveBeenCalledWith('codespark_projects')
      expect(mockUpdate).toHaveBeenCalledWith('proj-1', { name: 'Updated', order: 2 })
      expect(revalidatePath).toHaveBeenCalledWith('/curriculum')
    })
  })

  describe('deleteProject', () => {
    it('should delete a project and revalidate', async () => {
      const mockDelete = vi.fn().mockResolvedValue(true)
      mockPb.collection.mockReturnValue({ delete: mockDelete })

      await deleteProject('proj-1')

      expect(mockPb.collection).toHaveBeenCalledWith('codespark_projects')
      expect(mockDelete).toHaveBeenCalledWith('proj-1')
      expect(revalidatePath).toHaveBeenCalledWith('/curriculum')
    })
  })

  describe('createCircuitsProject', () => {
    it('should create a circuits project and revalidate', async () => {
      const mockCreate = vi.fn().mockResolvedValue({ id: 'cproj-1', name: 'LED Basics', order: 1 })
      mockPb.collection.mockReturnValue({ create: mockCreate })

      await createCircuitsProject({ name: 'LED Basics', order: 1 })

      expect(mockPb.collection).toHaveBeenCalledWith('circuits_projects')
      expect(mockCreate).toHaveBeenCalledWith({ name: 'LED Basics', order: 1 })
      expect(revalidatePath).toHaveBeenCalledWith('/curriculum')
    })

    it('should throw when creation fails', async () => {
      mockPb.collection.mockReturnValue({
        create: vi.fn().mockRejectedValue(new Error('Creation failed')),
      })

      await expect(createCircuitsProject({ name: 'LED Basics', order: 1 })).rejects.toThrow('Creation failed')
    })
  })

  describe('updateCircuitsProject', () => {
    it('should update a circuits project and revalidate', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ id: 'cproj-1', name: 'Updated', order: 2 })
      mockPb.collection.mockReturnValue({ update: mockUpdate })

      await updateCircuitsProject('cproj-1', { name: 'Updated', order: 2 })

      expect(mockPb.collection).toHaveBeenCalledWith('circuits_projects')
      expect(mockUpdate).toHaveBeenCalledWith('cproj-1', { name: 'Updated', order: 2 })
      expect(revalidatePath).toHaveBeenCalledWith('/curriculum')
    })
  })

  describe('deleteCircuitsProject', () => {
    it('should delete a circuits project and revalidate', async () => {
      const mockDelete = vi.fn().mockResolvedValue(true)
      mockPb.collection.mockReturnValue({ delete: mockDelete })

      await deleteCircuitsProject('cproj-1')

      expect(mockPb.collection).toHaveBeenCalledWith('circuits_projects')
      expect(mockDelete).toHaveBeenCalledWith('cproj-1')
      expect(revalidatePath).toHaveBeenCalledWith('/curriculum')
    })
  })

  describe('createRoboticsProject', () => {
    it('should create a robotics project and revalidate', async () => {
      const mockCreate = vi.fn().mockResolvedValue({ id: 'rproj-1', name: 'Move Forward', order: 1 })
      mockPb.collection.mockReturnValue({ create: mockCreate })

      await createRoboticsProject({ name: 'Move Forward', order: 1 })

      expect(mockPb.collection).toHaveBeenCalledWith('robotics_projects')
      expect(mockCreate).toHaveBeenCalledWith({ name: 'Move Forward', order: 1 })
      expect(revalidatePath).toHaveBeenCalledWith('/curriculum')
    })

    it('should throw when creation fails', async () => {
      mockPb.collection.mockReturnValue({
        create: vi.fn().mockRejectedValue(new Error('Creation failed')),
      })

      await expect(createRoboticsProject({ name: 'Move Forward', order: 1 })).rejects.toThrow('Creation failed')
    })
  })

  describe('updateRoboticsProject', () => {
    it('should update a robotics project and revalidate', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ id: 'rproj-1', name: 'Updated', order: 2 })
      mockPb.collection.mockReturnValue({ update: mockUpdate })

      await updateRoboticsProject('rproj-1', { name: 'Updated', order: 2 })

      expect(mockPb.collection).toHaveBeenCalledWith('robotics_projects')
      expect(mockUpdate).toHaveBeenCalledWith('rproj-1', { name: 'Updated', order: 2 })
      expect(revalidatePath).toHaveBeenCalledWith('/curriculum')
    })
  })

  describe('deleteRoboticsProject', () => {
    it('should delete a robotics project and revalidate', async () => {
      const mockDelete = vi.fn().mockResolvedValue(true)
      mockPb.collection.mockReturnValue({ delete: mockDelete })

      await deleteRoboticsProject('rproj-1')

      expect(mockPb.collection).toHaveBeenCalledWith('robotics_projects')
      expect(mockDelete).toHaveBeenCalledWith('rproj-1')
      expect(revalidatePath).toHaveBeenCalledWith('/curriculum')
    })
  })
})
