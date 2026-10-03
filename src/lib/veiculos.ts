import veiculosData from "@/data/veiculos.json";

export type Veiculo = {
  placa: string;
  nome_condutor: string;
  municipio_uf: string;
};

const veiculos: Veiculo[] = veiculosData;

/**
 * Remove espaços, hífens e pontos e converte para maiúsculas.
 * Ex.: "abc-1234" -> "ABC1234"
 */
export function normalizarPlaca(input: string): string {
  return input.replace(/[\s.\-]/g, "").toUpperCase();
}

/**
 * Busca o veículo pela placa (comparação case-insensitive após normalização).
 * Retorna null quando não encontrada.
 */
export async function consultarPlaca(placa: string): Promise<Veiculo | null> {
  const alvo = normalizarPlaca(placa);
  if (!alvo) return null;

  const veiculo = veiculos.find((v) => normalizarPlaca(v.placa) === alvo);
  return veiculo ?? null;
}

/**
 * INTEGRAÇÃO COM BANCO DE DADOS (MySQL):
 *
 * Hoje os dados vêm de `src/data/veiculos.json` (201 registros). Para migrar
 * para o banco MySQL (tabela `caminhoes`: id, placa, nome_condutor,
 * municipio_uf), basta trocar a implementação de `consultarPlaca` acima por
 * uma consulta Prisma, sem alterar rotas nem UI:
 *
 *   import { PrismaClient } from "@prisma/client";
 *   const prisma = new PrismaClient();
 *
 *   export async function consultarPlaca(placa: string): Promise<Veiculo | null> {
 *     const alvo = normalizarPlaca(placa);
 *     return prisma.caminhao.findFirst({
 *       where: { placa: alvo }, // collations padrão do MySQL (_ci) já são case-insensitive
 *       select: { placa: true, nome_condutor: true, municipio_uf: true },
 *     });
 *   }
 *
 * Rotas (`app/api/placa/[placa]/route.ts`) e a interface consomem apenas
 * `consultarPlaca`/`normalizarPlaca`, portanto nada mais precisa mudar.
 */
