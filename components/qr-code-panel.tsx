"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Share2, CheckCircle, QrCode, X, Sun, Moon, FileDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QRCodePanelProps {
  content: string
  userName?: string
}

interface SocialPlatform {
  name: string
  icon: string
  lightColor: string
  darkColor: string
  shareUrl: (url: string, text: string) => string
}

const socialPlatforms: SocialPlatform[] = [
  {
    name: "WhatsApp",
    icon: "whatsapp",
    lightColor: "bg-green-500",
    darkColor: "bg-green-600",
    shareUrl: (url, text) => `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`,
  },
  {
    name: "X",
    icon: "x",
    lightColor: "bg-gray-900",
    darkColor: "bg-white",
    shareUrl: (url, text) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "Telegram",
    icon: "telegram",
    lightColor: "bg-blue-500",
    darkColor: "bg-blue-600",
    shareUrl: (url, text) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: "Facebook",
    icon: "facebook",
    lightColor: "bg-blue-600",
    darkColor: "bg-blue-700",
    shareUrl: (url, text) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    lightColor: "bg-blue-700",
    darkColor: "bg-blue-800",
    shareUrl: (url, text) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`,
  },
  {
    name: "Email",
    icon: "email",
    lightColor: "bg-gray-600",
    darkColor: "bg-gray-700",
    shareUrl: (url, text) =>
      `mailto:?subject=${encodeURIComponent("Shared from CrossSync")}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
  },
]

const renderPlatformIcon = (iconType: string, isDark = false) => {
  const iconColor = isDark && iconType === "x" ? "text-black" : "text-white"

  switch (iconType) {
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className={`w-full h-full fill-current ${iconColor}`}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
        </svg>
      )
    case "x":
      return (
        <svg viewBox="0 0 24 24" className={`w-full h-full fill-current ${iconColor}`}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case "telegram":
      return (
        <svg viewBox="0 0 24 24" className={`w-full h-full fill-current ${iconColor}`}>
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      )
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={`w-full h-full fill-current ${iconColor}`}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className={`w-full h-full fill-current ${iconColor}`}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    case "email":
      return (
        <svg viewBox="0 0 24 24" className={`w-full h-full fill-current ${iconColor}`}>
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.91L12 10.09l9.455-6.269h.909c.904 0 1.636.732 1.636 1.636z" />
        </svg>
      )
    default:
      return <span className="text-xs">{iconType}</span>
  }
}

export function QRCodePanel({ content, userName = "anonymous" }: QRCodePanelProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const { toast } = useToast()

  // Load theme preference on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("crosssync-share-theme")
    if (savedTheme === "dark") {
      setIsDarkTheme(true)
    }
  }, [])

  // Save theme preference when changed
  const toggleTheme = () => {
    const newTheme = !isDarkTheme
    setIsDarkTheme(newTheme)
    localStorage.setItem("crosssync-share-theme", newTheme ? "dark" : "light")
    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme ? "dark" : "light"} theme icons`,
    })
  }

  useEffect(() => {
    if (content.trim()) {
      generateShareableContent(content, userName)
    }
  }, [content, userName])

  const generateShareableContent = async (text: string, author: string) => {
    try {
      // Generate unique ID for this content
      const contentId = generateId()

      // Calculate stats
      const plainText = text.replace(/<[^>]*>/g, "").trim()
      const wordCount = plainText ? plainText.split(/\s+/).length : 0
      const charCount = plainText.length

      // Create shareable content object
      const sharedContent = {
        id: contentId,
        content: text,
        userName: author,
        createdAt: new Date().toISOString(),
        wordCount,
        charCount,
      }

      // Store in multiple places for better persistence
      try {
        localStorage.setItem(`shared_${contentId}`, JSON.stringify(sharedContent))
        sessionStorage.setItem(`shared_${contentId}`, JSON.stringify(sharedContent))
      } catch (storageError) {
        console.warn("Storage not available:", storageError)
      }

      // Generate shareable URL with content encoded in URL for fallback
      const baseUrl = window.location.origin
      const encodedContent = encodeURIComponent(JSON.stringify(sharedContent))
      const shareableUrl = `${baseUrl}/shared/${contentId}?data=${encodedContent}`
      setShareUrl(shareableUrl)

      // Generate QR code with the URL
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareableUrl)}&format=png&ecc=M`
      setQrCodeUrl(qrUrl)
    } catch (error) {
      console.error("Error generating shareable content:", error)
      toast({
        title: "Error",
        description: "Failed to generate shareable content",
        variant: "destructive",
      })
    }
  }

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  }

  const generatePDF = async () => {
    setIsGeneratingPDF(true)
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import("jspdf")

      // Create new PDF document
      const doc = new jsPDF()

      // Set up document properties
      doc.setProperties({
        title: `CrossSync Content - ${userName}`,
        subject: "Content shared via CrossSync",
        author: userName,
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
      doc.text(`Author: ${userName}`, 20, 50)
      doc.text(`Created: ${new Date().toLocaleDateString()}`, 20, 55)

      // Calculate content stats
      const plainText = content.replace(/<[^>]*>/g, "").trim()
      const wordCount = plainText ? plainText.split(/\s+/).length : 0
      const charCount = plainText.length

      doc.text(`Words: ${wordCount} | Characters: ${charCount}`, 20, 60)

      // Add another separator
      doc.line(20, 65, 190, 65)

      // Add content
      doc.setFontSize(12)
      doc.setTextColor(31, 41, 55) // Dark text

      // Convert HTML to plain text and handle formatting
      const textContent = content
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
      const filename = `CrossSync_${userName}_${timestamp}.pdf`

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

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Share URL copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      try {
        const textArea = document.createElement("textarea")
        textArea.value = shareUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        setCopied(true)
        toast({
          title: "Copied!",
          description: "Share URL copied to clipboard",
        })
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackError) {
        toast({
          title: "Error",
          description: "Failed to copy URL. Please copy manually.",
          variant: "destructive",
        })
      }
    }
  }

  const copyContent = async () => {
    try {
      const plainText = content.replace(/<[^>]*>/g, "")
      await navigator.clipboard.writeText(plainText)
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      })
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      try {
        const textArea = document.createElement("textarea")
        textArea.value = content.replace(/<[^>]*>/g, "")
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        toast({
          title: "Copied!",
          description: "Content copied to clipboard",
        })
      } catch (fallbackError) {
        toast({
          title: "Error",
          description: "Failed to copy content. Please copy manually.",
          variant: "destructive",
        })
      }
    }
  }

  const shareToSocial = (platform: SocialPlatform) => {
    const text = `Check out this content shared via CrossSync by ${userName}`
    const url = platform.shareUrl(shareUrl, text)
    window.open(url, "_blank", "width=600,height=400")
  }

  const shareNatively = async () => {
    // Check if Web Share API is supported and available
    if (navigator.share && navigator.canShare) {
      try {
        const shareData = {
          title: "CrossSync Content",
          text: `Content shared by ${userName}`,
          url: shareUrl,
        }

        // Check if the data can be shared
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData)
          return
        }
      } catch (error) {
        console.warn("Native sharing failed:", error)
        // Fall through to show dialog
      }
    }

    // Fallback: show custom share dialog
    setShowShareDialog(true)
  }

  if (!content.trim()) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
          <QrCode className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">No Content to Share</h3>
        <p className="text-gray-500">Create some content in the editor to generate a shareable link and QR code.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Share URL - Mobile Optimized */}
      <Card className="p-3 lg:p-4 bg-gray-50/50 border-gray-200/50">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-3">
          <div className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs lg:text-sm font-mono text-gray-600 truncate min-w-0">
            {shareUrl}
          </div>
          <Button
            onClick={copyShareUrl}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 text-xs lg:text-sm px-3 py-2 whitespace-nowrap"
          >
            {copied ? (
              <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-500 mr-1" />
            ) : (
              <Copy className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </Card>

      {/* QR Code Display - Mobile Responsive */}
      <div className="text-center">
        <div className="inline-block p-4 lg:p-6 bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200/50">
          {qrCodeUrl ? (
            <img
              src={qrCodeUrl || "/placeholder.svg"}
              alt="QR Code"
              className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 mx-auto rounded-lg lg:rounded-xl"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-gray-100 rounded-lg lg:rounded-xl flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 lg:h-8 lg:w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          )}
        </div>

        <div className="mt-3 lg:mt-4 space-y-2">
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs">
            Ready to scan
          </Badge>
          <p className="text-xs lg:text-sm text-gray-500 max-w-md mx-auto px-4">
            Scan this QR code to open the content in CrossSync on any device
          </p>
        </div>
      </div>

      {/* Action Buttons - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          onClick={copyContent}
          variant="outline"
          className="flex items-center justify-center gap-2 h-10 lg:h-11 bg-white hover:bg-gray-50 border-gray-200 text-sm lg:text-base"
        >
          <Copy className="w-4 h-4" />
          Copy Text
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
          {isGeneratingPDF ? "Generating..." : "Save as PDF"}
        </Button>

        <Button
          onClick={shareNatively}
          className="flex items-center justify-center gap-2 h-10 lg:h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm lg:text-base"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      {/* Social Share Dialog - Mobile Optimized */}
      {showShareDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm lg:max-w-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base lg:text-lg font-semibold">Share</h3>
                <div className="flex items-center gap-2">
                  {/* Theme Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    title={`Switch to ${isDarkTheme ? "light" : "dark"} theme`}
                  >
                    {isDarkTheme ? (
                      <Sun className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Moon className="w-4 h-4 text-slate-600" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowShareDialog(false)} className="h-8 w-8 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Theme Indicator */}
              <div className="mb-4 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
                <span className="text-xs text-gray-600">Icon Theme:</span>
                <Badge variant="outline" className="text-xs">
                  {isDarkTheme ? "Dark" : "Light"}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 lg:gap-3 mb-4">
                {socialPlatforms.map((platform) => (
                  <Button
                    key={platform.name}
                    variant="outline"
                    onClick={() => shareToSocial(platform)}
                    className="flex flex-col items-center gap-1.5 lg:gap-2 h-auto py-2.5 lg:py-3 hover:bg-gray-50 text-xs transition-all duration-200"
                  >
                    <div
                      className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full ${
                        isDarkTheme ? platform.darkColor : platform.lightColor
                      } flex items-center justify-center p-1.5 transition-all duration-200 hover:scale-110`}
                    >
                      {renderPlatformIcon(platform.icon, isDarkTheme)}
                    </div>
                    <span className="text-xs truncate w-full text-center">{platform.name}</span>
                  </Button>
                ))}
              </div>

              <div className="pt-3 lg:pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 p-2.5 lg:p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 text-xs lg:text-sm font-mono text-gray-600 truncate min-w-0">{shareUrl}</div>
                  <Button onClick={copyShareUrl} variant="ghost" size="sm" className="h-7 lg:h-8 px-2 flex-shrink-0">
                    {copied ? (
                      <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3 lg:w-4 lg:h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Content Preview - Mobile Responsive */}
      <Card className="p-3 lg:p-4 bg-gray-50/50 border-gray-200/50">
        <h4 className="font-medium mb-2 text-gray-800 flex items-center gap-2 text-sm lg:text-base">
          <Share2 className="w-4 h-4" />
          Content Preview
        </h4>
        <div
          className="prose prose-sm max-w-none bg-white p-2.5 lg:p-3 rounded-lg max-h-24 lg:max-h-32 overflow-y-auto border border-gray-200/50 text-xs lg:text-sm"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Card>

      {/* Instructions - Mobile Responsive */}
      <Card className="p-3 lg:p-4 bg-blue-50/50 border-blue-200/50">
        <h4 className="font-medium mb-2 text-blue-800 text-sm lg:text-base">How to Share</h4>
        <ol className="text-xs lg:text-sm text-blue-700 space-y-1">
          <li>1. Share the URL or QR code with others</li>
          <li>2. Recipients can scan the QR code or visit the URL</li>
          <li>3. Content opens in CrossSync with full formatting</li>
          <li>4. Works on all devices - mobile, tablet, desktop!</li>
        </ol>
      </Card>
    </div>
  )
}
