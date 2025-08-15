"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { toast } from "sonner";

const client = generateClient<Schema>();

export function useTodos() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch and observe todos
  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => {
        setTodos([...data.items]);
        setIsLoading(false);
        setError(null);
      },
      error: (err) => {
        console.error("Error observing todos:", err);
        setError("Failed to load todos");
        setIsLoading(false);
        toast.error("Failed to load todos");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Create todo
  const createTodo = async (todoData: {
    content: string;
    priority?: "LOW" | "MEDIUM" | "HIGH";
    dueDate?: string;
  }) => {
    try {
      const result = await client.models.Todo.create({
        content: todoData.content,
        priority: todoData.priority || "MEDIUM",
        dueDate: todoData.dueDate || null,
        isDone: false,
      });

      if (result.errors) {
        throw new Error(result.errors.map(e => e.message).join(", "));
      }

      toast.success("Todo created successfully!", {
        description: `Added: ${todoData.content}`,
      });
    } catch (error) {
      console.error("Error creating todo:", error);
      toast.error("Failed to create todo");
      throw error;
    }
  };

  // Update todo
  const updateTodo = async (
    id: string, 
    updates: Partial<Schema["Todo"]["type"]>
  ) => {
    try {
      const result = await client.models.Todo.update({
        id,
        ...updates,
      });

      if (result.errors) {
        throw new Error(result.errors.map(e => e.message).join(", "));
      }

      toast.success("Todo updated successfully!");
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update todo");
      throw error;
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      const result = await client.models.Todo.delete({ id });

      if (result.errors) {
        throw new Error(result.errors.map(e => e.message).join(", "));
      }

      toast.success("Todo deleted successfully!");
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete todo");
      throw error;
    }
  };

  // Filter and sort utilities
  const getFilteredTodos = (filter: "all" | "active" | "completed") => {
    switch (filter) {
      case "active":
        return todos.filter(todo => !todo.isDone);
      case "completed":
        return todos.filter(todo => todo.isDone);
      default:
        return todos;
    }
  };

  const getSortedTodos = (
    todoList: Array<Schema["Todo"]["type"]>, 
    sortBy: "created" | "priority" | "dueDate" = "created"
  ) => {
    return [...todoList].sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 2) - 
                 (priorityOrder[a.priority as keyof typeof priorityOrder] || 2);
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });
  };

  // Stats
  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.isDone).length,
    active: todos.filter(todo => !todo.isDone).length,
    overdue: todos.filter(todo => 
      !todo.isDone && 
      todo.dueDate && 
      new Date(todo.dueDate) < new Date()
    ).length,
  };

  return {
    todos,
    isLoading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    getFilteredTodos,
    getSortedTodos,
    stats,
  };
}
