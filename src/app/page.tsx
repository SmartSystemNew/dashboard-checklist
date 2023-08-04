import { CardStatus } from '@/components/CardStatus'

export default function Home() {
  return (
    <div className="flex h-screen w-screen flex-col bg-zinc-50">
      <header className="flex w-full gap-4 border-b border-zinc-200 bg-white px-10 py-5">
        <div>
          <h1 className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-2xl font-extrabold text-transparent">
            Dashboard Checklist
          </h1>
          <span className="text-xs uppercase text-blue-800/40">
            por smartnew sistemas
          </span>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-5 p-5">
        <div className="grid grid-cols-auto gap-4">
          <CardStatus />
          <CardStatus />
          <CardStatus />
          <CardStatus />
        </div>
      </main>
    </div>
  )
}
