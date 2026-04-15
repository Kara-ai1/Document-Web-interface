import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Tag, FileText, Database, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DocumentAnalysis } from '@/lib/gemini';

interface AnalysisResultProps {
  analysis: DocumentAnalysis;
  onSend: () => void;
  isSending: boolean;
  isSent: boolean;
}

export function AnalysisResult({ analysis, onSend, isSending, isSent }: AnalysisResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 overflow-hidden border-border bg-bg-surface shadow-[0_0_30px_rgba(0,242,255,0.05)]">
          <CardHeader className="bg-accent-glow/[0.02] border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-glow" />
                <CardTitle className="text-lg font-light tracking-tight">Neural Analysis</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-accent-muted text-accent-glow border-accent-glow/20 font-mono text-[10px]">
                {Math.round(analysis.confidence * 100)}% CONFIDENCE
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-[2px]">
                <FileText className="w-3 h-3" />
                Executive Summary
              </div>
              <p className="text-lg leading-relaxed font-light text-text-primary/90">
                {analysis.summary}
              </p>
            </section>

            <Separator className="bg-border" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-[2px]">
                  <Tag className="w-3 h-3" />
                  Classification
                </div>
                <Badge variant="outline" className="text-xs py-1.5 px-4 border-accent-glow/30 text-accent-glow bg-accent-glow/[0.02] font-mono">
                  {analysis.documentType.toUpperCase()}
                </Badge>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-[2px]">
                  <Database className="w-3 h-3" />
                  Extracted Entities
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.keyEntities.map((entity, i) => (
                    <Badge key={i} variant="secondary" className="bg-white/5 text-[10px] font-mono border-none">
                      {entity}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>
          </CardContent>
          <CardFooter className="bg-black/40 p-8 flex justify-between items-center border-t border-border">
            <div className="text-[10px] text-text-secondary uppercase tracking-widest font-mono">
              Status: Analysis Complete • Ready for Routing
            </div>
            <Button 
              onClick={onSend} 
              disabled={isSending || isSent}
              className="bg-accent-glow text-bg-deep hover:scale-[1.05] transition-transform font-bold text-xs uppercase tracking-widest px-6 h-11 shadow-[0_0_15px_rgba(0,242,255,0.3)]"
            >
              {isSent ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Routed
                </>
              ) : isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Routing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Initiate Route
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="h-full flex flex-col border-border bg-black shadow-inner">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[2px] text-text-secondary">
              Payload Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[450px] w-full">
              <pre className="p-6 text-[11px] font-mono text-accent-glow/70 leading-relaxed overflow-x-hidden">
                {JSON.stringify(analysis.suggestedWebhookPayload, null, 2)}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
