import Link from "next/link"
import { ArrowLeft, BookOpen, KeyRound, Mail, MailCheck, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/atoms/card"
import { Button } from "@/components/ui/atoms/button"

const RECOVERY_EMAIL = "suporte@contaquiz.com"
const RECOVERY_SUBJECT = "Recuperacao de Senha"
const RECOVERY_BODY = "Ola,%0D%0A%0D%0APara recuperar meu acesso, envio abaixo os dados solicitados:%0D%0A%0D%0ANome completo:%0D%0AE-mail cadastrado:%0D%0A%0D%0AObrigado."

export default function ForgotPasswordPage() {
    const recoveryMailTo = `mailto:${RECOVERY_EMAIL}?subject=${encodeURIComponent(RECOVERY_SUBJECT)}&body=${RECOVERY_BODY}`

    return (
        <div className="min-h-screen px-4 py-10 md:px-6 md:py-14">
            <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="flex flex-col justify-between rounded-[32px] border border-white/60 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300/40">
                    <div>
                        <Link href="/" className="mb-10 inline-flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                                <BookOpen className="h-6 w-6 text-sky-300" />
                            </div>
                            <div>
                                <span className="block text-2xl font-bold">ContaQuiz</span>
                                <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Recuperacao de acesso</span>
                            </div>
                        </Link>

                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">US_03</p>
                        <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
                            A recuperacao de senha e feita exclusivamente por solicitacao manual via e-mail.
                        </h1>
                        <p className="text-lg text-slate-300">
                            O sistema nao envia senha automaticamente nem gera links de redefinicao. Toda comunicacao
                            acontece pelo endereco institucional configurado nos parametros gerais.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <MailCheck className="mb-3 h-5 w-5 text-sky-300" />
                            <p className="mb-1 font-semibold">Solicitacao manual</p>
                            <p className="text-sm text-slate-300">O usuario deve enviar seu nome completo e e-mail cadastrado.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <ShieldAlert className="mb-3 h-5 w-5 text-sky-300" />
                            <p className="mb-1 font-semibold">Sem redefinicao automatica</p>
                            <p className="text-sm text-slate-300">Nenhum estado do sistema e alterado nesta tela.</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    <Card className="w-full border-white/70 bg-white/88 shadow-2xl shadow-slate-200/60 backdrop-blur">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                <KeyRound className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-3xl">Esqueceu sua senha?</CardTitle>
                            <CardDescription>
                                Siga as instrucoes abaixo para solicitar a recuperacao do seu acesso.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="rounded-3xl border border-border bg-muted/45 p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">Instrucoes de recuperacao</p>
                                        <p className="text-sm text-muted-foreground">Envio feito fora do sistema, por e-mail.</p>
                                    </div>
                                </div>

                                <p className="text-sm leading-7 text-muted-foreground">
                                    Para recuperar o acesso, envie um e-mail com o assunto
                                    {" "}
                                    <strong>&quot;Recuperacao de Senha&quot;</strong>
                                    {" "}
                                    e informe seu nome completo e e-mail cadastrado para o endereco:
                                </p>

                                <div className="mt-4 rounded-2xl border border-dashed border-primary/25 bg-white px-4 py-4 text-center">
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">E-mail de recuperacao</p>
                                    <p className="mt-2 text-lg font-semibold text-primary">{RECOVERY_EMAIL}</p>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <Button asChild className="h-11 text-base font-medium">
                                    <a href={recoveryMailTo}>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Enviar E-mail
                                    </a>
                                </Button>
                                <Button asChild variant="outline" className="h-11 bg-transparent text-base">
                                    <Link href="/auth/login">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Voltar ao Login
                                    </Link>
                                </Button>
                            </div>

                            <p className="text-center text-xs leading-6 text-muted-foreground">
                                Assumido no front atual: o e-mail institucional fixo e
                                {" "}
                                <strong>{RECOVERY_EMAIL}</strong>
                                {" "}
                                ate a implementacao da US_06 de Parametros Gerais.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
