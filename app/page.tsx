"use client"

import { useEffect, useState } from "react"
import CodeEditor from "@/components/code-editor"
import { useSearchParams } from "next/navigation"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const [sharedCode, setSharedCode] = useState<{ code: string; language: string } | null>(null)

  useEffect(() => {
    // Check if there's shared code in the URL
    const data = searchParams.get("data")
    if (data) {
      try {
        const decodedData = JSON.parse(atob(data))
        if (decodedData.code && decodedData.language) {
          setSharedCode({
            code: decodeURIComponent(decodedData.code),
            language: decodedData.language,
          })
        }
      } catch (error) {
        console.error("Error parsing shared code:", error)
      }
    }
    setIsLoading(false)
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 flex flex-col">
        <CodeEditor initialCode={sharedCode?.code} initialLanguage={sharedCode?.language} />
      </div>
    </main>
  )
}

