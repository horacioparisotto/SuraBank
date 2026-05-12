import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="bg-bg flex min-h-screen flex-col px-6 pt-14 pb-10">
      <header className="flex flex-col items-center gap-2 pt-6">
        <h1 className="font-display text-brand text-5xl font-extrabold tracking-tight">Surabank</h1>
        <p className="text-ink-muted text-base">Comienza a manejar tu vida financiera</p>
      </header>
      <div className="mt-12 flex-1">
        <LoginForm />
      </div>
    </main>
  );
}
