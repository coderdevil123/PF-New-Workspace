import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { MessageCircle, Mail, Phone, ExternalLink } from 'lucide-react';

interface ContactHelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: any;
}

export default function ContactHelpModal({ open, onOpenChange, tool }: ContactHelpModalProps) {
  if (!tool) return null;

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I need help with ${tool.name}`);
    window.open(`https://wa.me/1234567890?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Help Request: ${tool.name}`);
    const body = encodeURIComponent(`Hi Support Team,\n\nI need assistance with ${tool.name}.\n\nIssue Description:\n\n\nBest regards`);
    window.location.href = `mailto:support@pristineforests.com?subject=${subject}&body=${body}`;
  };

  const handlePhone = () => {
    window.location.href = 'tel:+12345678900';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-normal">
            Get Help with {tool.name}
          </DialogTitle>
          <DialogDescription className="text-body-text dark:text-dark-muted">
            Choose your preferred method to contact our support team
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {/* WhatsApp Support */}
          <button
            onClick={handleWhatsApp}
            className="group w-full rounded-xl border-2 border-border bg-white dark:bg-dark-card-elevated p-4 text-left transition-all hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 transition-all group-hover:scale-110 group-hover:bg-green-500">
                <MessageCircle className="h-6 w-6 text-green-600 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <div className="font-ui mb-1 font-semibold text-heading-dark dark:text-dark-text">WhatsApp Support</div>
                <div className="font-sans text-sm text-body-text dark:text-dark-muted">Get instant help via WhatsApp chat</div>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400 transition-all group-hover:text-green-600" />
            </div>
          </button>

          {/* Email Support */}
          <button
            onClick={handleEmail}
            className="group w-full rounded-xl border-2 border-border bg-white dark:bg-dark-card-elevated p-4 text-left transition-all hover:border-mint-accent hover:bg-soft-mint dark:hover:bg-mint-accent/10 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-all group-hover:scale-110 group-hover:bg-primary">
                <Mail className="h-6 w-6 text-primary group-hover:text-white" />
              </div>
              <div className="flex-1">
                <div className="font-ui mb-1 font-semibold text-heading-dark dark:text-dark-text">Email Support</div>
                <div className="font-sans text-sm text-body-text dark:text-dark-muted">support@pristineforests.com</div>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400 transition-all group-hover:text-primary" />
            </div>
          </button>

          {/* Phone Support */}
          <button
            onClick={handlePhone}
            className="group w-full rounded-xl border-2 border-border bg-white dark:bg-dark-card-elevated p-4 text-left transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition-all group-hover:scale-110 group-hover:bg-blue-500">
                <Phone className="h-6 w-6 text-blue-600 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <div className="font-ui mb-1 font-semibold text-heading-dark dark:text-dark-text">Phone Support</div>
                <div className="font-sans text-sm text-body-text dark:text-dark-muted">+1 (234) 567-890</div>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400 transition-all group-hover:text-blue-600" />
            </div>
          </button>
        </div>

        {/* Support Hours */}
        <div className="rounded-lg border border-border bg-light-gray dark:bg-dark-hover p-4">
          <p className="font-sans text-sm text-body-text dark:text-dark-muted">
            <span className="font-semibold text-heading-dark dark:text-dark-text">Support Hours:</span> Monday - Friday, 9:00 AM - 6:00 PM EST
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
