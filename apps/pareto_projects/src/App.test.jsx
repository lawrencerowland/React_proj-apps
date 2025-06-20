import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders app heading', () => {
  render(<App />)
  const heading = screen.getByText(/Really Winning on Projects/i)
  expect(heading).toBeDefined()
})
