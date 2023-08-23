import { api } from '@/lib/api'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { create } from 'zustand'
import CryptoJS from 'crypto-js'

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

  branch: Array<{
    id: number
    corporateName: string
    fantasyName: string
  }> | null

  equipment: Array<{
    id: number
    code: string
    description: string
    familyId: number
    branchId: number
  }> | null

  allEquipment: Array<{
    id: number
    code: string
    description: string
    familyId: number
    branchId: number
  }> | null

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
  fillEquipmentsByBranch: (branchIds: Array<string>) => void
}

export const useStore = create<StoreState>((set, get) => {
  return {
    summaryCards: null,
    family: null,
    status: null,
    branch: null,
    equipment: null,
    allEquipment: null,

    load: async () => {
      const searchParams = new URLSearchParams(window.location.search)
      console.log(searchParams.get('u'))

      if (!searchParams.has('u')) return
      const login = CryptoJS.AES.decrypt(
        searchParams.get('u') || '',
        'checklist-km034hq3',
      ).toString(CryptoJS.enc.Utf8)

      const [branch, equipment]: [
        branch: StoreState['branch'],
        equipment: StoreState['equipment'],
      ] = await Promise.all([
        await api
          .get('/public/branch/byLogin', {
            params: {
              login,
            },
          })
          .then((res) => res.data),
        await api
          .get('/public/equipment/byLogin', {
            params: {
              login,
            },
          })
          .then((res) => res.data),
      ])

      set({
        allEquipment: equipment,
        branch,
      })
    },
    searchData: async (data) => {
      const searchParams = new URLSearchParams(window.location.search)

      if (!searchParams.has('u')) return
      const login = CryptoJS.AES.decrypt(
        searchParams.get('u') || '',
        'checklist-km034hq3',
      ).toString(CryptoJS.enc.Utf8)

      const response = await api
        .get('public/checkList/dashForFilter', {
          params: {
            login,
            startDate: data.period?.from,
            endDate: data.period?.to,
            branch: data.branch?.join(','),
            equipment: data.active?.join(','),
          },
        })
        .then((res) => res.data)

      const equipments = Object.fromEntries(
        response.family.map((equipment: { name: string; quantity: string }) => {
          return [equipment.name, equipment.quantity]
        }),
      )

      const status = Object.fromEntries(
        response.status.reduce((acc: string[], item: any) => {
          return [...acc, ...Object.entries(item)]
        }, []),
      )

      set({
        status,
        family: equipments,
        summaryCards: response.summaryCards,
      })
    },
    fillEquipmentsByBranch: async (equipmentsIds) => {
      const allEquipments = get().allEquipment
      const equipmentsFiltered = allEquipments?.filter(({ branchId }) =>
        equipmentsIds.includes(String(branchId)),
      )

      set({ equipment: equipmentsFiltered })
    },
  }
})
