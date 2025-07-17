"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, User, Calendar, Copy, CheckCircle, ArrowLeft, Edit3, Save, FileDown } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface SharedContent {
  id: string
  content: string
  userName: string
  createdAt: string
  wordCount: number
  charCount: number
}

export default function SharedContentPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [sharedContent, setSharedContent] = useState<SharedContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    const loadSharedContent = () => {
      try {
        // First, try to get data from URL parameters (most reliable)
        const urlData = searchParams.get("data")
        if (urlData) {
          try {
            const decodedData = JSON.parse(decodeURIComponent(urlData))
            setSharedContent(decodedData)
            setEditedContent(decodedData.content)
            setLoading(false)
            return
          } catch (urlError) {
            console.warn("Failed to parse URL data:", urlError)
          }
        }

        // Fallback to localStorage
        const stored = localStorage.getItem(`shared_${params.id}`)
        if (stored) {
          const data = JSON.parse(stored)
          setSharedContent(data)
          setEditedContent(data.content)
          setLoading(false)
          return
        }

        // Fallback to sessionStorage
        const sessionStored = sessionStorage.getItem(`shared_${params.id}`)
        if (sessionStored) {
          const data = JSON.parse(sessionStored)
          setSharedContent(data)
          setEditedContent(data.content)
          setLoading(false)
          return
        }

        // If no data found, show error
        setLoading(false)
      } catch (error) {
        console.error("Error loading shared content:", error)
        setLoading(false)
      }
    }

    if (params.id) {
      loadSharedContent()
    }
  }, [params.id, searchParams])

  const generatePDF = async () => {
    if (!sharedContent) return

    setIsGeneratingPDF(true)
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import("jspdf")

      // Create new PDF document
      const doc = new jsPDF()

      // Set up document properties
      doc.setProperties({
        title: `CrossSync Content - ${sharedContent.userName}`,
        subject: "Content shared via CrossSync",
        author: sharedContent.userName,
        creator: "CrossSync",
      })

      // Add header
      doc.setFontSize(20)
      doc.setTextColor(59, 130, 246) // Blue color
      doc.text("CrossSync", 20, 25)

      doc.setFontSize(12)
      doc.setTextColor(107, 114, 128) // Gray color
      doc.text("Beautiful cross-platform content sharing", 20, 35)

      // Add separator line
      doc.setDrawColor(229, 231, 235) // Light gray
      doc.line(20, 40, 190, 40)

      // Add content info
      doc.setFontSize(10)
      doc.setTextColor(75, 85, 99) // Dark gray
      doc.text(`Author: ${sharedContent.userName}`, 20, 50)
      doc.text(`Created: ${new Date(sharedContent.createdAt).toLocaleDateString()}`, 20, 55)
      doc.text(`Words: ${sharedContent.wordCount} | Characters: ${sharedContent.charCount}`, 20, 60)

      // Add another separator
      doc.line(20, 65, 190, 65)

      // Add content
      doc.setFontSize(12)
      doc.setTextColor(31, 41, 55) // Dark text

      // Convert HTML to plain text and handle formatting
      const textContent = (isEditing ? editedContent : sharedContent.content)
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<p[^>]*>/gi, "")
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "$1")
        .replace(/<b[^>]*>(.*?)<\/b>/gi, "$1")
        .replace(/<em[^>]*>(.*?)<\/em>/gi, "$1")
        .replace(/<i[^>]*>(.*?)<\/i>/gi, "$1")
        .replace(/<u[^>]*>(.*?)<\/u>/gi, "$1")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .trim()

      // Split text into lines that fit the page width
      const pageWidth = 170 // Available width for text
      const lines = doc.splitTextToSize(textContent, pageWidth)

      // Add content with proper pagination
      let yPosition = 75
      const lineHeight = 6
      const pageHeight = 280 // Available height for content

      for (let i = 0; i < lines.length; i++) {
        if (yPosition > pageHeight) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(lines[i], 20, yPosition)
        yPosition += lineHeight
      }

      // Add footer on last page
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(156, 163, 175) // Light gray
        doc.text(`Generated by CrossSync - Page ${i} of ${pageCount}`, 20, 290)
        doc.text(`${window.location.origin}`, 150, 290)
      }

      // Generate filename
      const timestamp = new Date().toISOString().slice(0, 10)
      const filename = `CrossSync_${sharedContent.userName}_${timestamp}.pdf`

      // Save the PDF
      doc.save(filename)

      toast({
        title: "PDF Generated!",
        description: `Content saved as ${filename}`,
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const copyContent = async () => {
    if (!sharedContent) return

    try {
      const plainText = sharedContent.content.replace(/<[^>]*>/g, "")
      await navigator.clipboard.writeText(plainText)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      try {
        const textArea = document.createElement("textarea")
        textArea.value = sharedContent.content.replace(/<[^>]*>/g, "")
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        setCopied(true)
        toast({
          title: "Copied!",
          description: "Content copied to clipboard",
        })
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackError) {
        toast({
          title: "Error",
          description: "Failed to copy content. Please copy manually.",
          variant: "destructive",
        })
      }
    }
  }

  const handleEditInMainEditor = () => {
    if (!sharedContent) return

    // Store the content in sessionStorage to be picked up by the main editor
    sessionStorage.setItem(
      "crosssync-edit-content",
      JSON.stringify({
        content: sharedContent.content,
        userName: sharedContent.userName,
        fromShared: true,
        sharedId: params.id,
      }),
    )

    // Navigate to main editor
    router.push("/")
  }

  const handleInlineEdit = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!sharedContent) return

    setSaving(true)
    try {
      // Calculate new stats
      const plainText = editedContent.replace(/<[^>]*>/g, "").trim()
      const wordCount = plainText ? plainText.split(/\s+/).length : 0
      const charCount = plainText.length

      // Update the content
      const updatedContent = {
        ...sharedContent,
        content: editedContent,
        wordCount,
        charCount,
        updatedAt: new Date().toISOString(),
      }

      // Save to storage
      try {
        localStorage.setItem(`shared_${params.id}`, JSON.stringify(updatedContent))
        sessionStorage.setItem(`shared_${params.id}`, JSON.stringify(updatedContent))
      } catch (storageError) {
        console.warn("Storage not available:", storageError)
      }

      // Update state
      setSharedContent(updatedContent)
      setIsEditing(false)

      toast({
        title: "Saved!",
        description: "Content updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedContent(sharedContent?.content || "")
    setIsEditing(false)
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared content...</p>
        </div>
      </div>
    )
  }

  if (!sharedContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="p-6 lg:p-8 max-w-md text-center bg-white/80 backdrop-blur-xl border-white/20 shadow-xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
            <FileText className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4">Content Not Found</h1>
          <p className="text-gray-600 mb-6 text-sm lg:text-base">
            The shared content you're looking for doesn't exist or has expired. This might happen if the content was
            shared from a different device or browser session.
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to CrossSync
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-6 py-6 lg:py-8 max-w-4xl">
        {/* Header - Mobile Responsive */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 lg:p-6 bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="p-2 lg:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg lg:rounded-xl">
                <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {isEditing ? "Editing Content" : "Shared Content"}
                </h1>
                <p className="text-gray-600 text-xs lg:text-sm">CrossSync - Beautiful content sharing</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing && (
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  size="sm"
                  className="bg-white/50 hover:bg-white/70 text-xs lg:text-sm"
                >
                  Cancel
                </Button>
              )}
              <Link href="/">
                <Button variant="outline" className="bg-white/50 hover:bg-gray-50 text-sm lg:text-base">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Editor
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Card - Mobile Responsive */}
        <Card className="p-4 lg:p-8 bg-white/80 backdrop-blur-xl border-white/20 shadow-xl">
          {/* Content Info - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 lg:gap-4 mb-4 lg:mb-6 pb-3 lg:pb-4 border-b border-gray-200/50">
            <div className="flex flex-wrap items-center gap-2 lg:gap-4">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-2 text-xs"
              >
                <User className="w-3 h-3" />
                {sharedContent.userName}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2 text-xs">
                <Calendar className="w-3 h-3" />
                {new Date(sharedContent.createdAt).toLocaleDateString()}
              </Badge>
              {isEditing && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                  Editing Mode
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm text-gray-500">
              <span>{sharedContent.wordCount} words</span>
              <span>{sharedContent.charCount} characters</span>
            </div>
          </div>

          {/* Editing Toolbar - Only show when editing */}
          {isEditing && (
            <div className="mb-4 p-3 bg-gray-50/80 rounded-lg border border-gray-200/50">
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => execCommand("bold")}
                  className="h-8 w-8 p-0 hover:bg-blue-100"
                >
                  <strong>B</strong>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => execCommand("italic")}
                  className="h-8 w-8 p-0 hover:bg-blue-100"
                >
                  <em>I</em>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => execCommand("underline")}
                  className="h-8 w-8 p-0 hover:bg-blue-100"
                >
                  <u>U</u>
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => execCommand("insertUnorderedList")}
                  className="h-8 px-2 hover:bg-blue-100 text-xs"
                >
                  • List
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => execCommand("insertOrderedList")}
                  className="h-8 px-2 hover:bg-blue-100 text-xs"
                >
                  1. List
                </Button>
              </div>
            </div>
          )}

          {/* Content Display/Editor - Mobile Responsive */}
          <div className="relative">
            {/* Grid Background */}
            <div
              className="absolute inset-0 opacity-30 rounded-lg lg:rounded-xl"
              style={{
                backgroundImage: `
                linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
              `,
                backgroundSize: "20px 20px",
              }}
            ></div>

            {isEditing ? (
              <div
                contentEditable
                onInput={(e) => setEditedContent(e.currentTarget.innerHTML)}
                className="relative min-h-48 lg:min-h-64 p-4 lg:p-6 bg-white/70 backdrop-blur-sm rounded-lg lg:rounded-xl border border-gray-200/50 prose prose-sm max-w-none text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                dangerouslySetInnerHTML={{ __html: editedContent }}
                suppressContentEditableWarning={true}
              />
            ) : (
              <div
                className="relative min-h-48 lg:min-h-64 p-4 lg:p-6 bg-white/70 backdrop-blur-sm rounded-lg lg:rounded-xl border border-gray-200/50 prose prose-sm max-w-none text-sm lg:text-base"
                dangerouslySetInnerHTML={{ __html: sharedContent.content }}
              />
            )}

            {/* User Attribution - Mobile Responsive */}
            <div className="absolute bottom-2 lg:bottom-4 right-2 lg:right-4 px-2 lg:px-3 py-1 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 text-xs text-gray-500">
              by {sharedContent.userName}
            </div>
          </div>

          {/* Action Buttons - Mobile Responsive */}
          <div className="mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-gray-200/50">
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-10 lg:h-11 bg-white hover:bg-gray-50 border-gray-200 text-sm lg:text-base"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 h-10 lg:h-11 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm lg:text-base"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Button
                  onClick={copyContent}
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-10 lg:h-11 bg-white hover:bg-gray-50 border-gray-200 text-sm lg:text-base"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  onClick={generatePDF}
                  disabled={isGeneratingPDF}
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-10 lg:h-11 bg-white hover:bg-gray-50 border-gray-200 text-sm lg:text-base"
                >
                  {isGeneratingPDF ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent" />
                  ) : (
                    <FileDown className="w-4 h-4" />
                  )}
                  {isGeneratingPDF ? "Generating..." : "Save PDF"}
                </Button>
                <Button
                  onClick={handleInlineEdit}
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-10 lg:h-11 bg-white hover:bg-gray-50 border-gray-200 text-sm lg:text-base"
                >
                  <Edit3 className="w-4 h-4" />
                  Quick Edit
                </Button>
                <Button
                  onClick={handleEditInMainEditor}
                  className="flex items-center justify-center gap-2 h-10 lg:h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm lg:text-base"
                >
                  <Edit3 className="w-4 h-4" />
                  Full Editor
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
