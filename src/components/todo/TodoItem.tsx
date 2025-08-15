"use client";

import { useState } from "react";
import { Button, Input, Badge, Card, CardContent } from "@/components/ui";
import { Calendar, CheckCircle, Circle, Edit2, Save, Trash2, X } from "lucide-react";
import type { Schema } from "../../../amplify/data/resource";

interface TodoItemProps {
  todo: Schema["Todo"]["type"];
  onUpdate: (id: string, updates: Partial<Schema["Todo"]["type"]>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const priorityColors = {
  LOW: "bg-green-100 text-green-800 hover:bg-green-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  HIGH: "bg-red-100 text-red-800 hover:bg-red-200",
};

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(todo.content || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleDone = async () => {
    setIsLoading(true);
    await onUpdate(todo.id, { isDone: !todo.isDone });
    setIsLoading(false);
  };

  const handleSaveEdit = async () => {
    if (editContent.trim()) {
      setIsLoading(true);
      await onUpdate(todo.id, { content: editContent.trim() });
      setIsEditing(false);
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(todo.content || "");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      setIsLoading(true);
      await onDelete(todo.id);
    }
  };

  const handleTogglePriority = async () => {
    const priorities = ["LOW", "MEDIUM", "HIGH"] as const;
    const currentIndex = priorities.indexOf(todo.priority as any);
    const nextIndex = (currentIndex + 1) % priorities.length;
    await onUpdate(todo.id, { priority: priorities[nextIndex] });
  };

  return (
    <Card className={`transition-all duration-200 ${todo.isDone ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Toggle Done Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleDone}
            disabled={isLoading}
            className="p-1 h-auto"
          >
            {todo.isDone ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
          </Button>

          {/* Content */}
          <div className="flex-1">
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit();
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  className="text-sm"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveEdit} disabled={isLoading}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div>
                <p className={`text-sm ${todo.isDone ? 'line-through text-gray-500' : ''}`}>
                  {todo.content}
                </p>
                {todo.dueDate && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Priority Badge */}
          <Badge 
            className={`cursor-pointer text-xs ${priorityColors[todo.priority as keyof typeof priorityColors] || priorityColors.MEDIUM}`}
            onClick={handleTogglePriority}
          >
            {todo.priority}
          </Badge>

          {/* Actions */}
          {!isEditing && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="p-1 h-auto"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
                className="p-1 h-auto text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
