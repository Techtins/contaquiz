import Link from "next/link"
import { Button } from "@/components/ui/atoms/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/atoms/card"
import { BookOpen, BarChart3, Trophy, Play, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">ContaQuiz</span>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Recursos
                </Link>
                <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sobre
                </Link>
                <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contato
                </Link>
                <Button variant="outline" size="sm">
                  Entrar
                </Button>
              </nav>
            </div>
          </div>
        </header>

        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6">
              Prepare-se para o <span className="text-primary">Exame de Suficiência</span> do CRC
            </h1>
            <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
              Plataforma completa de simulados para estudantes de Contabilidade. Pratique por área de conhecimento e
              acompanhe seu progresso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                <Play className="mr-2 h-5 w-5" />
                Começar Gratuitamente
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                Ver Demonstração
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Por que escolher o ContaQuiz?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Recursos desenvolvidos especificamente para sua aprovação no CRC
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Simulados por Área</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Pratique questões organizadas por área de conhecimento: Contabilidade Geral, Custos, Auditoria e
                    Perícia.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Relatórios Detalhados</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Acompanhe seu desempenho com dashboards completos e identifique pontos de melhoria em tempo real.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Histórico de Progresso</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Visualize sua evolução ao longo do tempo e mantenha a motivação com metas personalizadas.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Como Funciona</h2>
              <p className="text-xl text-muted-foreground">Três passos simples para começar sua preparação</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mx-auto mb-6 p-4 bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Escolha sua Área</h3>
                <p className="text-muted-foreground">
                  Selecione a disciplina que deseja praticar ou faça um simulado completo
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-6 p-4 bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Pratique</h3>
                <p className="text-muted-foreground">
                  Responda questões no formato do exame oficial com feedback imediato
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-6 p-4 bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Acompanhe</h3>
                <p className="text-muted-foreground">Veja seu progresso e identifique onde focar seus estudos</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">O que nossos alunos dizem</h2>
              <p className="text-xl text-muted-foreground">Histórias de sucesso de quem já passou no CRC</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-4">
                        O ContaQuiz foi fundamental para minha aprovação. Os simulados por área me ajudaram a identificar
                        exatamente onde precisava melhorar.
                      </p>
                      <div>
                        <p className="font-semibold">Maria Silva</p>
                        <p className="text-sm text-muted-foreground">Aprovada em 2024</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-4">
                        Os relatórios detalhados me mostraram minha evolução. Consegui focar nos pontos fracos e passar
                        de primeira!
                      </p>
                      <div>
                        <p className="font-semibold">João Santos</p>
                        <p className="text-sm text-muted-foreground">Aprovado em 2024</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="pt-8 pb-8">
                <h2 className="text-3xl font-bold mb-4">Comece sua preparação hoje mesmo</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Junte-se a milhares de estudantes que já confiam no ContaQuiz
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-lg px-8">
                    <Play className="mr-2 h-5 w-5" />
                    Começar Gratuitamente
                  </Button>
                  <Link href="/disciplinas">
                    <Button variant="outline" size="lg" className="text-lg px-8 w-full sm:w-auto bg-transparent">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Ver Disciplinas
                    </Button>
                  </Link>
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
