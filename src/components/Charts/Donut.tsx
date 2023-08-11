'use client'
import { useStore } from '@/store'
import Chart, { Props } from 'react-apexcharts'

export const dynamic = 'force-dynamic'

export function Donut() {
  const { status } = useStore()

  const dataApex: Props = {
    series: Object.values(status || {}),
    options: {
      chart: {
        type: 'donut',
      },
      xaxis: {
        categories: Object.keys(status || {}),
      },
      legend: {
        customLegendItems: Object.keys(status || {}),
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  }

  return (
    <Chart options={dataApex.options} series={dataApex.series} type="donut" />
  )
}
