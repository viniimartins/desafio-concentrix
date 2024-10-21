import { Header } from '@/components/header'

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <section className="flex h-auto w-full">{children}</section>
    </main>
  )
}
