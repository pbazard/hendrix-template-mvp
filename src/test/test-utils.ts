// Test utilities and shared mocks
import { vi } from 'vitest'
import React from 'react'

// Common mock factories
export const createMockTodo = (id: string, content: string) => ({
  id,
  content,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

// Mock AWS Amplify client
export const createMockAmplifyClient = (todos: any[] = []) => ({
  models: {
    Todo: {
      observeQuery: vi.fn(() => ({
        subscribe: vi.fn((callback) => {
          if (callback?.next) {
            callback.next({ items: todos })
          }
          return { unsubscribe: vi.fn() }
        }),
      })),
      create: vi.fn((todo) => Promise.resolve({ data: { ...todo, id: 'new-id' } })),
      update: vi.fn((todo) => Promise.resolve({ data: todo })),
      delete: vi.fn((id) => Promise.resolve({ data: { id } })),
    },
  },
})

// Mock Next.js Image component
export const MockImage = ({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) =>
  React.createElement('img', { src, alt, ...props })
