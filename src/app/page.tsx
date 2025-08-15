"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({
        content,
      });
      toast.success("Todo created successfully!", {
        description: `Added: ${content}`,
      });
    }
  }

  function deleteTodo(id: string, content: string) {
    client.models.Todo.delete({ id });
    toast.error("Todo deleted", {
      description: `Removed: ${content}`,
    });
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Hendrix MVP Template</h1>
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">My todos</h2>
          <div className="space-x-2 mb-4">
            <Button onClick={createTodo}>
              + Add new todo
            </Button>
            <Button 
              variant="outline" 
              onClick={() => toast.info("This is an info toast!")}
            >
              Test Toast
            </Button>
          </div>
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li key={todo.id} className="p-3 bg-muted rounded border flex justify-between items-center">
                <span>{todo.content}</span>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteTodo(todo.id, todo.content || "")}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 text-center text-muted-foreground">
          🚀 Hendrix MVP Template - Ready for development!
          <br />
          <a 
            href="https://github.com/pbazard/hendrix-template-mvp"
            className="text-primary hover:underline"
          >
            View template documentation
          </a>
        </div>
      </div>
    </main>
  );
}
