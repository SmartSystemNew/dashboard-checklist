import { XCircle } from 'lucide-react'

interface CardStatusProps {
  quantity: number
  label: string
}

export function CardStatus() {
  return (
    <div className="flex flex-col justify-between gap-6 rounded-2xl bg-red-500 p-4">
      <XCircle className="h-8 w-8 text-white" />

      <div className="flex flex-col">
        <strong className="text-3xl font-bold text-white">34</strong>
        <span className="text-lg capitalize text-white">Não conforme</span>
      </div>
    </div>
  )
}
