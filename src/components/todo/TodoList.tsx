"use client";

import { useState } from "react";
import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import TodoItem from "./TodoItem";
import { useTodos } from "@/hooks/useTodos";
import { Filter, SortAsc, BarChart3, AlertCircle } from "lucide-react";

export default function TodoList() {
  const {
    todos,
    isLoading,
    error,
    updateTodo,
    deleteTodo,
    getFilteredTodos,
    getSortedTodos,
    stats,
  } = useTodos();

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [sortBy, setSortBy] = useState<"created" | "priority" | "dueDate">("created");

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Loading todos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-red-500">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredTodos = getFilteredTodos(filter);
  const sortedTodos = getSortedTodos(filteredTodos, sortBy);

  const filterOptions = [
    { key: "all", label: "All", count: stats.total },
    { key: "active", label: "Active", count: stats.active },
    { key: "completed", label: "Completed", count: stats.completed },
  ] as const;

  const sortOptions = [
    { key: "created", label: "Created", icon: SortAsc },
    { key: "priority", label: "Priority", icon: Filter },
    { key: "dueDate", label: "Due Date", icon: SortAsc },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.active}</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <div className="text-sm text-gray-500">Overdue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sort */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Filters */}
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">Filter:</span>
              {filterOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={filter === option.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(option.key)}
                  className="relative"
                >
                  {option.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {option.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">Sort by:</span>
              {sortOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={sortBy === option.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(option.key)}
                >
                  <option.icon className="h-4 w-4 mr-1" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Todo List */}
      <div className="space-y-3">
        {sortedTodos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                {filter === "all" 
                  ? "No todos yet. Add one above to get started!" 
                  : `No ${filter} todos found.`}
              </div>
            </CardContent>
          </Card>
        ) : (
          sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}
