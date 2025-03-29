'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTeams } from '@/app/context/TeamContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';
import { useState } from 'react';

interface TeamSubmissionFormData {
  team1: string;
  team2: string;
  deviceId: string;
}

export function TeamSubmissionForm() {
  const router = useRouter();
  const { deviceId, setTeam1, setTeam2 } = useTeams();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<TeamSubmissionFormData>();

  const onSubmit = async (data: TeamSubmissionFormData) => {
    setIsSubmitting(true);

    try {
      const submitData = {
        ...data,
        deviceId,
      };

      const response = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (response.status === 200) {
        setTeam1(data.team1);
        setTeam2(data.team2);
        router.push(`/game`);
      } else {
        const errorData = await response.json();
        setFormError('root', {
          type: 'manual',
          message: errorData.message || 'Failed to submit teams',
        });
      }
    } catch (error) {
      setFormError('root', {
        type: 'manual',
        message: 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-96 m-5 shadow-xl">
      <CardHeader className="relative">
        <div className="absolute top-3 right-3">
          <LanguageSelector />
        </div>
        <CardTitle className="text-center">{t('home.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder={t('home.team1Placeholder')}
            {...register('team1', { required: t('home.team1Required') })}
            disabled={isSubmitting}
          />
          {errors.team1 && <p className="text-red-500 text-sm">{errors.team1.message}</p>}
          <Input
            placeholder={t('home.team2Placeholder')}
            {...register('team2', { required: t('home.team2Required') })}
            disabled={isSubmitting}
          />
          {errors.team2 && <p className="text-red-500 text-sm">{errors.team2.message}</p>}
          {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                {t('home.submitting')}
              </div>
            ) : (
              t('home.submit')
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
