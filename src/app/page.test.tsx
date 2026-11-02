import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from './page'

vi.mock('@/features/portfolio/repository', () => ({
  getProfile: vi.fn().mockResolvedValue(null),
  getSettings: vi.fn().mockResolvedValue({
    title: 'Job Añover — Portfolio',
    description: 'Portfolio of Job Añover.',
    default_theme: 'dark',
  }),
  getCategories: vi.fn().mockResolvedValue([]),
  getPublishedProjects: vi.fn().mockResolvedValue([]),
  getTechnologies: vi.fn().mockResolvedValue([]),
  getCertificates: vi.fn().mockResolvedValue([]),
  getSocialLinks: vi.fn().mockResolvedValue([]),
}))

test('renders the public portfolio homepage sections', async () => {
  render(await HomePage())

  // Masthead renders without an admin entry point.
  expect(screen.getByLabelText('Primary')).toBeInTheDocument()

  // Editorial numbered section headings.
  expect(
    screen.getByRole('heading', { level: 2, name: 'Projects' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Technologies' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Certificates' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Contact' }),
  ).toBeInTheDocument()

  // Serif invitation.
  expect(screen.getByText(/Let.s work/i)).toBeInTheDocument()

  // No admin route is reachable from public navigation.
  expect(screen.queryByText('Control Room')).not.toBeInTheDocument()
})
