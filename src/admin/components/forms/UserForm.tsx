/**
 * Formulaire spécialisé pour la gestion des utilisateurs Cognito
 */

'use client';

import React, { useState, useEffect } from 'react';
import { CognitoUser } from '../../types';
import { CognitoAuthService } from '../../services/auth';
import { AdminForm } from './AdminForm';
import { COGNITO_GROUPS } from '../../constants';

interface UserFormProps {
  user?: CognitoUser;
  onSubmit: (userData: any) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [availableGroups, setAvailableGroups] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    // Charger les groupes disponibles
    const groups = Object.values(COGNITO_GROUPS).map(group => ({
      value: group,
      label: group.charAt(0).toUpperCase() + group.slice(1)
    }));
    setAvailableGroups(groups);
  }, []);

  const userFields = [
    {
      name: 'username',
      label: 'Nom d\'utilisateur',
      type: 'text' as const,
      required: true,
      readonly: !!user // Ne peut pas modifier le username d'un utilisateur existant
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true
    },
    {
      name: 'given_name',
      label: 'Prénom',
      type: 'text' as const,
      required: true
    },
    {
      name: 'family_name',
      label: 'Nom de famille',
      type: 'text' as const,
      required: true
    },
    {
      name: 'phone_number',
      label: 'Téléphone',
      type: 'text' as const,
      required: false
    },
    {
      name: 'groups',
      label: 'Groupes',
      type: 'select' as const,
      required: false,
      choices: availableGroups,
      helpText: 'Sélectionner les groupes pour cet utilisateur'
    },
    {
      name: 'enabled',
      label: 'Compte activé',
      type: 'boolean' as const,
      required: false
    }
  ];

  // Si on édite un utilisateur, préparer les données initiales
  const initialData = user ? {
    username: user.username,
    email: user.email,
    given_name: user.given_name || '',
    family_name: user.family_name || '',
    phone_number: user.phone_number || '',
    groups: user.groups[0] || '', // Premier groupe pour simplifier
    enabled: user.enabled ?? user.isActive
  } : undefined;

  const handleSubmit = async (formData: any) => {
    try {
      // Transformer les données pour l'API Cognito
      const userData = {
        ...formData,
        groups: formData.groups ? [formData.groups] : []
      };

      await onSubmit(userData);
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire utilisateur:', error);
      throw error;
    }
  };

  return (
    <AdminForm
      fields={userFields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      title={user ? `Modifier l'utilisateur ${user.username}` : 'Créer un nouvel utilisateur'}
      description={user ? 'Modifier les informations de cet utilisateur' : 'Créer un nouvel utilisateur dans AWS Cognito'}
      isLoading={isLoading}
    />
  );
};
