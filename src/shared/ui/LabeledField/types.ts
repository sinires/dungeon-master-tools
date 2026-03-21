import type { ReactNode } from 'react'

export interface LabeledFieldProps {
  label: string
  children: ReactNode
  className?: string
  labelClassName?: string
}
