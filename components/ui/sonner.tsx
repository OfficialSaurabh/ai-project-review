"use client"

import { Toaster as Sonner } from "sonner"
import { useTheme } from "next-themes"
import { useEffect } from "react"

export const Toaster = () => {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    console.log("✅ SONNER TOASTER MOUNTED")
  }, [])

  return (
    <Sonner
      position="top-right"     // 👈 change position here
      theme="dark" 
      richColors
      closeButton
    />
  )
}
