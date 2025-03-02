"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function useDeviceId() {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    let storedDeviceId = localStorage.getItem("deviceId");

    if (!storedDeviceId) {
      storedDeviceId = uuidv4();
      localStorage.setItem("deviceId", storedDeviceId);
    }

    setDeviceId(storedDeviceId);
  }, []);

  return deviceId;
}
