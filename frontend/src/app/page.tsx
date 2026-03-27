import Link from "next/link"
import { Button } from "@/components/ui/atoms/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/atoms/card"
import { BookOpen, BarChart3, Trophy, Play, CheckCircle, ArrowRight, ShieldCheck, TimerReset, GraduationCap, FileQuestion, LayoutDashboard } from "lucide-react"

const productOverview = [
  {
    title: "Modulo do aluno",
    description: "Login, selecao de quiz, timer, resultado, historico e desempenho pessoal.",
    icon: GraduationCap,
  },
  {
    title: "Modulo administrativo",
    description: "Gestao de disciplinas, topicos, questoes, usuarios e relatorios.",
    icon: BarChart3,
  },
  {
    title: "Base classificavel",
    description: "Questoes organizadas por disciplina, tema, tipo e nivel de dificuldade.",
    icon: FileQuestion,
  },
]

export default function HomePage() {
  return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 border-b border-white/50 bg-white/70 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-xl font-bold text-foreground">ContaQuiz</span>
                  <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Preparacao CRC</span>
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="#modulos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Modulos
                </Link>
                <Link href="#recursos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Recursos
                </Link>
                <Link href="#gestao" className="text-muted-foreground hover:text-foreground transition-colors">
                  Gestao
                </Link>
                <Button asChild variant="outline" size="sm" className="bg-white/80">
                  <Link href="/auth/login">Entrar</Link>
                </Button>
              </nav>
            </div>
          </div>
        </header>

        <section className="px-4 pb-16 pt-14 md:pb-24 md:pt-20">
          <div className="container mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Produto estruturado a partir do escopo do Exame de Suficiencia do CRC
              </div>
              <h1 className="mb-6 max-w-3xl text-5xl font-bold leading-tight text-balance md:text-6xl">
                Uma plataforma de quiz com foco real em
                {" "}
                <span className="text-primary">aprovacao, desempenho e gestao</span>
                {" "}
                academica.
              </h1>
              <p className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
                O ContaQuiz centraliza simulados por disciplina, tema e dificuldade, com correção automática,
                histórico de tentativas e um painel administrativo para manter toda a base de conteúdos.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="text-base shadow-lg shadow-primary/20">
                  <Link href="/auth/login">
                    <Play className="mr-2 h-5 w-5" />
                    Acessar plataforma
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white/80 text-base">
                  <Link href="/admin">
                    Ver painel administrativo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ["Quiz por disciplina", "Monte simulados por area, tema e dificuldade."],
                  ["Correcao automatica", "Resultado imediato com gabarito e justificativa."],
                  ["Acompanhamento", "Graficos e historico para orientar o estudo."],
                ].map(([title, description]) => (
                  <div key={title} className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur">
                    <p className="mb-2 text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="overflow-hidden border-white/70 bg-white/80 shadow-2xl shadow-slate-200/60 backdrop-blur">
              <CardHeader className="border-b border-border/70 bg-slate-950 px-6 py-5 text-white">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <LayoutDashboard className="h-5 w-5 text-sky-300" />
                  Visao do produto
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Estrutura organizada para aluno e administrador dentro do mesmo ecossistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <div className="grid gap-4">
                  {productOverview.map(({ title, description, icon: Icon }) => (
                    <div key={title} className="flex gap-4 rounded-2xl border border-border/70 bg-muted/40 p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3 rounded-2xl bg-slate-950 p-4 text-white">
                  <div>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">eixos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">responsivo</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">CRC</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">foco total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="modulos" className="px-4 py-16">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-primary">Escopo aplicado</p>
                <h2 className="text-4xl font-bold">Modulos pensados para operacao e aprendizado</h2>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                A estrutura visual agora deixa claro o papel do aluno na preparação e o papel do administrador na curadoria do conteúdo.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-white/70 bg-white/80 shadow-lg shadow-slate-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    Modulo do aluno
                  </CardTitle>
                  <CardDescription>
                    Fluxo de estudo com montagem de quizzes, correção automatica e leitura de desempenho.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {[
                    "Login por e-mail e senha",
                    "Quiz aleatorio, por disciplina, tema ou dificuldade",
                    "Simulado completo com tempo regressivo",
                    "Resultado com percentual, gabarito e explicacao",
                    "Favoritos e revisao futura",
                    "Historico e graficos de evolucao",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl bg-muted/55 p-4">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card id="gestao" className="border-white/70 bg-slate-950 text-white shadow-lg shadow-slate-300/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <BarChart3 className="h-6 w-6 text-sky-300" />
                    Modulo administrativo
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Painel de operacao com foco em organização de base, relatórios e controle da plataforma.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {[
                    "Cadastro e classificacao de questoes",
                    "Gestao de disciplinas, temas e subtemas",
                    "Niveis de dificuldade e configuracoes do sistema",
                    "Usuarios, perfis e permissoes",
                    "Dashboards por disciplina, tema e nivel",
                    "Relatorios exportaveis em futuras iteracoes",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100">
                      {item}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="recursos" className="bg-white/60 px-4 py-16">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold">Recursos centrais do MVP</h2>
              <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                O visual foi reorganizado para comunicar claramente o que faz parte da primeira entrega do produto.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-white/70 bg-white/85 shadow-lg shadow-slate-200/40">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-fit rounded-2xl bg-primary/10 p-3">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Simulados por Área</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Questões organizadas por Contabilidade Geral, Custos, Auditoria, Legislacao, Etica e outros eixos do exame.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-white/70 bg-white/85 shadow-lg shadow-slate-200/40">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-fit rounded-2xl bg-primary/10 p-3">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Relatórios Detalhados</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Painéis com média de acertos, evolução por disciplina e leitura rápida dos pontos que precisam de reforço.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-white/70 bg-white/85 shadow-lg shadow-slate-200/40">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-fit rounded-2xl bg-primary/10 p-3">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Histórico de Progresso</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Comparacao entre tentativas, filtros por tipo de quiz e leitura do tempo gasto em cada sessao.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="px-4 py-16">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <h2 className="mb-4 text-4xl font-bold">Como a jornada funciona</h2>
              <p className="text-xl text-muted-foreground">Do estudo orientado ate a leitura clara do desempenho</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
                  1
                </div>
                <h3 className="mb-3 text-xl font-semibold">Escolha o formato</h3>
                <p className="text-muted-foreground">
                  O aluno define disciplina, tema, dificuldade ou parte para um simulado completo com tempo configurado.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
                  2
                </div>
                <h3 className="mb-3 text-xl font-semibold">Resolva com contexto</h3>
                <p className="text-muted-foreground">
                  A experiencia considera navegacao entre questoes, tempo regressivo e correcao automatica ao finalizar.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
                  3
                </div>
                <h3 className="mb-3 text-xl font-semibold">Ajuste sua preparacao</h3>
                <p className="text-muted-foreground">Os resultados mostram acertos, erros, tempo total e as areas onde vale reforcar o estudo.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-4 py-16 text-white">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold">Foco no que realmente importa</h2>
              <p className="text-xl text-slate-300">O produto foi reposicionado para mostrar valor academico e operacional.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-white/10 bg-white/5 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-emerald-500/10 p-2">
                      <TimerReset className="h-5 w-5 text-emerald-300" />
                    </div>
                    <div>
                      <p className="mb-4 text-slate-300">
                        A plataforma agora comunica melhor a jornada de estudo: montar quiz, responder, corrigir e analisar desempenho.
                      </p>
                      <div>
                        <p className="font-semibold">Fluxo do aluno</p>
                        <p className="text-sm text-slate-400">Mais claro, direto e alinhado ao escopo</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-sky-500/10 p-2">
                      <BarChart3 className="h-5 w-5 text-sky-300" />
                    </div>
                    <div>
                      <p className="mb-4 text-slate-300">
                        O painel administrativo ganhou um direcionamento mais executivo, com atalhos, indicadores e melhor leitura das áreas de gestão.
                      </p>
                      <div>
                        <p className="font-semibold">Fluxo administrativo</p>
                        <p className="text-sm text-slate-400">Mais profissional para demonstracao e uso interno</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="px-4 py-16">
          <div className="container mx-auto max-w-3xl text-center">
            <Card className="border-white/70 bg-white/80 shadow-2xl shadow-slate-200/50">
              <CardContent className="pt-8 pb-8">
                <h2 className="mb-4 text-3xl font-bold">Uma base visual mais forte para apresentar o ContaQuiz</h2>
                <p className="mb-8 text-xl text-muted-foreground">
                  A estrutura agora conversa com o PDF de escopo e deixa a plataforma pronta para evoluir com os modulos de aluno e administrador.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button asChild size="lg" className="text-lg px-8">
                    <Link href="/auth/login">
                      <Play className="mr-2 h-5 w-5" />
                      Entrar no sistema
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full bg-transparent text-lg sm:w-auto">
                    <Link href="/admin/topicos">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Ver gestao de topicos
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <footer className="border-t border-border bg-muted/30 py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">ContaQuiz</span>
                </div>
                <p className="text-muted-foreground">Sua plataforma de preparação para o Exame de Suficiência do CRC.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Recursos</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link href="#" className="hover:text-foreground transition-colors">
                      Simulados
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground transition-colors">
                      Relatórios
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground transition-colors">
                      Histórico
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Suporte</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link href="#" className="hover:text-foreground transition-colors">
                      Central de Ajuda
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground transition-colors">
                      Contato
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground transition-colors">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link href="#" className="hover:text-foreground transition-colors">
                      Termos de Uso
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground transition-colors">
                      Privacidade
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
              <p>&copy; 2024 ContaQuiz. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
  )
}
