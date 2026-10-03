import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Consulta de Placas - Operação Pipa",
    short_name: "Consulta Pipa",
    description:
      "Consulta de autorização de veículos e condutores da Operação Pipa.",
    start_url: "/",
    display: "standalone",
    theme_color: "#0b3d2e",
    background_color: "#f8fafc",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
