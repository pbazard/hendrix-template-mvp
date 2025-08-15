'use client';

import React from 'react';
import { AwsResourcesFooter } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AwsResourcesDevPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>AWS Resources - Page de Développement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Cette page permet de tester et visualiser les composants AWS Resources.
          </p>
          
          <AwsResourcesFooter />
        </CardContent>
      </Card>
    </div>
  );
}