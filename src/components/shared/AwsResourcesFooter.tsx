'use client';

import { useState } from 'react';
import { useAwsResourcesAutoSync } from '@/hooks/useAwsResourcesAutoSync';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Cloud, Database, Shield, User, Zap, Archive, Settings, Code, ExternalLink, Copy } from 'lucide-react';

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'DynamoDB': Database,
  'IAM': Shield,
  'Cognito': User,
  'AppSync': Zap,
  'Lambda': Code,
  'CloudFormation': Settings,
  'S3': Archive,
};

const serviceColors: Record<string, string> = {
  'DynamoDB': 'bg-blue-500',
  'IAM': 'bg-red-500',
  'Cognito': 'bg-purple-500',
  'AppSync': 'bg-pink-500',
  'Lambda': 'bg-orange-500',
  'CloudFormation': 'bg-green-500',
  'S3': 'bg-yellow-500',
};

export function AwsResourcesFooter() {
  const { 
    resourcesByService, 
    loading, 
    error, 
    getResourceCount, 
    getServiceCount,
    activeSource,
    stats
  } = useAwsResourcesAutoSync({
    useRealResources: true,
    autoRefreshInterval: 30000
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());

  const toggleServiceExpansion = (serviceName: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceName)) {
      newExpanded.delete(serviceName);
    } else {
      newExpanded.add(serviceName);
    }
    setExpandedServices(newExpanded);
  };

  if (loading) {
    return (
      <div className="mt-8 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 text-center text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t pt-6">
      <div className="text-center mb-4">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Cloud className="h-4 w-4 mr-2" />
          AWS Resources ({getResourceCount()} resources, {getServiceCount()} services)
          <Badge variant="outline" className="ml-2 text-xs">
            {activeSource === 'real' ? 'Live' : 'Demo'}
          </Badge>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 ml-2" />
          ) : (
            <ChevronRight className="h-4 w-4 ml-2" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              AWS Resources {activeSource === 'real' ? 'Created by Amplify' : '(Demo Data)'}
              {loading && (
                <Badge variant="secondary" className="text-xs">
                  Synchronizing...
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(resourcesByService)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([serviceName, resources]) => {
                  const IconComponent = serviceIcons[serviceName] || Cloud;
                  const isServiceExpanded = expandedServices.has(serviceName);
                  
                  return (
                    <div key={serviceName} className="border rounded-lg p-3">
                      <Button
                        variant="ghost"
                        onClick={() => toggleServiceExpansion(serviceName)}
                        className="w-full justify-between h-auto p-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-md ${serviceColors[serviceName] || 'bg-gray-500'}`}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{serviceName}</div>
                            <div className="text-sm text-muted-foreground">
                              {resources.length} resource{resources.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        {isServiceExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>

                      {isServiceExpanded && (
                        <div className="mt-3 space-y-3 border-t pt-3">
                          {resources.map((resource) => (
                            <div
                              key={resource.id}
                              className="p-3 rounded-md bg-muted/50 border"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="font-medium text-sm truncate">{resource.name}</div>
                                    {resource.status && (
                                      <Badge 
                                        variant={
                                          resource.status === 'Active' || resource.status === 'CREATE_COMPLETE'
                                            ? 'default'
                                            : 'secondary'
                                        }
                                        className="text-xs shrink-0"
                                      >
                                        {resource.status}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <div className="text-xs text-muted-foreground space-y-1">
                                    <div>{resource.type} • {resource.region}</div>
                                    {resource.description && (
                                      <div>{resource.description}</div>
                                    )}
                                    {resource.arn && (
                                      <div className="flex items-center gap-1">
                                        <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs truncate">
                                          {resource.arn}
                                        </span>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-5 w-5 shrink-0"
                                          onClick={() => navigator.clipboard.writeText(resource.arn || '')}
                                          title="Copy ARN"
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {resource.consoleUrl && (
                                  <div className="ml-2 shrink-0">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs"
                                      onClick={() => window.open(resource.consoleUrl, '_blank', 'noopener,noreferrer')}
                                    >
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      Console
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
