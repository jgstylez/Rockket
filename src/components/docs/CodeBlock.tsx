"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  description?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  title,
  description,
  showLineNumbers = false,
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className={`bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      {(title || language) && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {title && (
              <h4 className="text-sm font-medium text-gray-200">{title}</h4>
            )}
            <Badge variant="secondary" className="text-xs">
              {language}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="text-gray-400 hover:text-gray-200"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
          <p className="text-sm text-gray-300">{description}</p>
        </div>
      )}

      {/* Code content */}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm text-gray-100">
          <code className={`language-${language}`}>
            {showLineNumbers
              ? code.split("\n").map((line, index) => (
                  <div key={index} className="flex">
                    <span className="text-gray-500 mr-4 select-none w-8 text-right">
                      {index + 1}
                    </span>
                    <span>{line}</span>
                  </div>
                ))
              : code}
          </code>
        </pre>
      </div>
    </div>
  );
}
