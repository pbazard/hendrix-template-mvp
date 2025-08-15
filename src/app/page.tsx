"use client";

import ConfigureAmplify from "@/components/ConfigureAmplify";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import { useTodos } from "@/hooks/useTodos";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import "@aws-amplify/ui-react/styles.css";

export default function HomePage() {
  const { createTodo } = useTodos();

  const handleTestToast = () => {
    toast.info("This is an info toast!", {
      description: "Template is working perfectly!",
    });
  };

  return (
    <>
      {/* Configure Amplify */}
      <ConfigureAmplify />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              🚀 Hendrix MVP Template
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              A complete Todo CRUD application with AWS Amplify, Next.js 15, and shadcn/ui
            </p>
            <Button 
              variant="outline" 
              onClick={handleTestToast}
              className="mb-8"
            >
              Test Toast Notification
            </Button>
          </div>

          {/* Todo Application */}
          <div className="space-y-6">
            <TodoForm onAdd={createTodo} />
            <TodoList />
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-muted-foreground">
            <div className="space-y-2">
              <p>✨ Ready for development with modern best practices!</p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <a 
                  href="https://github.com/pbazard/hendrix-template-mvp"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📖 View Documentation
                </a>
                <span>•</span>
                <a 
                  href="https://github.com/pbazard/hendrix-template-mvp/issues"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🐛 Report Issues
                </a>
                <span>•</span>
                <a 
                  href="https://docs.amplify.aws/nextjs/"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🔧 Amplify Docs
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
