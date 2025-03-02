'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'; // ✅ Use next/navigation for App Router

export function useDeviceId() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let storedDeviceId = localStorage.getItem('deviceId');

    if (!storedDeviceId) {
      storedDeviceId = uuidv4();
      localStorage.setItem('deviceId', storedDeviceId);
    }

    setDeviceId(storedDeviceId);
  }, []);

  const clearDeviceId = () => {
    router.push('/'); // ✅ Redirect to home
  };

  return {
    deviceId,
    clearDeviceId,
  };
}
