'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function ToastTestPage() {
  const testArn = "arn:aws:dynamodb:eu-west-1:123456789012:table/Todo-dev";
  const testResourceName = "Todo-dev";

  const copyArn = async (arn: string, resourceName: string) => {
    try {
      await navigator.clipboard.writeText(arn);
      toast.success(`ARN copié!`, {
        description: `ARN de ${resourceName} copié dans le presse-papiers`,
        duration: 2000,
      });
    } catch (error) {
      toast.error('Erreur lors de la copie', {
        description: 'Impossible de copier l\'ARN dans le presse-papiers',
        duration: 3000,
      });
    }
  };

  const testOtherToasts = () => {
    toast.info('Test toast info', { duration: 2000 });
    setTimeout(() => {
      toast.warning('Test toast warning', { duration: 2000 });
    }, 500);
    setTimeout(() => {
      toast.error('Test toast error', { duration: 2000 });
    }, 1000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Test des Toasts - Copie ARN</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Resource: {testResourceName}</h3>
                  <code className="text-sm bg-white px-2 py-1 rounded text-gray-600">
                    {testArn}
                  </code>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyArn(testArn, testResourceName)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copier ARN
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Autres tests de toast :</h4>
              <Button 
                onClick={testOtherToasts}
                variant="secondary"
              >
                Tester tous les types de toast
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              <p><strong>Instructions :</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Cliquez sur "Copier ARN" pour tester le toast de succès</li>
                <li>L'ARN sera copié dans votre presse-papiers</li>
                <li>Un toast de confirmation apparaîtra en haut à droite</li>
                <li>En cas d'erreur, un toast d'erreur s'affiche</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
