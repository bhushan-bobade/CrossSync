"use client"

import { useState, useEffect } from "react"
import { RichTextEditor } from "@/components/rich-text-editor"
import { QRCodePanel } from "@/components/qr-code-panel"
import { StatusBar } from "@/components/status-bar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, FileText, Smartphone, Monitor, Tablet, Sparkles, Zap, Edit3, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const [content, setContent] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [showQRPanel, setShowQRPanel] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")
  const [userName, setUserName] = useState("anonymous")
  const { toast } = useToast()

  // Check for content to edit from shared page
  useEffect(() => {
    const editData = sessionStorage.getItem("crosssync-edit-content")
    if (editData) {
      try {
        const { content: editContent, userName: editUserName, fromShared } = JSON.parse(editData)
        setContent(editContent)
        setUserName(editUserName)

        // Calculate stats for the loaded content
        const text = editContent.replace(/<[^>]*>/g, "").trim()
        const words = text ? text.split(/\s+/).length : 0
        const chars = text.length
        setWordCount(words)
        setCharCount(chars)

        // Clear the session storage
        sessionStorage.removeItem("crosssync-edit-content")

        if (fromShared) {
          toast({
            title: "Content Loaded",
            description: "Shared content loaded for editing",
          })
        }
      } catch (error) {
        console.error("Error loading edit content:", error)
      }
    }
  }, [toast])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)

    // Calculate word and character count
    const text = newContent.replace(/<[^>]*>/g, "").trim()
    const words = text ? text.split(/\s+/).length : 0
    const chars = text.length

    setWordCount(words)
    setCharCount(chars)
  }

  const handleShare = () => {
    setShowQRPanel(true)
    setActiveTab("share")
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern Background with Grid Texture */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"></div>

        {/* Grid Texture Overlay */}
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

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-40 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-red-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>

        {/* Secondary fine grid for texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.1) 0.5px, transparent 0.5px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0.5px, transparent 0.5px)
            `,
            backgroundSize: "10px 10px",
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        {/* Modern Header - Mobile Responsive */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 lg:p-6 bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg lg:rounded-xl blur opacity-75"></div>
                <div className="relative p-2 lg:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg lg:rounded-xl">
                  <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CrossSync
                </h1>
                <p className="text-gray-600 text-xs lg:text-sm flex items-center gap-2">
                  <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-amber-500" />
                  Beautiful cross-platform content sharing
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 bg-gray-50/80 rounded-lg lg:rounded-xl border border-gray-200/50">
              <div className="flex items-center gap-1">
                <Monitor className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500" />
                <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center gap-1">
                <Smartphone className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center gap-1">
                <Tablet className="w-3 h-3 lg:w-4 lg:h-4 text-purple-500" />
                <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Editor Section */}
          <div className="lg:col-span-3 order-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 shadow-xl overflow-hidden">
              {/* Modern Tab Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b border-gray-200/50 bg-gray-50/50">
                  <TabsList className="h-auto p-1 bg-transparent w-full justify-start">
                    <TabsTrigger
                      value="editor"
                      className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 font-medium transition-all duration-200 text-sm lg:text-base"
                    >
                      <Edit3 className="w-4 h-4" />
                      Editor
                    </TabsTrigger>
                    <TabsTrigger
                      value="share"
                      className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 font-medium transition-all duration-200 text-sm lg:text-base"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-4 lg:p-6">
                  <TabsContent value="editor" className="mt-0">
                    <div className="space-y-4">
                      {/* Name Input Section - Mobile Optimized */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 lg:p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                        <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                          <User className="w-4 h-4" />
                          <span>Name:</span>
                        </div>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Enter your name"
                          className="flex-1 w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
                        />
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 border-blue-200 text-xs self-start sm:self-center"
                        >
                          {userName || "anonymous"}
                        </Badge>
                      </div>

                      <RichTextEditor content={content} onChange={handleContentChange} userName={userName} />
                    </div>
                  </TabsContent>

                  <TabsContent value="share" className="mt-0">
                    <QRCodePanel content={content} userName={userName} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Sidebar - Mobile Responsive */}
          <div className="space-y-4 lg:space-y-6 order-2 lg:order-2">
            {/* Quick Actions */}
            <Card className="p-4 lg:p-6 bg-white/80 backdrop-blur-xl border-white/20 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm lg:text-base">Quick Actions</h3>
              </div>

              <Button
                onClick={handleShare}
                disabled={!content.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 lg:py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg text-sm lg:text-base"
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate Share Link
              </Button>
            </Card>

            {/* Compatible Devices - Mobile Optimized */}
            <Card className="p-4 lg:p-6 bg-white/80 backdrop-blur-xl border-white/20 shadow-xl">
              <h3 className="font-semibold text-gray-800 mb-3 lg:mb-4 text-sm lg:text-base">Compatible Devices</h3>
              <div className="space-y-2 lg:space-y-3">
                <div className="flex items-center gap-3 p-2.5 lg:p-3 bg-blue-50/80 rounded-lg border border-blue-100">
                  <div className="p-1.5 lg:p-2 bg-blue-500 rounded-lg flex-shrink-0">
                    <Monitor className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs lg:text-sm text-gray-800 truncate">Desktop</p>
                    <p className="text-xs text-gray-500 truncate">Windows, macOS, Linux</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 lg:p-3 bg-green-50/80 rounded-lg border border-green-100">
                  <div className="p-1.5 lg:p-2 bg-green-500 rounded-lg flex-shrink-0">
                    <Smartphone className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs lg:text-sm text-gray-800 truncate">Mobile</p>
                    <p className="text-xs text-gray-500 truncate">iOS, Android</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 lg:p-3 bg-purple-50/80 rounded-lg border border-purple-100">
                  <div className="p-1.5 lg:p-2 bg-purple-500 rounded-lg flex-shrink-0">
                    <Tablet className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs lg:text-sm text-gray-800 truncate">Tablet</p>
                    <p className="text-xs text-gray-500 truncate">iPad, Android tablets</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Status */}
            <StatusBar wordCount={wordCount} charCount={charCount} isConnected={true} />
          </div>
        </div>
      </div>
    </div>
  )
}
