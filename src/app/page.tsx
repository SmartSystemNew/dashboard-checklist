'use client'
import { CardStatus } from '@/components/CardStatus'
import { FileText, ListFilter, SlidersHorizontal } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Card, CardContent } from '@/components/ui/card'
import { Bar } from '@/components/Charts/Bar'
import { Donut } from '@/components/Charts/Donut'
import { useForm, FormProvider } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/Form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useStore } from '@/store'
import { useEffect } from 'react'
import Image from 'next/image'

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

export default function Home() {
  const { load, searchData, summaryCards } = useStore()
  const filterForm = useForm<FilterSchemaType>({
    resolver: zodResolver(filterSchema),
  })
  const { handleSubmit } = filterForm

  async function handleFilter(data: FilterSchemaType) {
    searchData(data)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex w-full flex-col bg-zinc-50">
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
              Dashboard Checklist
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
                    <Form.MultiSelect
                      name="branch"
                      options={[
                        { label: 'Goiania', value: '1' },
                        { label: 'Inhumas', value: '2' },
                        { label: 'Jardins', value: '3' },
                        { label: 'Goianira', value: '4' },
                        { label: 'Goianesia', value: '5' },
                      ]}
                    />
                  </Form.Field>

                  <Form.Field>
                    <Form.Label>Ativo</Form.Label>
                    <Form.MultiSelect
                      name="active"
                      options={[
                        { label: 'Sim', value: '1' },
                        { label: 'Não', value: '2' },
                      ]}
                    />
                  </Form.Field>

                  <Button className="gap-3" type="submit">
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

      <main className="flex flex-1 flex-col gap-5 p-5">
        <div className="grid grid-cols-auto gap-4">
          {summaryCards?.map(({ color, description, icon, id, quantity }) => {
            return (
              <CardStatus
                key={id}
                icon={icon}
                label={description}
                quantity={quantity}
              >
                <span className={`h-6 w-6 rounded-full bg-[${color}]`} />
              </CardStatus>
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
    </div>
  )
}
