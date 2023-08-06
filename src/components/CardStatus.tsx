'use client'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import dynamic from 'next/dynamic'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface CardStatusProps {
  quantity: number
  label: string
  icon: keyof typeof dynamicIconImports
  className?: string
  children: ReactNode
}

export function CardStatus({
  quantity,
  label,
  icon,
  className,
  children,
}: CardStatusProps) {
  const Icon = dynamic(dynamicIconImports[icon])

  return (
    <div
      className={twMerge(
        'flex flex-col justify-between gap-6 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm',
        className,
      )}
    >
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-zinc-700" />
          <span className="text-lg capitalize text-zinc-700">{label}</span>
        </div>

        {children}
      </div>

      <div className="flex flex-col">
        <strong className="text-3xl font-bold text-zinc-600">{quantity}</strong>
      </div>
    </div>
  )
}
