import { listarOpcoesFiltro } from "@/lib/veiculos";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const opcoes = await listarOpcoesFiltro();
    return Response.json(opcoes, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao carregar filtros.",
      },
      { status: 500 }
    );
  }
}
