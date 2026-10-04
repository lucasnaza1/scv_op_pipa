import { getPrisma } from "@/infra/db/prisma";

export type Veiculo = {
  placa: string;
  nome_condutor: string;
  municipio_uf: string;
  lote: string | null;
};

export type FiltroVeiculos = { lote?: string; municipio?: string };

/**
 * Remove espaços, hífens e pontos e converte para maiúsculas.
 * Ex.: "abc-1234" -> "ABC1234"
 */
export function normalizarPlaca(input: string): string {
  return input.replace(/[\s.\-]/g, "").toUpperCase();
}

/**
 * Normaliza um registro cru do banco para o tipo de domínio.
 * Campos nulos viram string vazia (UI já lida com ausência de lote).
 */
function paraVeiculo(r: {
  placa: string;
  nome_condutor: string | null;
  municipio_uf: string | null;
  lote: string | null;
}): Veiculo {
  return {
    placa: r.placa,
    nome_condutor: r.nome_condutor ?? "",
    municipio_uf: r.municipio_uf ?? "",
    lote: r.lote,
  };
}

/**
 * Busca o veículo pela placa (comparação case-insensitive após normalização).
 * Retorna null quando não encontrada.
 */
export async function consultarPlaca(placa: string): Promise<Veiculo | null> {
  const alvo = normalizarPlaca(placa);
  if (!alvo) return null;

  const registro = await getPrisma().caminhao.findFirst({
    where: { placa: alvo }, // collations _ci do MySQL já são case-insensitive
    select: {
      placa: true,
      nome_condutor: true,
      municipio_uf: true,
      lote: true,
    },
  });

  return registro ? paraVeiculo(registro) : null;
}

/**
 * Lista veículos por lote e/ou município, ordenados por nome do condutor.
 * Campos nulos na tabela caem fora do resultado (placa é o identificador).
 */
export async function listarVeiculos(filtro: FiltroVeiculos): Promise<Veiculo[]> {
  const where: { lote?: string; municipio_uf?: { contains: string } } = {};

  if (filtro.lote) where.lote = filtro.lote;
  if (filtro.municipio) where.municipio_uf = { contains: filtro.municipio };

  const registros = await getPrisma().caminhao.findMany({
    where,
    select: {
      placa: true,
      nome_condutor: true,
      municipio_uf: true,
      lote: true,
    },
    orderBy: [{ lote: "asc" }, { nome_condutor: "asc" }],
  });

  // Placa nula = linha sem veículo associado; não faz sentido listar.
  return registros.filter((r) => r.placa).map(paraVeiculo);
}

/**
 * Valores distintos de lote e município para popular os filtros da gaveta.
 */
export async function listarOpcoesFiltro(): Promise<{
  lotes: string[];
  municipios: string[];
}> {
  const db = getPrisma();
  const [lotes, municipios] = await Promise.all([
    db.caminhao.findMany({
      where: { NOT: [{ lote: null }, { lote: "" }] },
      distinct: ["lote"],
      select: { lote: true },
      orderBy: { lote: "asc" },
    }),
    db.caminhao.findMany({
      where: { NOT: [{ municipio_uf: null }, { municipio_uf: "" }] },
      distinct: ["municipio_uf"],
      select: { municipio_uf: true },
      orderBy: { municipio_uf: "asc" },
    }),
  ]);

  return {
    lotes: lotes.map((r) => r.lote as string),
    municipios: municipios.map((r) => r.municipio_uf as string),
  };
}
