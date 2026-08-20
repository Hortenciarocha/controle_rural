import type { ReactNode } from 'react'
import {
  Sprout,
  BarChart3,
  ShieldCheck,
  Leaf,
} from 'lucide-react'

export function AuthShell({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string
  subtitulo: string
  children: ReactNode
}) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f7f4ec] px-4 py-8 sm:px-6 lg:px-8">

      {/* Decoração do fundo */}
      <div className="pointer-events-none absolute -left-32 bottom-[-180px] h-[420px] w-[650px] rounded-[50%] bg-[#dfe8d4]" />
      <div className="pointer-events-none absolute -right-40 bottom-[-200px] h-[440px] w-[750px] rounded-[50%] bg-[#cbd9ba]" />

      <div className="relative z-10 flex min-h-[calc(100dvh-4rem)] items-center justify-center">

        {/* CARD PRINCIPAL */}
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-[#e2e5dc] bg-white shadow-2xl shadow-neutral-900/10 md:grid-cols-[0.85fr_1.15fr]">

          {/* ================= ESQUERDA ================= */}
          <div className="relative hidden min-h-[620px] overflow-hidden bg-[#f2f5eb] p-10 md:flex md:flex-col">

            {/* Logo */}
            <div>
              <div className="flex items-center gap-3 text-[#286523]">
                <Sprout size={32} strokeWidth={2.2} />

                <span className="font-display text-2xl font-bold tracking-wide">
                  CONTROLE RURAL
                </span>
              </div>

              <p className="mt-3 max-w-xs text-base leading-6 text-neutral-600">
                Gestão simples, prática e eficiente para o campo.
              </p>
            </div>

            {/* BENEFÍCIOS */}
            <div className="mt-12 space-y-7">

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e1ead7] text-[#2d6b28]">
                  <Leaf size={23} />
                </div>

                <div>
                  <h3 className="font-semibold text-[#286523]">
                    Organize
                  </h3>

                  <p className="mt-1 max-w-[220px] text-sm leading-5 text-neutral-600">
                    Todas as informações da sua propriedade em um só lugar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e1ead7] text-[#2d6b28]">
                  <BarChart3 size={23} />
                </div>

                <div>
                  <h3 className="font-semibold text-[#286523]">
                    Acompanhe
                  </h3>

                  <p className="mt-1 max-w-[220px] text-sm leading-5 text-neutral-600">
                    Resultados, atividades e produção de forma clara e rápida.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e1ead7] text-[#2d6b28]">
                  <ShieldCheck size={23} />
                </div>

                <div>
                  <h3 className="font-semibold text-[#286523]">
                    Tenha controle
                  </h3>

                  <p className="mt-1 max-w-[220px] text-sm leading-5 text-neutral-600">
                    Mais segurança e eficiência nas decisões do dia a dia.
                  </p>
                </div>
              </div>

            </div>

            {/* CAMPO DECORATIVO */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden">

              <div className="absolute -bottom-24 -left-16 h-44 w-[120%] rounded-[50%] bg-[#dce8cd]" />

              <div className="absolute -bottom-28 left-[-80px] h-44 w-[130%] rounded-[50%] bg-[#c7d9b3]" />

              <div className="absolute bottom-7 left-10 text-[#73975f] opacity-80">
                <Sprout size={45} strokeWidth={1.5} />
              </div>

              <div className="absolute bottom-10 right-14 text-[#73975f] opacity-60">
                <Sprout size={34} strokeWidth={1.5} />
              </div>

            </div>
          </div>

          {/* ================= DIREITA ================= */}
          <div className="flex min-h-[620px] items-center justify-center bg-white px-6 py-12 sm:px-12">

            <div className="w-full max-w-md">

              {/* Ícone superior */}
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#edf2e7] text-[#286523]">
                  <Sprout size={34} strokeWidth={2} />
                </div>
              </div>

              {/* Título */}
              <div className="mb-8 text-center">
                <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900">
                  {titulo === 'Entrar' ? 'Bem-vindo de volta!' : titulo}
                </h1>

                <p className="mt-2 text-sm text-neutral-500">
                  {subtitulo}
                </p>
              </div>

              {/* FORMULÁRIO ORIGINAL */}
              {children}

            </div>
          </div>

        </div>
      </div>

      {/* Rodapé */}
      <div className="relative z-10 mt-4 flex items-center justify-center gap-2 text-xs text-neutral-500">
        <Sprout size={14} />
        <span>© 2026 Controle Rural. Todos os direitos reservados.</span>
      </div>

    </div>
  )
}