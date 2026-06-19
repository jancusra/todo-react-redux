import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// unmount React trees after every test to avoid cross-test leakage
afterEach(() => {
  cleanup()
})
