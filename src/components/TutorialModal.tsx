import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';

interface TutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: any;
}

// Tutorial video IDs from actual tool tutorials
const getTutorialVideo = (toolId: string): string => {
  const videos: Record<string, string> = {
    // Productivity
    nextcloud: 'Rb9flAoRGQo',
    mattermost: 'FuDvrkrqRzg',
    focalboard: 'YMdLXw7zHHM',
    docmost: 'dQw4w9WgXcQ',
    karakeep: 'dQw4w9WgXcQ',
    vaultwarden: 'SQZM_W-KYvU',
    librechat: 'dQw4w9WgXcQ',
    // Content
    opencut: 'dQw4w9WgXcQ',
    languagetool: 'dQw4w9WgXcQ',
    pulse: 'dQw4w9WgXcQ',
    opensign: 'dQw4w9WgXcQ',
    // Design
    penpot: 'YMdLXw7zHHM',
    // Marketing
    twentycrm: 'dQw4w9WgXcQ',
    'odoo-marketing': 'Yg6WGWRHfhE',
    superset: 'Yg6WGWRHfhE',
    // Operations
    ollama: 'Hh_yr_3YZkQ',
    supabase: 'dU7GwCOgvNY',
    nifi: 'fblkgr1PJ0o',
    airbyte: 'Rcpt5SVsMpk',
    n8n: 'RpjQTGKm-ok',
    'odoo-erp': 'Yg6WGWRHfhE',
  };
  return videos[toolId] || 'dQw4w9WgXcQ';
};

export default function TutorialModal({ open, onOpenChange, tool }: TutorialModalProps) {
  if (!tool) return null;

  const videoId = getTutorialVideo(tool.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-normal">
            {tool.name} Tutorials
          </DialogTitle>
          <DialogDescription className="text-body-text dark:text-dark-muted">
            Learn how to use {tool.name} effectively with our comprehensive guides
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          {/* Video Player */}
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-light-gray dark:bg-dark-hover shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={`${tool.name} Tutorial`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>

          {/* Additional Resources */}
          <div className="rounded-xl border border-border bg-light-gray dark:bg-dark-hover p-6">
            <h4 className="font-display mb-4 text-lg font-normal text-heading-dark dark:text-dark-text">Additional Resources</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: 'Getting Started Guide', description: 'Learn the basics' },
                { title: 'Advanced Features', description: 'Master advanced tools' },
                { title: 'Best Practices', description: 'Tips from experts' },
                { title: 'Integration Guide', description: 'Connect with other tools' },
              ].map((resource, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border border-border bg-white dark:bg-dark-card p-4 transition-all hover:border-mint-accent/50 hover:shadow-md"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-soft-mint dark:bg-mint-accent/20">
                    <ExternalLink className="h-4 w-4 text-forest-green dark:text-mint-accent" />
                  </div>
                  <div>
                    <p className="font-ui font-medium text-heading-dark dark:text-dark-text">{resource.title}</p>
                    <p className="font-sans text-xs text-body-text dark:text-dark-muted">{resource.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="rounded-full border-border dark:border-dark-border"
            >
              Close
            </Button>
            <Button
              onClick={() => window.open(tool.url, '_blank')}
              className="rounded-full bg-mint-accent text-forest-dark hover:bg-mint-accent/90"
            >
              Open {tool.name}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
