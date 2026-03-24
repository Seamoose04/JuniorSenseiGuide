import { vi } from 'vitest'
import type { StudentsResponse, PointTransactionsResponse, ShopItemsResponse, ScratchProgressResponse, CodesparkProgressResponse, CodesparkProjectsResponse, CodesparkSectionsResponse, CircuitsProgressResponse, CircuitsProjectsResponse, RoboticsProgressResponse, RoboticsProjectsResponse } from '@/lib/pocketbase-types'

// Mock data factories
export function createMockStudent(overrides: Partial<StudentsResponse> = {}): StudentsResponse {
  return {
    id: 'student-1',
    collectionId: 'students',
    collectionName: 'students' as const,
    first_name: 'John',
    last_name: 'Doe',
    nickname: '',
    created: '2025-01-01T00:00:00.000Z',
    ...overrides,
  } as StudentsResponse
}

export function createMockTransaction(overrides: Partial<PointTransactionsResponse> = {}): PointTransactionsResponse {
  return {
    id: 'tx-1',
    collectionId: 'point_transactions',
    collectionName: 'point_transactions' as const,
    student: 'student-1',
    amount: 10,
    reason: 'Completed homework',
    created: '2025-01-01T00:00:00.000Z',
    ...overrides,
  } as PointTransactionsResponse
}

export function createMockShopItem(overrides: Partial<ShopItemsResponse> = {}): ShopItemsResponse {
  return {
    id: 'item-1',
    collectionId: 'shop_items',
    collectionName: 'shop_items' as const,
    name: 'Pencil',
    cost: 5,
    description: 'A nice pencil',
    created: '2025-01-01T00:00:00.000Z',
    updated: '2025-01-01T00:00:00.000Z',
    ...overrides,
  } as ShopItemsResponse
}

export function createMockScratchProgress(overrides: Partial<ScratchProgressResponse> = {}): ScratchProgressResponse {
  return {
    id: 'progress-1',
    collectionId: 'scratch_progress',
    collectionName: 'scratch_progress' as const,
    student: 'student-1',
    project: 1,
    stars: 2,
    created: '2025-01-01T00:00:00.000Z',
    updated: '2025-01-01T00:00:00.000Z',
    ...overrides,
  } as ScratchProgressResponse
}

export function createMockCodesparkSection(overrides: Partial<CodesparkSectionsResponse> = {}): CodesparkSectionsResponse {
  return {
    id: 'section-1',
    collectionId: 'codespark_sections',
    collectionName: 'codespark_sections' as const,
    name: 'Section 1',
    created: '2025-01-01T00:00:00.000Z',
    updated: '2025-01-01T00:00:00.000Z',
    ...overrides,
  } as CodesparkSectionsResponse
}

export function createMockCodesparkProject(overrides: Partial<CodesparkProjectsResponse> = {}): CodesparkProjectsResponse {
  return {
    id: 'project-1',
    collectionId: 'codespark_projects',
    collectionName: 'codespark_projects' as const,
    name: 'Project 1',
    order: 1,
    section: 'section-1',
    created: '2025-01-01T00:00:00.000Z',
    updated: '2025-01-01T00:00:00.000Z',
    ...overrides,
  } as CodesparkProjectsResponse
}

export function createMockCodesparkProgress(overrides: Partial<CodesparkProgressResponse> = {}): CodesparkProgressResponse {
  return {
    id: 'cs-progress-1',
    collectionId: 'codespark_progress',
    collectionName: 'codespark_progress' as const,
    student: 'student-1',
    project: 'project-1',
    created: '2025-01-01T00:00:00.000Z',
    updated: '2025-01-01T00:00:00.000Z',
    ...overrides,
  } as CodesparkProgressResponse
}

export function createMockCircuitsProject(overrides: Partial<CircuitsProjectsResponse> = {}): CircuitsProjectsResponse {
  return {
    id: 'circuits-project-1',
    collectionId: 'circuits_projects',
    collectionName: 'circuits_projects' as const,
    name: 'Circuits Project 1',
    order: 1,
    created: '2025-01-01T00:00:00.000Z',
    updated: '2025-01-01T00:00:00.000Z',
    ...overrides,
  } as CircuitsProjectsResponse
}

export function createMockCircuitsProgress(overrides: Partial<CircuitsProgressResponse> = {}): CircuitsProgressResponse {
  return {
    id: 'circuits-progress-1',
    collectionId: 'circuits_progress',
    collectionName: 'circuits_progress' as const,
    student: 'student-1',
    project: 'circuits-project-1',
    created: '2025-01-01T00:00:00.000Z',
    updated: '2025-01-01T00:00:00.000Z',
    ...overrides,
  } as CircuitsProgressResponse
}

export function createMockRoboticsProject(overrides: Partial<RoboticsProjectsResponse> = {}): RoboticsProjectsResponse {
  return {
    id: 'robotics-project-1',
    collectionId: 'robotics_projects',
    collectionName: 'robotics_projects' as const,
    name: 'Robotics Project 1',
    order: 1,
    created: '2025-01-01T00:00:00.000Z',
    updated: '2025-01-01T00:00:00.000Z',
    ...overrides,
  } as RoboticsProjectsResponse
}

export function createMockRoboticsProgress(overrides: Partial<RoboticsProgressResponse> = {}): RoboticsProgressResponse {
  return {
    id: 'robotics-progress-1',
    collectionId: 'robotics_progress',
    collectionName: 'robotics_progress' as const,
    student: 'student-1',
    project: 'robotics-project-1',
    created: '2025-01-01T00:00:00.000Z',
    updated: '2025-01-01T00:00:00.000Z',
    ...overrides,
  } as RoboticsProgressResponse
}

// Create a mock PocketBase instance
export function createMockPocketBase() {
  const mockAuthStore = {
    token: '',
    save: vi.fn(),
    clear: vi.fn(),
  }

  const mockCollections: Record<string, unknown[]> = {
    students: [],
    point_transactions: [],
    shop_items: [],
    scratch_progress: [],
    users: [],
  }

  const mockCollection = vi.fn((name: string) => ({
    getFullList: vi.fn(async () => mockCollections[name] || []),
    getOne: vi.fn(async (id: string) => {
      const items = mockCollections[name] || []
      const item = items.find((i: { id?: string }) => i.id === id)
      if (!item) throw new Error(`Record not found: ${id}`)
      return item
    }),
    create: vi.fn(async (data: unknown) => ({ id: 'new-id', ...data as object })),
    update: vi.fn(async (id: string, data: unknown) => ({ id, ...data as object })),
    delete: vi.fn(async () => true),
    authWithPassword: vi.fn(async () => ({
      token: 'mock-token',
      record: { id: 'user-1', email: 'test@test.com' },
    })),
  }))

  return {
    authStore: mockAuthStore,
    collection: mockCollection,
    _mockCollections: mockCollections,
    _setMockData: (collectionName: string, data: unknown[]) => {
      mockCollections[collectionName] = data
    },
  }
}

// Export a reusable mock pb instance
export const mockPb = createMockPocketBase()

// Helper to reset all mocks
export function resetPocketBaseMocks() {
  mockPb.authStore.save.mockClear()
  mockPb.authStore.clear.mockClear()
  mockPb.collection.mockClear()
  Object.keys(mockPb._mockCollections).forEach(key => {
    mockPb._mockCollections[key] = []
  })
}
