import { NextRequest } from "next/server";
import { listarVeiculos } from "@/lib/veiculos";

// Evita cache de listagens durante o dev.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lote = searchParams.get("lote")?.trim() || undefined;
    const municipio = searchParams.get("municipio")?.trim() || undefined;

    if (!lote && !municipio) {
      return Response.json(
        { error: "Informe pelo menos um filtro: ?lote= ou ?municipio=" },
        { status: 400 }
      );
    }

    const veiculos = await listarVeiculos({ lote, municipio });
    return Response.json(
      { total: veiculos.length, veiculos },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao listar veículos.",
      },
      { status: 500 }
    );
  }
}
