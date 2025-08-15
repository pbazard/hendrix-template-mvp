"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar } from "lucide-react";
import type { Schema } from "../../amplify/data/resource";

interface TodoFormProps {
  onAdd: (todo: {
    content: string;
    priority?: "LOW" | "MEDIUM" | "HIGH";
    dueDate?: string;
  }) => Promise<void>;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      await onAdd({
        content: content.trim(),
        priority,
        dueDate: dueDate || undefined,
      });
      
      // Reset form
      setContent("");
      setDueDate("");
      setPriority("MEDIUM");
      setIsExpanded(false);
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const priorityOptions = [
    { value: "LOW", label: "Low", color: "text-green-600" },
    { value: "MEDIUM", label: "Medium", color: "text-yellow-600" },
    { value: "HIGH", label: "High", color: "text-red-600" },
  ] as const;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Add New Todo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="flex-1"
            />
            {!isExpanded && (
              <Button type="submit" disabled={!content.trim() || isLoading}>
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isExpanded && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
              {/* Priority Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Priority
                </label>
                <div className="flex gap-2">
                  {priorityOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={priority === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPriority(option.value)}
                      className={option.color}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Due Date (Optional)
                </label>
                <div className="flex gap-2 items-center">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  type="submit" 
                  disabled={!content.trim() || isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Adding..." : "Add Todo"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsExpanded(false);
                    setContent("");
                    setDueDate("");
                    setPriority("MEDIUM");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
