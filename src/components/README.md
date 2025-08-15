# Components Structure

This directory follows a model-based organization pattern aligned with AWS Amplify data models.

## Directory Structure

```
components/
├── index.ts                    # Main exports barrel
├── shared/                     # Shared/utility components
│   ├── index.ts               # Shared components exports
│   └── ConfigureAmplify.tsx   # Amplify configuration component
├── todo/                      # Todo model components
│   ├── index.ts              # Todo components exports
│   ├── TodoForm.tsx          # Todo creation form
│   ├── TodoItem.tsx          # Individual todo item
│   └── TodoList.tsx          # Todo list with filters
└── ui/                       # shadcn/ui components
    ├── index.ts              # UI components exports
    ├── badge.tsx             # Badge component
    ├── button.tsx            # Button component
    ├── card.tsx              # Card component
    └── input.tsx             # Input component
```

## Organization Principles

### 1. Model-Based Structure
- Each Amplify data model gets its own folder
- Example: `todo/` for the `Todo` model
- Future models: `user/`, `project/`, etc.

### 2. Component Grouping
- **Model Components**: Business logic components related to specific data models
- **Shared Components**: Reusable components across the application
- **UI Components**: Base UI components from shadcn/ui

### 3. Import Patterns

#### Clean Imports with Barrel Exports
```typescript
// ✅ Good - Using barrel exports
import { TodoForm, TodoList } from '@/components/todo';
import { ConfigureAmplify } from '@/components/shared';
import { Button, Card } from '@/components/ui';

// ❌ Avoid - Direct file imports
import TodoForm from '@/components/todo/TodoForm';
import TodoList from '@/components/todo/TodoList';
```

#### Model-Specific Imports
```typescript
// For components within the same model folder
import TodoItem from './TodoItem';

// For cross-model imports
import { UserProfile } from '@/components/user';
```

## Adding New Components

### For Existing Models
Add the component to the appropriate model folder and update the index.ts:

```typescript
// components/todo/index.ts
export { default as TodoForm } from './TodoForm';
export { default as TodoItem } from './TodoItem';
export { default as TodoList } from './TodoList';
export { default as TodoStats } from './TodoStats'; // New component
```

### For New Models
1. Create a new folder: `components/newmodel/`
2. Add components to the folder
3. Create `components/newmodel/index.ts`
4. Update `components/index.ts`:

```typescript
// components/index.ts
export * from './todo';
export * from './newmodel'; // Add new model
export * from './shared';
export * from './ui';
```

## Benefits

1. **Scalability**: Easy to add new models and components
2. **Maintainability**: Clear separation of concerns
3. **Discoverability**: Components are logically grouped
4. **Clean Imports**: Barrel exports reduce import complexity
5. **Type Safety**: Proper TypeScript exports and imports
6. **Team Collaboration**: Clear conventions for component placement

## Example Usage

```typescript
// page.tsx
import { TodoForm, TodoList } from '@/components/todo';
import { ConfigureAmplify } from '@/components/shared';
import { Button } from '@/components/ui';

export default function HomePage() {
  return (
    <div>
      <ConfigureAmplify />
      <TodoForm onAdd={handleAdd} />
      <TodoList />
      <Button>Action</Button>
    </div>
  );
}
```

This structure scales well as your application grows and makes it easy for team members to find and contribute to the right components.
