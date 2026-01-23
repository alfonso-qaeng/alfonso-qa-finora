export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="flex min-h-screen items-center justify-center p-4">{children}</div>
    </div>
  );
}
