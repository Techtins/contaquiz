"use client";

import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/atoms/button";

export default function DebugSentryPage() {
  const throwError = () => {
    throw new Error("Teste Sentry Frontend - erro intencional do ContaQuiz");
  };

  const captureManual = () => {
    Sentry.captureException(new Error("Teste Sentry Frontend - captura manual"));
    alert("Erro enviado ao Sentry manualmente.");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Debug Sentry - Frontend
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Use os botoes abaixo para testar a integracao com o Sentry.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Button onClick={captureManual}>
          Enviar erro manual ao Sentry
        </Button>
        <Button variant="destructive" onClick={throwError}>
          Disparar erro nao tratado
        </Button>
      </div>
    </div>
  );
}
