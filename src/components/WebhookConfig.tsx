import React from 'react';
import { Globe, Link2, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface WebhookConfigProps {
  url: string;
  onChange: (url: string) => void;
}

export function WebhookConfig({ url, onChange }: WebhookConfigProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] uppercase tracking-[1px] text-text-secondary font-semibold">Destination Webhook URL</label>
        <div className="relative group">
          <Input
            id="webhook-url"
            placeholder="https://hooks.nexus.io/v1/deploy/..."
            value={url}
            onChange={(e) => onChange(e.target.value)}
            className="bg-black border-accent-muted text-accent-glow font-mono text-sm py-6 px-4 focus-visible:ring-accent-glow/50 focus-visible:border-accent-glow transition-all"
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity">
            <Link2 className="w-4 h-4 text-accent-glow" />
          </div>
        </div>
      </div>
      <div className="flex items-start gap-3 p-4 rounded-lg bg-accent-glow/[0.02] border border-accent-glow/10">
        <Info className="w-4 h-4 text-accent-glow mt-0.5 shrink-0" />
        <p className="text-[11px] text-text-secondary leading-relaxed uppercase tracking-wider">
          Transmission protocol: POST/JSON • Content: Document Metadata + Neural Analysis + Base64 Payload
        </p>
      </div>
    </div>
  );
}
