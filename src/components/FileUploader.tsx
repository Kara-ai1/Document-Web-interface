import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, File, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  error?: string | null;
}

export function FileUploader({ onFileSelect, isProcessing, error }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full">
      <Card
        className={cn(
          "relative border-2 border-dashed transition-all duration-500 p-12 text-center overflow-hidden group",
          isDragging ? "border-accent-glow bg-accent-glow/5 scale-[1.01]" : "border-accent-muted bg-accent-glow/[0.01]",
          selectedFile ? "bg-accent-glow/[0.02]" : "hover:bg-accent-glow/[0.03]"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Decorative inner border */}
        <div className="absolute inset-5 border border-accent-glow/5 pointer-events-none" />

        <AnimatePresence mode="wait">
          {!selectedFile ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-6 relative z-10"
            >
              <div className="w-16 h-16 rounded-full bg-accent-muted flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.2)] group-hover:scale-110 transition-transform duration-500">
                <Upload className="w-8 h-8 text-accent-glow" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-light tracking-tight">Drop documents to initiate sequence</h2>
                <p className="text-xs text-text-secondary uppercase tracking-widest">
                  Supported formats: PDF, JSON, ZIP, CSV, MD
                </p>
              </div>
              <Button 
                variant="outline" 
                className="mt-2 border-accent-muted text-accent-glow hover:bg-accent-muted/20 hover:text-accent-glow" 
                asChild
              >
                <label className="cursor-pointer">
                  Browse Files
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="selected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 relative z-10"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-accent-muted/30 flex items-center justify-center border border-accent-glow/20">
                  <File className="w-10 h-10 text-accent-glow" />
                </div>
                <button
                  onClick={clearFile}
                  className="absolute -top-2 -right-2 p-1.5 rounded-full bg-bg-deep border border-accent-glow/30 text-accent-glow shadow-lg hover:scale-110 transition-transform"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center space-y-1">
                <p className="font-mono text-lg text-accent-glow truncate max-w-[300px]">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-text-secondary uppercase tracking-widest">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • READY
                </p>
              </div>

              {isProcessing && (
                <div className="flex items-center gap-3 text-accent-glow">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-xs font-mono uppercase tracking-widest animate-pulse">Analyzing Neural Patterns...</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-4 py-2 rounded-lg border border-destructive/20">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest">{error}</span>
                </div>
              )}

              {!isProcessing && !error && (
                <div className="flex items-center gap-2 text-accent-glow bg-accent-muted/20 px-4 py-2 rounded-lg border border-accent-glow/20">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest">Integrity Verified</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
