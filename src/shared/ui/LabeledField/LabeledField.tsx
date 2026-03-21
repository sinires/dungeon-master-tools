import { Typography } from 'antd'
import classNames from 'classnames'
import styles from './styles.module.scss'
import type { LabeledFieldProps } from './types.ts'

const { Text } = Typography

export const LabeledField = ({ label, children, className, labelClassName }: LabeledFieldProps) => {
  return (
    <div className={classNames(styles.field, className)}>
      <Text className={classNames(styles.label, labelClassName)}>{label}</Text>
      {children}
    </div>
  )
}
