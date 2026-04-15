import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Github, Info, Zap } from 'lucide-react';
import { FileUploader } from '@/components/FileUploader';
import { WebhookConfig } from '@/components/WebhookConfig';
import { AnalysisResult } from '@/components/AnalysisResult';
import { analyzeDocument, DocumentAnalysis } from '@/lib/gemini';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

export default function App() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [currentFile, setCurrentFile] = useState<{ base64: string; mimeType: string; name: string } | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setAnalysis(null);
    setIsSent(false);

    try {
      const base64 = await fileToBase64(file);
      const fileData = {
        base64,
        mimeType: file.type || 'application/octet-stream',
        name: file.name
      };
      setCurrentFile(fileData);

      const result = await analyzeDocument(base64, fileData.mimeType, fileData.name);
      setAnalysis(result);
      toast.success('Document analyzed successfully!');
    } catch (err) {
      console.error('Error processing document:', err);
      setError('Failed to analyze document. Please try again.');
      toast.error('Analysis failed');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleSendToWebhook = async () => {
    if (!webhookUrl) {
      toast.error('Please configure a webhook URL first');
      return;
    }

    if (!analysis || !currentFile) return;

    setIsSending(true);
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        document: {
          name: currentFile.name,
          mimeType: currentFile.mimeType,
          content: currentFile.base64
        },
        analysis: analysis,
        data: analysis.suggestedWebhookPayload
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with ${response.status}`);
      }

      setIsSent(true);
      toast.success('Data sent to webhook successfully!');
    } catch (err) {
      console.error('Error sending to webhook:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to send to webhook');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary font-sans selection:bg-accent-glow/20 flex">
      {/* Sidebar */}
      <aside className="w-[280px] bg-bg-surface border-r border-border flex flex-col p-6 gap-6 shrink-0 hidden lg:flex">
        <div className="flex items-center gap-2 text-accent-glow font-extrabold tracking-[2px] text-lg mb-3">
          <Zap className="w-5 h-5 fill-current" />
          NEXUS
        </div>
        
        <div className="bg-accent-muted text-accent-glow font-mono text-[10px] px-2 py-1 rounded uppercase w-fit">
          System: Ready
        </div>

        <div className="mt-3 space-y-4">
          <p className="text-[11px] uppercase tracking-[1px] text-text-secondary font-semibold">Recent Transmissions</p>
          <div className="space-y-2">
            {[
              { name: 'Invoice_Q3_Final.pdf', meta: '200 OK • 1.2s • endpoint_7af' },
              { name: 'User_Metadata.json', meta: '200 OK • 0.8s • prod_webhook' },
              { name: 'Archive_2023.zip', meta: '200 OK • 4.5s • storage_node' }
            ].map((item, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-lg border-l-2 border-accent-muted">
                <div className="text-[13px] font-medium truncate">{item.name}</div>
                <div className="text-[11px] text-text-secondary font-mono mt-1">{item.meta}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-border">
          <p className="text-[11px] uppercase tracking-[1px] text-text-secondary font-semibold">Encryption</p>
          <p className="text-xs text-accent-glow mt-1">AES-256 Enabled</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="p-10 flex justify-between items-end shrink-0">
          <div className="space-y-1">
            <h1 className="text-[32px] font-extralight tracking-tight leading-none">Document Bridge</h1>
            <p className="text-text-secondary text-sm">Intelligent routing to your preferred cloud webhooks</p>
          </div>
          <button 
            onClick={handleSendToWebhook}
            disabled={!analysis || isSending || isSent}
            className="bg-accent-glow text-bg-deep px-7 py-3.5 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(0,242,255,0.3)] hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:scale-100 uppercase tracking-wider"
          >
            {isSent ? 'Sent' : isSending ? 'Sending...' : 'Send All'}
          </button>
        </header>

        <div className="px-10 pb-10 flex-1 overflow-y-auto space-y-8">
          {/* Webhook Config */}
          <div className="bg-bg-surface p-6 rounded-xl border border-border shadow-[0_0_30px_rgba(0,242,255,0.05)]">
            <WebhookConfig url={webhookUrl} onChange={setWebhookUrl} />
          </div>

          {/* Upload Section */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[1px] text-text-secondary">
                <span className="w-6 h-[1px] bg-accent-muted"></span>
                Sequence Initiation
              </div>
              <FileUploader 
                onFileSelect={handleFileSelect} 
                isProcessing={isProcessing} 
                error={error}
              />
            </div>

            <AnimatePresence mode="wait">
              {analysis && (
                <AnalysisResult 
                  analysis={analysis} 
                  onSend={handleSendToWebhook}
                  isSending={isSending}
                  isSent={isSent}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Metrics Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8">
            {[
              { label: 'Total Routed', value: '4,912' },
              { label: 'Success Rate', value: '99.98%' },
              { label: 'Avg Latency', value: '142ms' }
            ].map((metric, i) => (
              <div key={i} className="p-4 border-t border-border">
                <div className="text-xl font-mono text-accent-glow">{metric.value}</div>
                <div className="text-[10px] uppercase text-text-secondary mt-1 tracking-wider font-semibold">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Toaster position="bottom-right" />
    </div>
  );
}
