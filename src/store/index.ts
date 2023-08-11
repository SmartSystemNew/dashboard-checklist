import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { create } from 'zustand'

interface StoreState {
  summaryCards: Array<{
    id: number
    description: string
    icon: keyof typeof dynamicIconImports
    color: string
    quantity: number
  }> | null

  family: {
    [key: string]: number
  } | null

  status: {
    [key: string]: number
  } | null

  load: () => Promise<void>
  searchData: (data: {
    period?:
      | {
          from: Date
          to: Date
        }
      | undefined
    branch?: Array<string> | undefined
    active?: Array<string> | undefined
  }) => Promise<void>
}

export const useStore = create<StoreState>((set) => {
  return {
    summaryCards: null,
    family: null,
    status: null,

    load: async () => {
      const response: StoreState['summaryCards'] = Array.from({
        length: 4,
      }).map((_, i) => ({
        id: i,
        description: 'conforme',
        icon: 'x-circle',
        color: '#ef4444',
        quantity: Math.round(Math.random() * 10000),
      }))

      set({
        summaryCards: response,
        family: Object.fromEntries(
          Array.from({ length: 25 }).map((_, i) => [
            `CB-${i + 1}`,
            Math.round(Math.random() * 100),
          ]),
        ),
        status: {
          Vencida: 15,
          'Em andamento': 25,
          Concluido: 67,
          Cancelado: 32,
        },
      })
    },
    searchData: async (data) => {
      console.log(data)
    },
  }
})
