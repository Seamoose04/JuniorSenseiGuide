import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  mockPb,
  resetPocketBaseMocks,
  createMockStudent,
  createMockTransaction,
  createMockScratchProgress,
  createMockCodesparkSection,
  createMockCodesparkProject,
  createMockCodesparkProgress,
  createMockCircuitsProject,
  createMockCircuitsProgress,
  createMockRoboticsProject,
  createMockRoboticsProgress,
} from '../mocks/pocketbase'

// Mock the pocketbase module
vi.mock('@/lib/pocketbase', () => ({
  default: mockPb,
}))

// Import after mocking
import {
  getStudentsWithBalances,
  getStudentData,
  getStudentScratchProgress,
  getStudentCodesparkProgress,
  getStudentCircuitsProgress,
  getStudentRoboticsProgress,
} from '@/lib/data/students'

describe('Student Data Functions', () => {
  beforeEach(() => {
    resetPocketBaseMocks()
    vi.clearAllMocks()
  })

  describe('getStudentsWithBalances', () => {
    it('should return students with their calculated balances', async () => {
      const students = [
        createMockStudent({ id: 'student-1', first_name: 'Alice', last_name: 'Smith' }),
        createMockStudent({ id: 'student-2', first_name: 'Bob', last_name: 'Jones' }),
      ]
      const transactions = [
        createMockTransaction({ student: 'student-1', amount: 10 }),
        createMockTransaction({ student: 'student-1', amount: 5 }),
        createMockTransaction({ student: 'student-2', amount: 20 }),
        createMockTransaction({ student: 'student-2', amount: -8 }),
      ]

      let callCount = 0
      mockPb.collection.mockImplementation(() => ({
        getFullList: vi.fn(async () => {
          callCount++
          return callCount === 1 ? students : transactions
        }),
      }))

      const result = await getStudentsWithBalances()

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 'student-1',
        first_name: 'Alice',
        last_name: 'Smith',
        balance: 15,
      })
      expect(result[1]).toEqual({
        id: 'student-2',
        first_name: 'Bob',
        last_name: 'Jones',
        balance: 12,
      })
    })

    it('should use nickname if available', async () => {
      const students = [
        createMockStudent({
          id: 'student-1',
          first_name: 'Alexander',
          last_name: 'Smith',
          nickname: 'Alex',
        }),
      ]

      let callCount = 0
      mockPb.collection.mockImplementation(() => ({
        getFullList: vi.fn(async () => {
          callCount++
          return callCount === 1 ? students : []
        }),
      }))

      const result = await getStudentsWithBalances()

      expect(result[0].first_name).toBe('Alex')
    })

    it('should return zero balance for students with no transactions', async () => {
      const students = [
        createMockStudent({ id: 'student-1', first_name: 'New', last_name: 'Student' }),
      ]

      let callCount = 0
      mockPb.collection.mockImplementation(() => ({
        getFullList: vi.fn(async () => {
          callCount++
          return callCount === 1 ? students : []
        }),
      }))

      const result = await getStudentsWithBalances()

      expect(result[0].balance).toBe(0)
    })

    it('should handle negative balances', async () => {
      const students = [
        createMockStudent({ id: 'student-1', first_name: 'Debt', last_name: 'Student' }),
      ]
      const transactions = [
        createMockTransaction({ student: 'student-1', amount: -50 }),
      ]

      let callCount = 0
      mockPb.collection.mockImplementation(() => ({
        getFullList: vi.fn(async () => {
          callCount++
          return callCount === 1 ? students : transactions
        }),
      }))

      const result = await getStudentsWithBalances()

      expect(result[0].balance).toBe(-50)
    })

    it('should return empty array when no students exist', async () => {
      mockPb.collection.mockImplementation(() => ({
        getFullList: vi.fn(async () => []),
      }))

      const result = await getStudentsWithBalances()

      expect(result).toEqual([])
    })
  })

  describe('getStudentData', () => {
    it('should return student data by id', async () => {
      const student = createMockStudent({
        id: 'student-123',
        first_name: 'John',
        last_name: 'Doe',
      })
      mockPb.collection.mockReturnValue({
        getOne: vi.fn(async () => student),
      })

      const result = await getStudentData('student-123')

      expect(mockPb.collection).toHaveBeenCalledWith('students')
      expect(result).toEqual(student)
    })

    it('should throw error when student not found', async () => {
      mockPb.collection.mockReturnValue({
        getOne: vi.fn(async () => {
          throw new Error('Record not found')
        }),
      })

      await expect(getStudentData('nonexistent')).rejects.toThrow('Record not found')
    })
  })

  describe('getStudentScratchProgress', () => {
    it('should return scratch progress for a student', async () => {
      const progress = [
        createMockScratchProgress({ student: 'student-1', project: 1, stars: 3 }),
        createMockScratchProgress({ student: 'student-1', project: 2, stars: 2 }),
      ]
      mockPb.collection.mockReturnValue({
        getFullList: vi.fn(async () => progress),
      })

      const result = await getStudentScratchProgress('student-1')

      expect(mockPb.collection).toHaveBeenCalledWith('scratch_progress')
      expect(result).toHaveLength(2)
      expect(result[0].project).toBe(1)
      expect(result[0].stars).toBe(3)
    })

    it('should return empty array when no progress exists', async () => {
      mockPb.collection.mockReturnValue({
        getFullList: vi.fn(async () => []),
      })

      const result = await getStudentScratchProgress('new-student')

      expect(result).toEqual([])
    })

    it('should filter by student id', async () => {
      const mockGetFullList = vi.fn(async () => [])
      mockPb.collection.mockReturnValue({
        getFullList: mockGetFullList,
      })

      await getStudentScratchProgress('student-xyz')

      expect(mockGetFullList).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: 'student.id = "student-xyz"',
        })
      )
    })
  })

  describe('getStudentCodesparkProgress', () => {
    it('should return sections with projects grouped and completed status set', async () => {
      const sections = [
        createMockCodesparkSection({ id: 'sec-1', name: 'Basics' }),
        createMockCodesparkSection({ id: 'sec-2', name: 'Advanced' }),
      ]
      const projects = [
        createMockCodesparkProject({ id: 'proj-1', name: 'Intro', order: 1, section: 'sec-1' }),
        createMockCodesparkProject({ id: 'proj-2', name: 'Loops', order: 2, section: 'sec-1' }),
        createMockCodesparkProject({ id: 'proj-3', name: 'Functions', order: 1, section: 'sec-2' }),
      ]
      const completedRecords = [
        createMockCodesparkProgress({ student: 'student-1', project: 'proj-1' }),
        createMockCodesparkProgress({ student: 'student-1', project: 'proj-3' }),
      ]

      mockPb.collection.mockImplementation((name: string) => ({
        getFullList: vi.fn(async () => {
          if (name === 'codespark_sections') return sections
          if (name === 'codespark_projects') return projects
          return completedRecords
        }),
      }))

      const result = await getStudentCodesparkProgress('student-1')

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 'sec-1',
        name: 'Basics',
        projects: [
          { id: 'proj-1', name: 'Intro', order: 1, completed: true, progressId: 'cs-progress-1' },
          { id: 'proj-2', name: 'Loops', order: 2, completed: false, progressId: null },
        ],
      })
      expect(result[1]).toEqual({
        id: 'sec-2',
        name: 'Advanced',
        projects: [
          { id: 'proj-3', name: 'Functions', order: 1, completed: true, progressId: 'cs-progress-1' },
        ],
      })
    })

    it('should return sections with all projects incomplete when no progress exists', async () => {
      const sections = [createMockCodesparkSection({ id: 'sec-1', name: 'Basics' })]
      const projects = [
        createMockCodesparkProject({ id: 'proj-1', name: 'Intro', order: 1, section: 'sec-1' }),
        createMockCodesparkProject({ id: 'proj-2', name: 'Loops', order: 2, section: 'sec-1' }),
      ]

      mockPb.collection.mockImplementation((name: string) => ({
        getFullList: vi.fn(async () => {
          if (name === 'codespark_sections') return sections
          if (name === 'codespark_projects') return projects
          return []
        }),
      }))

      const result = await getStudentCodesparkProgress('new-student')

      expect(result).toHaveLength(1)
      expect(result[0].projects.every((p) => p.completed === false)).toBe(true)
    })

    it('should return empty array when no sections exist', async () => {
      mockPb.collection.mockImplementation(() => ({
        getFullList: vi.fn(async () => []),
      }))

      const result = await getStudentCodesparkProgress('student-1')

      expect(result).toEqual([])
    })

    it('should filter progress by student id', async () => {
      const progressGetFullList = vi.fn(async () => [])
      mockPb.collection.mockImplementation((name: string) => ({
        getFullList: name === 'codespark_progress'
          ? progressGetFullList
          : vi.fn(async () => []),
      }))

      await getStudentCodesparkProgress('student-xyz')

      expect(progressGetFullList).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: 'student.id = "student-xyz"',
        })
      )
    })
  })

  describe('getStudentCircuitsProgress', () => {
    it('should return flat list of projects with completed status', async () => {
      const projects = [
        createMockCircuitsProject({ id: 'proj-1', name: 'LED Basics', order: 1 }),
        createMockCircuitsProject({ id: 'proj-2', name: 'Series Circuits', order: 2 }),
        createMockCircuitsProject({ id: 'proj-3', name: 'Parallel Circuits', order: 3 }),
      ]
      const completedRecords = [
        createMockCircuitsProgress({ id: 'cp-1', student: 'student-1', project: 'proj-1' }),
      ]

      mockPb.collection.mockImplementation((name: string) => ({
        getFullList: vi.fn(async () => {
          if (name === 'circuits_projects') return projects
          return completedRecords
        }),
      }))

      const result = await getStudentCircuitsProgress('student-1')

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({ id: 'proj-1', name: 'LED Basics', order: 1, completed: true, progressId: 'cp-1' })
      expect(result[1]).toEqual({ id: 'proj-2', name: 'Series Circuits', order: 2, completed: false, progressId: null })
      expect(result[2]).toEqual({ id: 'proj-3', name: 'Parallel Circuits', order: 3, completed: false, progressId: null })
    })

    it('should return empty array when no projects exist', async () => {
      mockPb.collection.mockImplementation(() => ({
        getFullList: vi.fn(async () => []),
      }))

      const result = await getStudentCircuitsProgress('student-1')

      expect(result).toEqual([])
    })

    it('should filter progress by student id', async () => {
      const progressGetFullList = vi.fn(async () => [])
      mockPb.collection.mockImplementation((name: string) => ({
        getFullList: name === 'circuits_progress'
          ? progressGetFullList
          : vi.fn(async () => []),
      }))

      await getStudentCircuitsProgress('student-xyz')

      expect(progressGetFullList).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: 'student.id = "student-xyz"',
        })
      )
    })
  })

  describe('getStudentRoboticsProgress', () => {
    it('should return flat list of projects with completed status', async () => {
      const projects = [
        createMockRoboticsProject({ id: 'rproj-1', name: 'Move Forward', order: 1 }),
        createMockRoboticsProject({ id: 'rproj-2', name: 'Turn Left', order: 2 }),
      ]
      const completedRecords = [
        createMockRoboticsProgress({ id: 'rp-1', student: 'student-1', project: 'rproj-1' }),
        createMockRoboticsProgress({ id: 'rp-2', student: 'student-1', project: 'rproj-2' }),
      ]

      mockPb.collection.mockImplementation((name: string) => ({
        getFullList: vi.fn(async () => {
          if (name === 'robotics_projects') return projects
          return completedRecords
        }),
      }))

      const result = await getStudentRoboticsProgress('student-1')

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ id: 'rproj-1', name: 'Move Forward', order: 1, completed: true, progressId: 'rp-1' })
      expect(result[1]).toEqual({ id: 'rproj-2', name: 'Turn Left', order: 2, completed: true, progressId: 'rp-2' })
    })

    it('should return all incomplete when no progress exists', async () => {
      const projects = [
        createMockRoboticsProject({ id: 'rproj-1', name: 'Move Forward', order: 1 }),
      ]

      mockPb.collection.mockImplementation((name: string) => ({
        getFullList: vi.fn(async () => {
          if (name === 'robotics_projects') return projects
          return []
        }),
      }))

      const result = await getStudentRoboticsProgress('student-1')

      expect(result).toHaveLength(1)
      expect(result[0].completed).toBe(false)
      expect(result[0].progressId).toBeNull()
    })

    it('should filter progress by student id', async () => {
      const progressGetFullList = vi.fn(async () => [])
      mockPb.collection.mockImplementation((name: string) => ({
        getFullList: name === 'robotics_progress'
          ? progressGetFullList
          : vi.fn(async () => []),
      }))

      await getStudentRoboticsProgress('student-abc')

      expect(progressGetFullList).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: 'student.id = "student-abc"',
        })
      )
    })
  })
})
