import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewStudentDialog from '@/components/NewStudentDialog'

// Mock the createStudent action
vi.mock('@/app/actions/students', () => ({
  createStudent: vi.fn(),
}))

import { createStudent } from '@/app/actions/students'

describe('NewStudentDialog', () => {
  const mockOnOpenChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the dialog when open', () => {
    render(<NewStudentDialog open={true} onOpenChange={mockOnOpenChange} />)

    expect(screen.getByText('New Student')).toBeInTheDocument()
    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Nickname')).toBeInTheDocument()
    expect(screen.getByLabelText('Cohort')).toBeInTheDocument()
    expect(screen.getByLabelText('Contact')).toBeInTheDocument()
    expect(screen.getByLabelText('Enrollment Date')).toBeInTheDocument()
  })

  it('should not render the dialog when closed', () => {
    render(<NewStudentDialog open={false} onOpenChange={mockOnOpenChange} />)

    expect(screen.queryByText('New Student')).not.toBeInTheDocument()
  })

  it('should have required fields for first and last name', () => {
    render(<NewStudentDialog open={true} onOpenChange={mockOnOpenChange} />)

    const firstNameInput = screen.getByLabelText('First Name')
    const lastNameInput = screen.getByLabelText('Last Name')

    expect(firstNameInput).toBeRequired()
    expect(lastNameInput).toBeRequired()
  })

  it('should have optional fields for nickname, cohort, contact, and enrollment date', () => {
    render(<NewStudentDialog open={true} onOpenChange={mockOnOpenChange} />)

    const nicknameInput = screen.getByLabelText('Nickname')
    const cohortInput = screen.getByLabelText('Cohort')
    const contactInput = screen.getByLabelText('Contact')
    const enrollmentInput = screen.getByLabelText('Enrollment Date')

    expect(nicknameInput).not.toBeRequired()
    expect(cohortInput).not.toBeRequired()
    expect(contactInput).not.toBeRequired()
    expect(enrollmentInput).not.toBeRequired()
  })

  it('should display Create Student and Cancel buttons', () => {
    render(<NewStudentDialog open={true} onOpenChange={mockOnOpenChange} />)

    expect(screen.getByRole('button', { name: 'Create Student' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('should call onOpenChange when Cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<NewStudentDialog open={true} onOpenChange={mockOnOpenChange} />)

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('should submit form with correct data', async () => {
    const user = userEvent.setup()
    vi.mocked(createStudent).mockResolvedValue(null)

    render(<NewStudentDialog open={true} onOpenChange={mockOnOpenChange} />)

    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    await user.type(screen.getByLabelText('Nickname'), 'Johnny')
    await user.type(screen.getByLabelText('Cohort'), 'Spring 2025')
    await user.type(screen.getByLabelText('Contact'), 'john@example.com')

    await user.click(screen.getByRole('button', { name: 'Create Student' }))

    await waitFor(() => {
      expect(createStudent).toHaveBeenCalled()
    })

    // Verify the form data was passed
    const callArg = vi.mocked(createStudent).mock.calls[0][0] as FormData
    expect(callArg.get('first_name')).toBe('John')
    expect(callArg.get('last_name')).toBe('Doe')
    expect(callArg.get('nickname')).toBe('Johnny')
    expect(callArg.get('cohort')).toBe('Spring 2025')
    expect(callArg.get('contact')).toBe('john@example.com')
  })

  it('should close dialog on successful submission', async () => {
    const user = userEvent.setup()
    vi.mocked(createStudent).mockResolvedValue(null)

    render(<NewStudentDialog open={true} onOpenChange={mockOnOpenChange} />)

    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    await user.click(screen.getByRole('button', { name: 'Create Student' }))

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('should display error message on failed submission', async () => {
    const user = userEvent.setup()
    vi.mocked(createStudent).mockResolvedValue('Failed to create student')

    render(<NewStudentDialog open={true} onOpenChange={mockOnOpenChange} />)

    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    await user.click(screen.getByRole('button', { name: 'Create Student' }))

    await waitFor(() => {
      expect(screen.getByText('Failed to create student')).toBeInTheDocument()
    })

    // Dialog should remain open
    expect(mockOnOpenChange).not.toHaveBeenCalledWith(false)
  })

  it('should show loading state while submitting', async () => {
    const user = userEvent.setup()
    // Create a promise that we can control
    let resolvePromise: (value: string | null) => void
    const pendingPromise = new Promise<string | null>((resolve) => {
      resolvePromise = resolve
    })
    vi.mocked(createStudent).mockReturnValue(pendingPromise)

    render(<NewStudentDialog open={true} onOpenChange={mockOnOpenChange} />)

    await user.type(screen.getByLabelText('First Name'), 'John')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    await user.click(screen.getByRole('button', { name: 'Create Student' }))

    // Check for loading state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument()
    })

    // Buttons should be disabled during submission
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()

    // Resolve the promise to complete the test
    resolvePromise!(null)
  })
})
