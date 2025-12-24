import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ExternalLink, BookOpen, AlertCircle, MessageCircle, Sparkles } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
}

interface ToolCardProps {
  tool: Tool;
  onOpenTutorial: (tool: Tool) => void;
  onReportIssue: (tool: Tool) => void;
  onContactHelp: (tool: Tool) => void;
}

export default function ToolCard({
  tool,
  onOpenTutorial,
  onReportIssue,
  onContactHelp,
}: ToolCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Border Beam */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -left-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-border-beam" />
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 to-tertiary/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative p-6">
        {/* Tool Header */}
        <div className="mb-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-tertiary/20 transition-transform duration-500 group-hover:scale-110">
              <Sparkles className="h-6 w-6 text-primary" strokeWidth={2} />
            </div>
            
            <Button
              onClick={() => window.open(tool.url, '_blank')}
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-lg bg-transparent p-0 text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" strokeWidth={2} />
            </Button>
          </div>

          <h3 className="mb-2 text-xl font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
            {tool.name}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {tool.description}
          </p>
        </div>

        {/* Actions - Slide up on hover */}
        <div
          className={`transition-all duration-500 ${
            isHovered ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="grid grid-cols-3 gap-2 border-t border-border/50 pt-4">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onOpenTutorial(tool);
              }}
              variant="ghost"
              size="sm"
              className="flex h-auto flex-col items-center gap-2 rounded-xl bg-transparent py-3 text-card-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary"
            >
              <BookOpen className="h-5 w-5" strokeWidth={2} />
              <span className="text-xs font-medium">Tutorial</span>
            </Button>
            
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onReportIssue(tool);
              }}
              variant="ghost"
              size="sm"
              className="flex h-auto flex-col items-center gap-2 rounded-xl bg-transparent py-3 text-card-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary"
            >
              <AlertCircle className="h-5 w-5" strokeWidth={2} />
              <span className="text-xs font-medium">Report</span>
            </Button>
            
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onContactHelp(tool);
              }}
              variant="ghost"
              size="sm"
              className="flex h-auto flex-col items-center gap-2 rounded-xl bg-transparent py-3 text-card-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={2} />
              <span className="text-xs font-medium">Help</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
