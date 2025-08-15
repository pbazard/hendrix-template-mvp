import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('merges classes correctly', () => {
      const result = cn('px-4', 'py-2', 'bg-blue-500')
      expect(result).toBe('px-4 py-2 bg-blue-500')
    })

    it('handles conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toBe('base-class active-class')
    })

    it('handles Tailwind merge conflicts', () => {
      const result = cn('px-2 px-4') // px-4 should override px-2
      expect(result).toBe('px-4')
    })

    it('handles undefined and null values', () => {
      const result = cn('base', undefined, null, 'other')
      expect(result).toBe('base other')
    })
  })
})

// Mock component for testing
function TestComponent({ className }: { className?: string }) {
  return <div className={cn('default-class', className)} data-testid="test-element" />
}

describe('TestComponent', () => {
  it('applies default classes', () => {
    render(<TestComponent />)
    const element = screen.getByTestId('test-element')
    expect(element).toHaveClass('default-class')
  })

  it('merges additional classes', () => {
    render(<TestComponent className="additional-class" />)
    const element = screen.getByTestId('test-element')
    expect(element).toHaveClass('default-class', 'additional-class')
  })
})
