import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

 test('renders portfolio heading', () => {
  render(<App />)
  const heading = screen.getByText(/Portfolio Management App/i)
  expect(heading).toBeDefined()
 })
