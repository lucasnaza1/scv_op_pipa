import { consultarPlaca, normalizarPlaca } from "@/lib/veiculos";

// Placas brasileiras: 7 caracteres alfanuméricos (padrão antigo e Mercosul).
const PLACA_VALIDA = /^[A-Z0-9]{7}$/;

// A consulta acontece a cada request (o build nunca deve tocar o banco).
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ placa: string }> }
) {
  try {
    const { placa } = await params;

    // Placas podem chegar com caracteres URL-encoded (%2D etc.).
    const placaNormalizada = normalizarPlaca(decodeURIComponent(placa));

    if (!PLACA_VALIDA.test(placaNormalizada)) {
      return Response.json(
        { encontrado: false, error: "Placa inválida: informe 7 caracteres alfanuméricos." },
        { status: 400 }
      );
    }

    const veiculo = await consultarPlaca(placaNormalizada);

    return Response.json(
      veiculo ? { encontrado: true, veiculo } : { encontrado: false },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Erro interno ao consultar a placa." },
      { status: 500 }
    );
  }
}
