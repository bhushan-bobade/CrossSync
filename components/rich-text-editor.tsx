"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  Type,
  Palette,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  userName?: string
}

export function RichTextEditor({ content, onChange, userName }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const handleFontSize = (size: string) => {
    execCommand("fontSize", size)
  }

  const handleFontFamily = (family: string) => {
    execCommand("fontName", family)
  }

  const handleTextColor = (color: string) => {
    execCommand("foreColor", color)
  }

  const handleBackgroundColor = (color: string) => {
    execCommand("backColor", color)
  }

  if (!isClient) {
    return <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
  }

  return (
    <div className="space-y-3 lg:space-y-4">
      {/* Compact Single-Line Toolbar - Mobile Responsive */}
      <div className="flex items-center gap-1 lg:gap-2 p-2 lg:p-3 bg-gray-50/80 rounded-lg lg:rounded-xl border border-gray-200/50 overflow-x-auto">
        {/* Font Controls */}
        <Select onValueChange={handleFontFamily}>
          <SelectTrigger className="w-20 lg:w-28 h-7 lg:h-8 text-xs bg-white border-gray-200">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Times New Roman">Times</SelectItem>
            <SelectItem value="Calibri">Calibri</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleFontSize}>
          <SelectTrigger className="w-12 lg:w-16 h-7 lg:h-8 text-xs bg-white border-gray-200">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">8pt</SelectItem>
            <SelectItem value="2">10pt</SelectItem>
            <SelectItem value="3">12pt</SelectItem>
            <SelectItem value="4">14pt</SelectItem>
            <SelectItem value="5">18pt</SelectItem>
            <SelectItem value="6">24pt</SelectItem>
            <SelectItem value="7">36pt</SelectItem>
          </SelectContent>
        </Select>

        <div className="w-px h-4 lg:h-6 bg-gray-300 mx-0.5 lg:mx-1"></div>

        {/* Basic Formatting */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("bold")}
          className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-blue-100 rounded-lg"
        >
          <Bold className="w-3 h-3 lg:w-4 lg:h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("italic")}
          className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-blue-100 rounded-lg"
        >
          <Italic className="w-3 h-3 lg:w-4 lg:h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("underline")}
          className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-blue-100 rounded-lg"
        >
          <Underline className="w-3 h-3 lg:w-4 lg:h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("strikeThrough")}
          className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-blue-100 rounded-lg"
        >
          <Strikethrough className="w-3 h-3 lg:w-4 lg:h-4" />
        </Button>

        <div className="w-px h-4 lg:h-6 bg-gray-300 mx-0.5 lg:mx-1"></div>

        {/* Color Controls */}
        <div className="flex items-center gap-0.5 lg:gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-purple-100 rounded-lg">
            <Type className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
          <input
            type="color"
            onChange={(e) => handleTextColor(e.target.value)}
            className="w-5 h-5 lg:w-6 lg:h-6 rounded border-0 cursor-pointer"
            title="Text Color"
          />
        </div>

        <div className="flex items-center gap-0.5 lg:gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-purple-100 rounded-lg">
            <Palette className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
          <input
            type="color"
            onChange={(e) => handleBackgroundColor(e.target.value)}
            className="w-5 h-5 lg:w-6 lg:h-6 rounded border-0 cursor-pointer"
            title="Background Color"
          />
        </div>

        <div className="w-px h-4 lg:h-6 bg-gray-300 mx-0.5 lg:mx-1"></div>

        {/* Alignment */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("justifyLeft")}
          className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-green-100 rounded-lg"
        >
          <AlignLeft className="w-3 h-3 lg:w-4 lg:h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("justifyCenter")}
          className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-green-100 rounded-lg"
        >
          <AlignCenter className="w-3 h-3 lg:w-4 lg:h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("justifyRight")}
          className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-green-100 rounded-lg"
        >
          <AlignRight className="w-3 h-3 lg:w-4 lg:h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("justifyFull")}
          className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-green-100 rounded-lg"
        >
          <AlignJustify className="w-3 h-3 lg:w-4 lg:h-4" />
        </Button>

        <div className="w-px h-4 lg:h-6 bg-gray-300 mx-0.5 lg:mx-1"></div>

        {/* Lists */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("insertUnorderedList")}
          className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-yellow-100 rounded-lg"
        >
          <List className="w-3 h-3 lg:w-4 lg:h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("insertOrderedList")}
          className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-yellow-100 rounded-lg"
        >
          <ListOrdered className="w-3 h-3 lg:w-4 lg:h-4" />
        </Button>

        <div className="w-px h-4 lg:h-6 bg-gray-300 mx-0.5 lg:mx-1"></div>

        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("undo")}
          className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-gray-100 rounded-lg"
        >
          <Undo className="w-3 h-3 lg:w-4 lg:h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand("redo")}
          className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-gray-100 rounded-lg"
        >
          <Redo className="w-3 h-3 lg:w-4 lg:h-4" />
        </Button>
      </div>

      {/* Editor with Grid Background - Mobile Responsive */}
      <div className="relative rounded-lg lg:rounded-xl overflow-hidden border border-gray-200/50">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "20px 20px",
          }}
        ></div>

        {/* Secondary Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.15) 1px, transparent 1px)
          `,
            backgroundSize: "100px 100px",
          }}
        ></div>

        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="relative min-h-64 lg:min-h-96 p-4 lg:p-6 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 prose prose-sm max-w-none transition-all duration-200"
          style={{
            lineHeight: "1.6",
            fontSize: "14px",
          }}
          placeholder="Start typing your content here..."
          suppressContentEditableWarning={true}
        />

        {/* User Attribution - Mobile Responsive */}
        {userName && (
          <div className="absolute bottom-2 lg:bottom-4 right-2 lg:right-4 px-2 lg:px-3 py-1 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 text-xs text-gray-500">
            by {userName}
          </div>
        )}
      </div>
    </div>
  )
}
