"use client";

import { useCallback, useRef, useState, type FormEvent } from "react";
import ResultadoConsultaView, {
  type ResultadoConsulta,
} from "@/components/ResultadoConsulta";

type StatusConsulta = "idle" | "loading";

const REGEX_PLACA = /^[A-Z]{3}\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/;

function validarPlaca(placa: string): string | null {
  if (placa.length === 0) {
    return "Digite uma placa para consultar.";
  }
  if (!REGEX_PLACA.test(placa)) {
    return "Formato inválido. Use o padrão antigo (AAA9999) ou Mercosul (AAA9A99).";
  }
  return null;
}

function SkeletonResultado() {
  return (
    <div
      className="animate-pulse rounded-2xl border-2 border-slate-200 bg-white p-5 sm:p-6"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-200" />
        <div className="h-4 w-40 rounded bg-slate-200" />
      </div>
      <div className="mt-5 h-8 w-48 rounded bg-slate-200" />
      <div className="mt-5 space-y-3">
        <div className="h-3.5 w-full rounded bg-slate-200" />
        <div className="h-3.5 w-2/3 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export default function Home() {
  const [placa, setPlaca] = useState("");
  const [erroFormato, setErroFormato] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusConsulta>("idle");
  const [resultado, setResultado] = useState<ResultadoConsulta | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const consultar = useCallback(async (placaConsulta: string) => {
    setStatus("loading");
    setResultado(null);
    try {
      const resposta = await fetch(
        `/api/placa/${encodeURIComponent(placaConsulta)}`
      );
      if (!resposta.ok) {
        throw new Error(`HTTP ${resposta.status}`);
      }
      const dados: { encontrado: boolean; veiculo?: { placa: string; nome_condutor: string; municipio_uf: string } } =
        await resposta.json();
      if (dados.encontrado && dados.veiculo) {
        setResultado({ status: "encontrado", veiculo: dados.veiculo });
      } else {
        setResultado({ status: "nao-encontrado", placa: placaConsulta });
      }
    } catch {
      setResultado({ status: "erro" });
    } finally {
      setStatus("idle");
    }
  }, []);

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const erro = validarPlaca(placa);
    setErroFormato(erro);
    if (erro) {
      setResultado(null);
      inputRef.current?.focus();
      return;
    }
    void consultar(placa);
  }

  function aoDigitar(valor: string) {
    const normalizada = valor
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 7);
    setPlaca(normalizada);
    if (erroFormato) setErroFormato(null);
  }

  const carregando = status === "loading";

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <header className="bg-[#0b3d2e] px-4 py-5 text-white shadow-md sm:py-6">
        <div className="mx-auto flex w-full max-w-xl items-center gap-4">
          <img
            src="/logo.jpeg"
            alt="Logotipo da Operação Pipa"
            width={56}
            height={56}
            className="h-14 w-14 rounded-xl border-2 border-white/20 object-cover sm:h-16 sm:w-16"
          />
          <div>
            <h1 className="text-xl font-bold leading-tight sm:text-2xl">
              Consulta de Placas
            </h1>
            <p className="text-sm text-emerald-100/90 sm:text-base">
              Operação Pipa
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8 sm:py-12">
        <section aria-label="Consulta de placa">
          <form onSubmit={aoEnviar} noValidate>
            <label
              htmlFor="campo-placa"
              className="block text-sm font-semibold text-slate-700"
            >
              Placa do veículo
            </label>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex-1">
                <input
                  ref={inputRef}
                  id="campo-placa"
                  type="text"
                  inputMode="text"
                  autoCapitalize="characters"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={7}
                  value={placa}
                  onChange={(e) => aoDigitar(e.target.value)}
                  placeholder="ABC1D23"
                  aria-label="Placa do veículo para consulta"
                  aria-invalid={erroFormato ? true : undefined}
                  aria-describedby={erroFormato ? "erro-formato" : undefined}
                  disabled={carregando}
                  className="h-14 w-full rounded-xl border-2 border-slate-300 bg-white px-4 font-mono text-2xl font-bold uppercase tracking-[0.25em] text-slate-900 placeholder:tracking-normal placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="inline-flex h-14 min-w-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0b3d2e] px-6 text-base font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {carregando ? (
                  <svg
                    className="h-6 w-6 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-90"
                      fill="currentColor"
                      d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                )}
                <span>{carregando ? "Consultando…" : "Consultar"}</span>
              </button>
            </div>

            {erroFormato ? (
              <p
                id="erro-formato"
                role="alert"
                className="mt-2 flex items-start gap-2 text-sm font-medium text-red-700"
              >
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4m0 4h.01" />
                </svg>
                {erroFormato}
              </p>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                Formatos aceitos: antigo (AAA9999) e Mercosul (AAA9A99).
              </p>
            )}
          </form>
        </section>

        <section
          aria-label="Resultado da consulta"
          aria-live="polite"
          aria-atomic="true"
          className="mt-8"
        >
          {carregando ? (
            <SkeletonResultado />
          ) : resultado ? (
            <ResultadoConsultaView
              resultado={resultado}
              onTentarNovamente={() => void consultar(placa)}
            />
          ) : (
            <p className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-500 sm:text-base">
              Informe a placa do veículo e toque em{" "}
              <span className="font-semibold text-slate-700">Consultar</span>{" "}
              para verificar a autorização na Operação Pipa.
            </p>
          )}
        </section>
      </main>

      <footer className="px-4 pb-6 text-center text-xs text-slate-500">
        <p>Operação Pipa — uso operacional interno.</p>
      </footer>
    </div>
  );
}
