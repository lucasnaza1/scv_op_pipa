"use client";

import { useCallback, useEffect, useState } from "react";

export type Veiculo = {
  placa: string;
  nome_condutor: string;
  municipio_uf: string;
  lote: string | null;
};

type Modo = "lote" | "municipio";

type Props = {
  aberto: boolean;
  onFechar: () => void;
};

function IconeMenu({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function IconeFechar({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function IconeCaminhao({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10h2" />
      <path d="M14 8h4l3 4v4h-2" />
      <circle cx="6.5" cy="16.5" r="2" />
      <circle cx="17.5" cy="16.5" r="2" />
      <path d="M8.5 16.5h7" />
    </svg>
  );
}

function SkeletonLista() {
  return (
    <div className="space-y-2" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-xl border-2 border-slate-200 bg-slate-100"
        />
      ))}
    </div>
  );
}

export default function MenuGaveta({ aberto, onFechar }: Props) {
  const [modo, setModo] = useState<Modo>("lote");
  const [lotes, setLotes] = useState<string[]>([]);
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [selecao, setSelecao] = useState<string>("");
  const [veiculos, setVeiculos] = useState<Veiculo[] | null>(null);
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Carrega opções dos filtros na primeira abertura.
  useEffect(() => {
    if (!aberto || lotes.length > 0 || municipios.length > 0) return;
    let cancelado = false;

    (async () => {
      try {
        const resposta = await fetch("/api/filtros");
        if (!resposta.ok) throw new Error();
        const dados: { lotes: string[]; municipios: string[] } =
          await resposta.json();
        if (!cancelado) {
          setLotes(dados.lotes);
          setMunicipios(dados.municipios);
        }
      } catch {
        if (!cancelado) setErro("Falha ao carregar filtros.");
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [aberto, lotes.length, municipios.length]);

  const buscarLista = useCallback(async (novoModo: Modo, valor: string) => {
    if (!valor) return;
    setCarregandoLista(true);
    setErro(null);
    try {
      const query =
        novoModo === "lote"
          ? `lote=${encodeURIComponent(valor)}`
          : `municipio=${encodeURIComponent(valor)}`;
      const resposta = await fetch(`/api/veiculos?${query}`);
      if (!resposta.ok) throw new Error();
      const dados: { veiculos: Veiculo[] } = await resposta.json();
      setVeiculos(dados.veiculos);
    } catch {
      setVeiculos([]);
      setErro("Falha ao carregar a lista de motoristas.");
    } finally {
      setCarregandoLista(false);
    }
  }, []);

  function trocarModo(novoModo: Modo) {
    if (novoModo === modo) return;
    setModo(novoModo);
    setSelecao("");
    setVeiculos(null);
    setErro(null);
  }

  const opcoes = modo === "lote" ? lotes : municipios;
  const opcoesCarregadas = opcoes.length > 0;

  return (
    <>
      {/* Escurece o fundo e fecha a gaveta ao tocar fora. */}
      {aberto ? (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onFechar}
          aria-hidden="true"
        />
      ) : null}

      <aside
        aria-label="Consulta por lote ou município"
        aria-hidden={!aberto}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          aberto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between bg-[#0b3d2e] px-4 py-4 text-white">
          <h2 className="text-lg font-bold">Motoristas</h2>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <IconeFechar className="h-6 w-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Alternador de modo */}
          <div
            role="tablist"
            aria-label="Modo de consulta"
            className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1"
          >
            {(["lote", "municipio"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={modo === m}
                onClick={() => trocarModo(m)}
                className={`min-h-11 rounded-lg px-3 text-sm font-semibold transition-colors ${
                  modo === m
                    ? "bg-[#0b3d2e] text-white shadow"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                {m === "lote" ? "Por lote" : "Por município"}
              </button>
            ))}
          </div>

          {/* Seletor */}
          {opcoesCarregadas || veiculos !== null || erro ? (
            <div className="mt-4">
              <label
                htmlFor="filtro-gaveta"
                className="block text-sm font-semibold text-slate-700"
              >
                {modo === "lote"
                  ? "Selecione o lote"
                  : "Selecione o município"}
              </label>
              <select
                id="filtro-gaveta"
                value={selecao}
                onChange={(e) => {
                  setSelecao(e.target.value);
                  setVeiculos(null);
                  void buscarLista(modo, e.target.value);
                }}
                className="mt-2 h-12 w-full rounded-xl border-2 border-slate-300 bg-white px-3 text-base font-medium text-slate-900 focus:border-emerald-700 focus:outline-none"
              >
                <option value="">
                  {opcoesCarregadas
                    ? "— escolha —"
                    : "Nenhuma opção disponível"}
                </option>
                {opcoes.map((opcao) => (
                  <option key={opcao} value={opcao}>
                    {opcao}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mt-4 h-12 animate-pulse rounded-xl border-2 border-slate-200 bg-slate-100" />
          )}

          {/* Resultado da listagem */}
          <div className="mt-4" aria-live="polite">
            {carregandoLista ? (
              <SkeletonLista />
            ) : erro ? (
              <p
                role="alert"
                className="rounded-xl border-2 border-amber-500 bg-amber-50 p-4 text-sm font-medium text-amber-900"
              >
                {erro}. Verifique sua conexão e tente novamente.
              </p>
            ) : veiculos === null ? null : veiculos.length === 0 ? (
              <p className="rounded-xl border-2 border-dashed border-slate-300 bg-white/60 p-4 text-center text-sm text-slate-500">
                Nenhum motorista encontrado para este filtro.
              </p>
            ) : (
              <>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {veiculos.length}{" "}
                  {veiculos.length === 1
                    ? "motorista"
                    : "motoristas"}
                </p>
                <ul className="space-y-2">
                  {veiculos.map((v) => (
                    <li
                      key={`${v.placa}-${v.nome_condutor}`}
                      className="flex items-start gap-3 rounded-xl border-2 border-slate-200 bg-white p-3"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0b3d2e]/10 text-[#0b3d2e]">
                        <IconeCaminhao className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-sm font-bold tracking-wider text-slate-900">
                          {v.placa}
                        </p>
                        <p className="truncate text-sm font-medium text-slate-800">
                          {v.nome_condutor}
                        </p>
                        <p className="text-xs text-slate-500">
                          {v.municipio_uf}
                          {v.lote ? ` — Lote ${v.lote}` : ""}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
