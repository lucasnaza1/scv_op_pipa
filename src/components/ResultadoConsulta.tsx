export type Veiculo = {
  placa: string;
  nome_condutor: string;
  municipio_uf: string;
};

export type ResultadoConsulta =
  | { status: "encontrado"; veiculo: Veiculo }
  | { status: "nao-encontrado"; placa: string }
  | { status: "erro" };

function IconeCheck({ className }: { className?: string }) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconeX({ className }: { className?: string }) {
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

function IconeAlerta({ className }: { className?: string }) {
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
      <path d="M12 9v4m0 4h.01" />
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    </svg>
  );
}

function CardEncontrado({ veiculo }: { veiculo: Veiculo }) {
  return (
    <article
      className="rounded-2xl border-2 border-emerald-700 bg-emerald-50 p-5 text-emerald-900 shadow-sm sm:p-6"
      aria-label="Veículo autorizado"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white">
          <IconeCheck className="h-6 w-6" />
        </span>
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-800">
          Veículo autorizado
        </p>
      </div>

      <p
        className="mt-4 font-mono text-3xl font-bold tracking-[0.2em] text-emerald-950"
        aria-label={`Placa ${veiculo.placa}`}
      >
        {veiculo.placa}
      </p>

      <dl className="mt-4 space-y-2 text-sm sm:text-base">
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Condutor
          </dt>
          <dd className="font-medium text-emerald-950">
            {veiculo.nome_condutor}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Município/UF
          </dt>
          <dd className="font-medium text-emerald-950">
            {veiculo.municipio_uf}
          </dd>
        </div>
      </dl>
    </article>
  );
}

function CardNaoEncontrado({ placa }: { placa: string }) {
  return (
    <article
      className="rounded-2xl border-2 border-red-700 bg-red-50 p-5 text-red-900 shadow-sm sm:p-6"
      aria-label="Veículo não autorizado"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-700 text-white">
          <IconeX className="h-6 w-6" />
        </span>
        <p className="text-sm font-bold uppercase tracking-wide text-red-800">
          Veículo não autorizado
        </p>
      </div>

      <p className="mt-4 text-lg font-bold uppercase text-red-950 sm:text-xl">
        Não consta na operação
      </p>

      {placa ? (
        <p
          className="mt-2 font-mono text-2xl font-bold tracking-[0.2em] text-red-900"
          aria-label={`Placa consultada ${placa}`}
        >
          {placa}
        </p>
      ) : null}

      <p className="mt-2 text-sm text-red-800 sm:text-base">
        A placa informada não foi localizada na base da Operação Pipa.
        Acione a supervisão para verificar o cadastro do veículo.
      </p>
    </article>
  );
}

function CardErro({ onTentarNovamente }: { onTentarNovamente: () => void }) {
  return (
    <article
      className="rounded-2xl border-2 border-amber-500 bg-amber-50 p-5 text-amber-900 shadow-sm sm:p-6"
      aria-label="Erro de conexão"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
          <IconeAlerta className="h-6 w-6" />
        </span>
        <p className="text-sm font-bold uppercase tracking-wide text-amber-800">
          Erro de conexão
        </p>
      </div>

      <p className="mt-4 text-base font-medium text-amber-950">
        Não foi possível concluir a consulta. Verifique sua internet e tente
        novamente.
      </p>

      <button
        type="button"
        onClick={onTentarNovamente}
        className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
      >
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
          <path d="M3 12a9 9 0 0 1 15.36-6.36L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15.36 6.36L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
        Tentar novamente
      </button>
    </article>
  );
}

export default function ResultadoConsultaView({
  resultado,
  onTentarNovamente,
}: {
  resultado: ResultadoConsulta;
  onTentarNovamente: () => void;
}) {
  if (resultado.status === "encontrado") {
    return <CardEncontrado veiculo={resultado.veiculo} />;
  }
  if (resultado.status === "nao-encontrado") {
    return <CardNaoEncontrado placa={resultado.placa} />;
  }
  return <CardErro onTentarNovamente={onTentarNovamente} />;
}
