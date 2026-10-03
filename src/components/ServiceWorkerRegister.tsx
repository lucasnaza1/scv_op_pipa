"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((error) => {
          console.error("Falha ao registrar o service worker:", error);
        });
    }
  }, []);

  return null;
}
