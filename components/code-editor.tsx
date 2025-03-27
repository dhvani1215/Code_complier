"use client"

import { useState, useRef, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Maximize2, Share2, Moon, Sun, AlertCircle, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { languageOptions } from "@/lib/language-options"
import { executeCode } from "@/lib/execute-code"
import { getAiSuggestion } from "@/lib/ai-suggestions"
import LanguageSidebar from "./language-sidebar"
import OutputWindow from "./output-window"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface CodeEditorProps {
  initialCode?: string
  initialLanguage?: string
}

export default function CodeEditor({ initialCode, initialLanguage }: CodeEditorProps) {
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0])
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const editorRef = useRef<any>(null)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isAiHelping, setIsAiHelping] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareableLink, setShareableLink] = useState("")
  const shareLinkRef = useRef<HTMLInputElement>(null)
  const [currentTheme, setCurrentTheme] = useState<string>("light")

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update current theme when resolvedTheme changes
  useEffect(() => {
    if (mounted && resolvedTheme) {
      setCurrentTheme(resolvedTheme)
    }
  }, [resolvedTheme, mounted])

  useEffect(() => {
    // If initialLanguage is provided, find the corresponding language option
    if (initialLanguage) {
      const language = languageOptions.find((lang) => lang.id === initialLanguage)
      if (language) {
        setSelectedLanguage(language)
      }
    }

    // If initialCode is provided, use it instead of the default code
    if (initialCode) {
      setCode(initialCode)
    } else {
      setCode(selectedLanguage.defaultCode)
    }
  }, [initialCode, initialLanguage, selectedLanguage.defaultCode])

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const handleLanguageChange = (language: any) => {
    setSelectedLanguage(language)
    if (!initialCode) {
      setCode(language.defaultCode)
    }
  }

  const handleRunCode = async () => {
    setIsProcessing(true)
    setError(null)
    setOutput("")

    try {
      const result = await executeCode(code, selectedLanguage.id)
      setOutput(result.output)
      if (result.error) {
        setError(result.error)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while executing the code")
    } finally {
      setIsProcessing(false)
    }
  }

  const generateShareableLink = () => {
    // Create a shareable link with the code and language
    const shareableData = {
      language: selectedLanguage.id,
      code: encodeURIComponent(code),
    }
    return `${window.location.origin}?data=${btoa(JSON.stringify(shareableData))}`
  }

  const handleShareCode = () => {
    const link = generateShareableLink()
    setShareableLink(link)
    setShareDialogOpen(true)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${selectedLanguage.name} Code Snippet`,
          text: `Check out this ${selectedLanguage.name} code snippet!`,
          url: shareableLink,
        })
        setShareDialogOpen(false)
      } catch (error) {
        console.error("Error sharing:", error)
      }
    }
  }

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Check out this ${selectedLanguage.name} code snippet: ${shareableLink}`)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleCopyShareLink = () => {
    if (shareLinkRef.current) {
      shareLinkRef.current.select()
      navigator.clipboard.writeText(shareableLink)
      toast({
        title: "Link copied to clipboard",
        duration: 2000,
      })
    }
  }

  const handleAiSuggestion = async () => {
    if (!code.trim()) return

    setIsAiHelping(true)
    try {
      const suggestion = await getAiSuggestion(code, selectedLanguage.id, error)
      setOutput(suggestion)
    } catch (err: any) {
      setError(err.message || "Failed to get AI suggestions")
    } finally {
      setIsAiHelping(false)
    }
  }

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      // Enter fullscreen
      const element = document.documentElement
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if ((element as any).mozRequestFullScreen) {
        ;(element as any).mozRequestFullScreen()
      } else if ((element as any).webkitRequestFullscreen) {
        ;(element as any).webkitRequestFullscreen()
      } else if ((element as any).msRequestFullscreen) {
        ;(element as any).msRequestFullscreen()
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        ;(document as any).mozCancelFullScreen()
      } else if ((document as any).webkitExitFullscreen) {
        ;(document as any).webkitExitFullscreen()
      } else if ((document as any).msExitFullscreen) {
        ;(document as any).msExitFullscreen()
      }
    }
    setIsFullScreen(!isFullScreen)
  }

  const toggleTheme = () => {
    // Use the next-themes setTheme function to toggle the theme
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    // Update local state for immediate UI feedback
    setCurrentTheme(newTheme)
  }

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
    }
  }, [])

  // If not mounted yet, don't render theme-dependent UI
  if (!mounted) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className={cn("flex flex-col h-screen", isFullScreen && "fixed inset-0 z-50 bg-background")}>
      <div className="flex h-full">
        <LanguageSidebar selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} />

        <div className="flex-1 flex flex-col">
          <div className="border-b flex items-center justify-between p-2">
            <div className="flex items-center">
              <span className="text-sm font-medium px-2">{selectedLanguage.fileName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleTheme} className="relative">
                      {currentTheme === "dark" ? (
                        <Sun size={18} className="transition-all" />
                      ) : (
                        <Moon size={18} className="transition-all" />
                      )}
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Switch to {currentTheme === "dark" ? "light" : "dark"} mode</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
                      <Maximize2 size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleShareCode}>
                      <Share2 size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share code</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                onClick={handleRunCode}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? "Running..." : "Run"}
              </Button>
            </div>
          </div>

          <div className="flex-1 flex">
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage={selectedLanguage.monaco}
                language={selectedLanguage.monaco}
                value={code}
                onChange={(value) => setCode(value || "")}
                theme={currentTheme === "dark" ? "vs-dark" : "light"}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                }}
              />
            </div>

            <div className="w-1/2 border-l flex flex-col">
              <div className="border-b flex items-center justify-between p-2">
                <span className="font-medium">Output</span>
                <Button variant="ghost" size="sm" onClick={() => setOutput("")}>
                  Clear
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                <OutputWindow output={output} error={error} />

                {error && (
                  <div className="mt-4">
                    <Button
                      onClick={handleAiSuggestion}
                      disabled={isAiHelping}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <AlertCircle size={16} />
                      {isAiHelping ? "Getting AI help..." : "Get AI help with this error"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Code</DialogTitle>
            <DialogDescription>Share your code via link or social media</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <Input ref={shareLinkRef} value={shareableLink} readOnly className="flex-1" />
            <Button size="icon" variant="outline" onClick={handleCopyShareLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col space-y-3 mt-4">
            {navigator.share && (
              <Button onClick={handleNativeShare} className="w-full">
                Share via device options
              </Button>
            )}
            <Button onClick={handleShareWhatsApp} className="w-full bg-green-600 hover:bg-green-700">
              Share via WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

