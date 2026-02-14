import React from "react"
import s from "@styles/layouts/seller/sellerLayout.module.scss"
import { Field, FieldDescription } from "@components/ui/NebulaUI"

type Props = {
  children: React.ReactNode
}

type SellerTableHeadProps = {
  columns: { title: string; width?: string }[]
}


export function SellerLayout({ children }: Props) {
  return (
    <Field className={s.sellerLayout}>
      {children}
    </Field>
  )
}

export function SellerHeader({ children }: Props) {
  return (
    <Field className={s.sellerHeader}>
      <h2>{children}</h2>
    </Field>
  )
}

export function SellerContent({ children }: Props) {
  return (
    <Field className={s.sellerToolbar}>
      {children}
    </Field>
  )
}

export function SellerToolbarRow({ children }: Props) {
  return (
    <Field orientation={'horizontal'} className={s.sellerToolbarRow}>
      {children}
    </Field>
  )
}

export function SellerPanel({ children }: Props) {
  return (
    <Field className={s.sellerPanel}>
      {children}
    </Field>
  )
}

export function SellerPanelHeader({ children }: Props) {
  return (
    <Field className={s.sellerPanelHeader}>
      {children}
    </Field>
  )
}