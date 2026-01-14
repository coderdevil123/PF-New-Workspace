import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, ExternalLink, BookOpen, AlertCircle, MessageCircle, Sparkles, TrendingUp, Users, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import TutorialModal from '../components/TutorialModal';
import ReportIssueModal from '../components/ReportIssueModal';
import ContactHelpModal from '../components/ContactHelpModal';
import ThemeAwareImage from '../components/ThemeAwareImage';
import { toolsData } from '../data/tools';
import { useTheme } from '../contexts/ThemeContext';
import AddToolModal from '../components/AddToolModal';

const categoryData: Record<string, any> = {
  productivity: {
    ...toolsData.productivity,
    tools: toolsData.productivity.tools.map(tool => ({
      ...tool,
      category: 'productivity',
    })),
  },
  content: {
    ...toolsData.content,
    tools: toolsData.content.tools.map(tool => ({
      ...tool,
      category: 'content',
    })),
  },
  design: {
    ...toolsData.design,
    tools: toolsData.design.tools.map(tool => ({
      ...tool,
      category: 'design',
    })),
  },
  marketing: {
    ...toolsData.marketing,
    tools: toolsData.marketing.tools.map(tool => ({
      ...tool,
      category: 'marketing',
    })),
  },
  operations: {
    ...toolsData.operations,
    tools: toolsData.operations.tools.map(tool => ({
      ...tool,
      category: 'operations',
    })),
  },
};

// const oldCategoryData: Record<string, any> = {
//   productivity_old: {
//     title: 'Productivity',
//     description: 'Task management and collaboration tools to streamline your workflow',
//     gradient: 'from-blue-500 to-cyan-500',
//     stats: { tools: 12, users: 450, avgRating: 4.8 },
//     tools_old: [
//     ],
//     allTools: toolsData.marketing.tools.map(t => t.name),
//     image: toolsData.marketing.image,
//   },
//   operations_old: {
//     title: 'Operations',
//     description: 'Business operations and analytics tools for data-driven decisions',
//     gradient: 'from-indigo-500 to-blue-500',
//     stats: { tools: 11, users: 260, avgRating: 4.7 },
//     tools_old: [],
//   },
// };

export default function CategoryDetail() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { effectiveTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [reportIssueOpen, setReportIssueOpen] = useState(false);
  const [contactHelpOpen, setContactHelpOpen] = useState(false);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [addToolOpen, setAddToolOpen] = useState(false);

  const [tools, setTools] = useState<any[]>([]);

  const groupedTools = tools.reduce((acc: any, tool: any) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {});

  const category = categoryId
  ? {
      ...categoryData[categoryId], // keeps title, gradient, stats
      tools: groupedTools[categoryId] || [],
    }
  : null;

  async function loadTools() {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/tools`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    const data = await res.json();
    setTools(data);
  }
  
  useEffect(() => {
    loadTools();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (category) {
      document.title = `${category.title} Tools | Pristine Forests`;
    }
  }, [category]);

  if (!category) {
    return (
      <div className="flex min-h-full items-center justify-center bg-background px-6 py-12">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground">Category not found</h1>
          <Button
            onClick={() => navigate('/workspace')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const filteredTools = category.tools.filter((tool: any) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenTutorial = (tool: any) => {
    setSelectedTool(tool);
    setTutorialOpen(true);
  };

  const handleReportIssue = (tool: any) => {
    setSelectedTool(tool);
    setReportIssueOpen(true);
  };

  const handleContactHelp = (tool: any) => {
    setSelectedTool(tool);
    setContactHelpOpen(true);
  };

  return (
    <div className="min-h-full bg-white dark:bg-dark-bg">
      {/* Hero Header with Animated Background */}
      <section className="relative overflow-hidden bg-forest-gradient px-6 py-16 lg:px-12">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }} />
        </div>
        
        <div className="relative mx-auto max-w-7xl">
          <Button
            onClick={() => navigate('/workspace')}
            variant="ghost"
            className="group mb-8 -ml-3 rounded-lg text-white/90 transition-all hover:bg-white/10 hover:text-white animate-slide-down"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Button>
          <Button
              className="mt-4"
              onClick={() => setAddToolOpen(true)}
            >
              + Add Tool
            </Button>

          <div>
            <h1 className="font-display mb-4 text-5xl font-normal text-white animate-slide-up">
              {category.title}
            </h1>
            <p className="font-sans text-lg text-white/90 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter - Fixed Position */}
      <div className="sticky top-16 z-20 border-b border-border bg-white dark:bg-dark-bg px-6 py-6 shadow-md lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-slide-up">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-text transition-colors" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-full border border-border bg-light-gray dark:bg-dark-card pl-12 pr-4 text-sm text-heading-dark dark:text-dark-text placeholder:text-muted-text dark:placeholder:text-dark-muted transition-all focus:border-mint-accent focus:bg-white dark:focus:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
              />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-mint-accent/30 bg-soft-mint dark:bg-mint-accent/20 px-4 py-2 text-sm font-medium text-forest-green dark:text-mint-accent">
              {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} available
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <section className="px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          {filteredTools.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-body-text dark:text-dark-muted">Loading the Tools... Please Wait...</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool: any, index: number) => (
                <div
                  key={tool.id}
                  className="mint-corner-accent group relative overflow-hidden rounded-2xl border border-border bg-white dark:bg-dark-card shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-card-hover animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setHoveredTool(tool.id)}
                  onMouseLeave={() => setHoveredTool(null)}
                >
                  {/* Tool Image */}
                  <div 
                    className="relative h-48 cursor-pointer overflow-hidden bg-white dark:bg-dark-hover"
                    onClick={() => window.open(tool.url, '_blank')}
                  >
                    <ThemeAwareImage
                      lightSrc={tool.imageLight || tool.image}
                      darkSrc={tool.imageDark || tool.image}
                      alt={tool.name}
                      className="h-full w-full p-8 transition-all duration-700 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/600x400/${category.gradient.includes('blue') ? '3B82F6' : category.gradient.includes('purple') ? '8B5CF6' : category.gradient.includes('orange') ? 'F97316' : category.gradient.includes('green') ? '10B981' : '6366F1'}/FFFFFF?text=${tool.name}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 to-transparent" />
                    
                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(tool.url, '_blank');
                        }}
                        size="sm"
                        className="h-10 w-10 rounded-full bg-mint-accent p-0 text-white shadow-lg shadow-mint transition-all hover:scale-110"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-mint-accent px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      <Sparkles className="h-3 w-3" />
                      {tool.rating}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="font-display mb-2 text-xl font-normal text-heading-dark dark:text-dark-text transition-colors group-hover:text-forest-green dark:group-hover:text-mint-accent">
                        {tool.name}
                      </h3>
                      <p className="font-sans text-sm leading-relaxed text-body-text dark:text-dark-muted">
                        {tool.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="font-ui mb-4 flex items-center gap-4 text-xs text-muted-text dark:text-dark-muted">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{tool.users} users</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Active</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-2 border-t border-border pt-4">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenTutorial(tool);
                        }}
                        variant="ghost"
                        size="sm"
                        className="flex flex-col items-center gap-1 rounded-lg py-3 text-xs text-body-text dark:text-dark-muted transition-all hover:scale-105 hover:bg-soft-mint dark:hover:bg-mint-accent/20 hover:text-forest-green dark:hover:text-mint-accent"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span className="font-ui">Tutorial</span>
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReportIssue(tool);
                        }}
                        variant="ghost"
                        size="sm"
                        className="flex flex-col items-center gap-1 rounded-lg py-3 text-xs text-body-text transition-all hover:scale-105 hover:bg-soft-mint hover:text-forest-green"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-ui">Report</span>
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContactHelp(tool);
                        }}
                        variant="ghost"
                        size="sm"
                        className="flex flex-col items-center gap-1 rounded-lg py-3 text-xs text-body-text transition-all hover:scale-105 hover:bg-soft-mint hover:text-forest-green"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="font-ui">Help</span>
                      </Button>
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className={`pointer-events-none absolute inset-0 rounded-2xl border-2 border-mint-accent opacity-0 transition-opacity duration-300 ${
                    hoveredTool === tool.id ? 'opacity-100' : ''
                  }`} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category Stats */}
      <section className="border-t border-border bg-light-gray dark:bg-dark-card px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Sparkles, label: 'Most Popular', value: filteredTools[0]?.name || 'N/A', color: category.gradient },
              { icon: TrendingUp, label: 'Fastest Growing', value: filteredTools[1]?.name || 'N/A', color: category.gradient },
              { icon: Users, label: 'Most Users', value: `${category.stats.users}+`, color: category.gradient },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-white dark:bg-dark-card p-6 text-center shadow-card transition-all hover:shadow-card-hover animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-soft-mint dark:bg-mint-accent/20">
                    <Icon className="h-6 w-6 text-forest-green dark:text-mint-accent" />
                  </div>
                  <div className="font-display mb-1 text-lg font-normal text-heading-dark dark:text-dark-text">{stat.value}</div>
                  <div className="font-ui text-sm font-medium text-muted-text dark:text-dark-muted">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modals */}
      <TutorialModal
        open={tutorialOpen}
        onOpenChange={setTutorialOpen}
        tool={selectedTool}
      />
      <ReportIssueModal
        open={reportIssueOpen}
        onOpenChange={setReportIssueOpen}
        tool={selectedTool}
      />
      <ContactHelpModal
        open={contactHelpOpen}
        onOpenChange={setContactHelpOpen}
        tool={selectedTool}
      />
      <AddToolModal
        open={addToolOpen}
        category={categoryId}
        onClose={() => setAddToolOpen(false)}
        onSuccess={loadTools}
      />

    </div>
  );
}
