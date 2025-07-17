"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Wifi, WifiOff, FileText, Hash, Clock } from "lucide-react"

interface StatusBarProps {
  wordCount: number
  charCount: number
  isConnected: boolean
}

export function StatusBar({ wordCount, charCount, isConnected }: StatusBarProps) {
  return (
    <Card className="p-4 lg:p-6 bg-white/80 backdrop-blur-xl border-white/20 shadow-xl">
      <div className="flex items-center gap-3 mb-3 lg:mb-4">
        <div className="p-1.5 lg:p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <FileText className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
        </div>
        <h3 className="font-semibold text-gray-800 text-sm lg:text-base">Document Stats</h3>
      </div>

      <div className="space-y-2 lg:space-y-3">
        <div className="flex items-center justify-between p-2.5 lg:p-3 bg-gray-50/80 rounded-lg">
          <span className="text-xs lg:text-sm font-medium text-gray-600 flex items-center gap-2">
            <FileText className="w-3 h-3 text-blue-600" />
            Words
          </span>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
            {wordCount.toLocaleString()}
          </Badge>
        </div>

        <div className="flex items-center justify-between p-2.5 lg:p-3 bg-gray-50/80 rounded-lg">
          <span className="text-xs lg:text-sm font-medium text-gray-600 flex items-center gap-2">
            <Hash className="w-3 h-3 text-purple-600" />
            Characters
          </span>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
            {charCount.toLocaleString()}
          </Badge>
        </div>

        <div className="flex items-center justify-between p-2.5 lg:p-3 bg-gray-50/80 rounded-lg">
          <span className="text-xs lg:text-sm font-medium text-gray-600 flex items-center gap-2">
            {isConnected ? <Wifi className="w-3 h-3 text-green-600" /> : <WifiOff className="w-3 h-3 text-red-600" />}
            Status
          </span>
          <Badge
            variant={isConnected ? "default" : "destructive"}
            className={`text-xs ${isConnected ? "bg-green-100 text-green-700 border-green-200" : ""}`}
          >
            {isConnected ? "Online" : "Offline"}
          </Badge>
        </div>

        <div className="flex items-center justify-between p-2.5 lg:p-3 bg-gray-50/80 rounded-lg">
          <span className="text-xs lg:text-sm font-medium text-gray-600 flex items-center gap-2">
            <Clock className="w-3 h-3 text-amber-600" />
            Last Saved
          </span>
          <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
            Auto-save
          </Badge>
        </div>
      </div>
    </Card>
  )
}
