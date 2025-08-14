"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Button } from "@/components/ui/button";

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
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">QRArtistry MVP</h1>
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">My todos</h2>
          <Button onClick={createTodo} className="mb-4">
            + Add new todo
          </Button>
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li key={todo.id} className="p-3 bg-muted rounded border">
                {todo.content}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 text-center text-muted-foreground">
          🥳 App successfully hosted with Tailwind CSS and shadcn/ui!
          <br />
          <a 
            href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/"
            className="text-primary hover:underline"
          >
            Review next steps of this tutorial.
          </a>
        </div>
      </div>
    </main>
  );
}
