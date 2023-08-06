'use client'
import { useStore } from '@/store'
import Chart, { Props } from 'react-apexcharts'

export function Bar() {
  const { family } = useStore()

  const dataApex: Props = {
    series: [
      {
        data: Object.values(family || {}),
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: Object.keys(family || {}),
      },
    },
  }

  return (
    <Chart options={dataApex.options} series={dataApex.series} type="bar" />
  )
}
