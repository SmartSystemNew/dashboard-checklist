'use client'
import { CardStatus } from '@/components/CardStatus'
import { Bar } from '@/components/Charts/Bar'
import { Donut } from '@/components/Charts/Donut'
import { Form } from '@/components/Form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useStore } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText, ListFilter, SlidersHorizontal } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import Lottie from 'react-lottie'
import * as LoadingAnimation from '../../public/animation_ll9s3kr3.json'

const filterSchema = z.object({
  period: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .optional(),
  branch: z.array(z.string()).optional(),
  active: z.array(z.string()).optional(),
})

type FilterSchemaType = z.infer<typeof filterSchema>

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = true

export default function Home() {
  const {
    load,
    searchData,
    summaryCards,
    equipment,
    branch,
    fillEquipmentsByBranch,
  } = useStore()
  const branchOptions = branch?.length
    ? branch?.map(({ id, corporateName }) => ({
        value: String(id),
        label: corporateName,
      }))
    : []

  const filterForm = useForm<FilterSchemaType>({
    resolver: zodResolver(filterSchema),
  })
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = filterForm

  const allBranches = watch('branch')

  const equipmentOptions = equipment?.length
    ? equipment?.map(({ id, description, code }) => ({
        value: String(id),
        label: `${code} - ${description}`,
      }))
    : []

  async function handleFilter(data: FilterSchemaType) {
    await searchData(data)
  }

  useEffect(() => {
    fillEquipmentsByBranch(allBranches || [''])
  }, [allBranches])

  useEffect(() => {
    ;(async () => {
      await load()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex h-full w-full flex-col bg-zinc-50">
      <header className="flex w-full items-center justify-between gap-4 border-b border-zinc-200 bg-white p-5 py-5 sm:px-8 md:px-10">
        <div>
          <div className="flex items-center gap-2">
            <Image
              width={36}
              height={36}
              src="/icon.png"
              alt="checklist"
              className="h-9 w-9 rounded-md"
            />
            <h1 className="hidden bg-gradient-to-r from-violet-500 to-violet-600 bg-clip-text font-extrabold text-transparent sm:inline sm:text-lg md:text-2xl">
              Dashboard Checklist {process.env.API_URL}
            </h1>
          </div>
          <span className="hidden text-xs uppercase text-blue-800/40 sm:inline">
            por smartnew sistemas
          </span>
        </div>

        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="gap-3">
                <SlidersHorizontal className="h-4 w-4" color="#fff" />
                Filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <FormProvider {...filterForm}>
                <form
                  onSubmit={handleSubmit(handleFilter)}
                  className="flex flex-col gap-4"
                >
                  <Form.Field>
                    <Form.Label htmlFor="period">Período</Form.Label>
                    <Form.InputDateRange id="period" name="period" />
                  </Form.Field>

                  <Form.Field>
                    <Form.Label>Filial</Form.Label>
                    <Form.MultiSelect name="branch" options={branchOptions} />
                  </Form.Field>

                  <Form.Field>
                    <Form.Label>Ativo</Form.Label>
                    <Form.MultiSelect
                      name="active"
                      options={equipmentOptions}
                    />
                  </Form.Field>

                  <Button
                    className="gap-3"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <ListFilter className="h-4 w-4" color="#fff" />
                    Filtrar
                  </Button>
                </form>
              </FormProvider>
            </PopoverContent>
          </Popover>

          <Button variant="secondary">
            <FileText className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </header>

      {isSubmitting ? (
        <div className="flex flex-1 items-center justify-center bg-white">
          <div>
            <Lottie
              width={400}
              options={{
                loop: true,
                autoplay: true,
                animationData: LoadingAnimation,
                rendererSettings: {
                  preserveAspectRatio: 'xMidYMid slice',
                },
              }}
            />
          </div>
        </div>
      ) : (
        <main className="flex flex-1 flex-col gap-5 p-5">
          <div className="grid grid-cols-auto gap-4">
            {summaryCards?.map(({ color, description, icon, id, quantity }) => {
              return (
                <CardStatus
                  key={id}
                  icon={icon}
                  label={description}
                  quantity={quantity}
                  color={color}
                />
              )
            })}
          </div>

          <div className="grid grid-cols-auto gap-4">
            <Card>
              <CardContent>
                <Bar />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Donut />
              </CardContent>
            </Card>
          </div>
        </main>
      )}
    </div>
  )
}
