/**
 * Composant de fil d'Ariane pour l'interface d'administration Hendrix
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '../context/AdminContext';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  name: string;
  href?: string;
  current?: boolean;
}

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const { config } = useAdmin();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Toujours commencer par l'accueil admin
    breadcrumbs.push({
      name: config.index_title,
      href: '/admin'
    });

    if (segments.length > 1) {
      // segments[0] est 'admin', on commence à partir de segments[1]
      for (let i = 1; i < segments.length; i++) {
        const segment = segments[i];
        const href = '/' + segments.slice(0, i + 1).join('/');
        const isLast = i === segments.length - 1;

        let name = segment;

        // Trouver le nom du modèle si c'est un modèle connu
        const modelName = Object.keys(config.models).find(
          model => model.toLowerCase() === segment.toLowerCase()
        );

        if (modelName) {
          const modelConfig = config.models[modelName];
          name = modelConfig.verbose_name_plural || modelName;
        } else {
          // Formatter les autres segments
          name = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          // Cas spéciaux
          if (segment === 'add') name = 'Ajouter';
          if (segment === 'change') name = 'Modifier';
          if (segment === 'delete') name = 'Supprimer';
          if (segment === 'history') name = 'Historique';
        }

        breadcrumbs.push({
          name,
          href: isLast ? undefined : href,
          current: isLast
        });
      }
    } else {
      // Nous sommes sur la page d'accueil admin
      breadcrumbs[0].current = true;
      breadcrumbs[0].href = undefined;
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link href="/admin" className="text-gray-400 hover:text-gray-500">
              <Home className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Accueil</span>
            </Link>
          </div>
        </li>
        {breadcrumbs.slice(1).map((item) => (
          <li key={item.name}>
            <div className="flex items-center">
              <ChevronRight
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {item.href ? (
                <Link
                  href={item.href}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className={cn(
                    'ml-4 text-sm font-medium',
                    item.current ? 'text-gray-900' : 'text-gray-500'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
