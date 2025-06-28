// src/lib/__mocks__/supabase.ts
import { vi } from 'vitest';

// Define a flexible mock for the Supabase query builder chain
const mockQueryBuilder = (
  resolveData: { data: unknown; error: unknown; count: number | null } = {
    data: null,
    error: null,
    count: null,
  }
) => ({
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockResolvedValue(resolveData), // Assuming insert might be used elsewhere
  update: vi.fn().mockResolvedValue(resolveData), // Assuming update might be used elsewhere
  delete: vi.fn().mockResolvedValue(resolveData), // Assuming delete might be used elsewhere
  eq: vi.fn().mockReturnThis(),
  neq: vi.fn().mockReturnThis(),
  gt: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  lt: vi.fn().mockReturnThis(),
  lte: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  is: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue(resolveData), // For queries expecting a single row
  // Mock the promise resolution for general select queries
  // This allows us to use await supabase.from(...).select(...)
  then: vi.fn(function (onFulfilled, onRejected) {
    // If this.mockResolvedValueOnce has been called, use its value
    if (this.mockResolvedValue) {
      return Promise.resolve(this.mockResolvedValue).then(onFulfilled, onRejected);
    }
    // Default resolution
    return Promise.resolve(resolveData).then(onFulfilled, onRejected);
  }),
  // Helper to easily set the resolved value for a specific chain
  mockResolvedValueOnce: function (value: unknown) {
    this.mockResolvedValue = value;
    return this; // Return this to allow further chaining if needed, though usually it's the end
  },
});

// The main Supabase client mock
export const supabase = {
  from: vi.fn(() => mockQueryBuilder()), // Default behavior
  // Mock rpc if needed
  // rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
};

// Helper to reset mocks and set specific resolutions for chained calls
// This is particularly useful if a single test makes multiple `from` calls
// or if a component's `useEffect` makes multiple calls.
supabase.from.mockImplementation((tableName: string) => {
  // Default mock behavior for any table
  let defaultResponse = { data: [], error: null, count: 0 };
  if (tableName === 'profiles') {
    defaultResponse = { data: [], error: null, count: 0 };
  } else if (tableName === 'activity_log') {
    defaultResponse = { data: [], error: null, count: 0 };
  } else if (tableName === 'user_sessions') {
    defaultResponse = { data: [], error: null, count: 0 };
  } else if (tableName === 'courses') {
    defaultResponse = { data: [], error: null, count: 0 };
  } else if (tableName === 'user_progress') {
    defaultResponse = { data: [], error: null, count: 0 };
  }
  // Return a new query builder mock each time `from` is called
  // This allows different resolutions for different `from('table')` calls in the same test
  const newBuilder = mockQueryBuilder(defaultResponse);
  // Attach a convenience method to the builder itself to set its specific resolution
  newBuilder.mockResolvedValue = function (value: unknown) {
    // Renamed to avoid conflict
    this.mockResolvedValue = value; // This sets the value on the builder instance
    return this;
  };
  return newBuilder;
});
