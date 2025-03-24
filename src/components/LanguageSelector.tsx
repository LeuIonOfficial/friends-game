'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { languages } from '@/i18n';
import { GlobeIcon } from 'lucide-react';

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // This prevents hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentLanguage = i18n.language?.substring(0, 2) || 'en';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-10 h-10 rounded-full p-0">
          <GlobeIcon className="h-5 w-5" />
          <span className="sr-only">{t('home.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, { nativeName }]) => (
          <DropdownMenuItem
            key={code}
            className={`cursor-pointer ${code === currentLanguage ? 'font-bold' : ''}`}
            onClick={() => i18n.changeLanguage(code)}
          >
            {nativeName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
