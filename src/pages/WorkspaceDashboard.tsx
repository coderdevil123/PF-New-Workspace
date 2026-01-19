import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Palette, Megaphone, Settings, Sparkles, CheckCircle2, Users, TrendingUp, Shield, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeAwareImage from '../components/ThemeAwareImage';
import LogoLoop from '../components/LogoLoop';
// import { toolsData } from '../data/tools';

const features = [
  {
    icon: CheckCircle2,
    title: 'Centralized Access',
    description: 'All your tools in one unified platform',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together seamlessly across departments',
  },
  {
    icon: TrendingUp,
    title: 'Boost Productivity',
    description: 'Increase efficiency by up to 40%',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security for your data',
  },
];

export default function WorkspaceDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { effectiveTheme } = useTheme();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [isPreviewHovered, setIsPreviewHovered] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  type Tool = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  image?: string;
};

  /* ---------------- FETCH TOOLS ---------------- */
  useEffect(() => {
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

    loadTools();
  }, []);

  /* ---------------- GROUP BY CATEGORY ---------------- */
  const safeTools = Array.isArray(tools) ? tools : [];

  const groupedTools = safeTools.reduce((acc: any, tool: any) => {
    if (!tool?.category) return acc;

    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);

    return acc;
  }, {} as Record<string, any[]>);


  /* ---------------- BUILD CATEGORIES ---------------- */
  const categories = [
    {
      id: 'productivity',
      title: 'Productivity',
      description: 'Team collaboration, knowledge management, and task tracking',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      tools: (groupedTools.productivity || []).slice(0, 4),
      allTools: (groupedTools.productivity || []).map((t: Tool) => t.name),
      image: groupedTools.productivity?.[0]?.image || '/images/productivity.jpg',
    },
    {
      id: 'content',
      title: 'Content Creation',
      description: 'Create, edit, analyze, and improve content',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      tools: (groupedTools.content || []).slice(0, 4),
      allTools: (groupedTools.content || []).map((t: Tool) => t.name),
      image: groupedTools.content?.[0]?.image || '/images/content.jpg',
    },
    {
      id: 'design',
      title: 'Design',
      description: 'UI/UX design, prototyping, and creative work',
      icon: Palette,
      color: 'from-orange-500 to-red-500',
      tools: (groupedTools.design || []).slice(0, 4),
      allTools: (groupedTools.design || []).map((t: Tool) => t.name),
      image: groupedTools.design?.[0]?.image || '/images/design.jpg',
    },
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Customer engagement, CRM, and analytics',
      icon: Megaphone,
      color: 'from-green-500 to-emerald-500',
      tools: (groupedTools.marketing || []).slice(0, 4),
      allTools: (groupedTools.marketing || []).map((t: Tool) => t.name),
      image: groupedTools.marketing?.[0]?.image || '/images/marketing.jpg',
    },
    {
      id: 'operations',
      title: 'Operations',
      description: 'Infrastructure, automation, and backend systems',
      icon: Settings,
      color: 'from-indigo-500 to-blue-500',
      tools: (groupedTools.operations || []).slice(0, 4),
      allTools: (groupedTools.operations || []).map((t: Tool) => t.name),
      image: groupedTools.operations?.[0]?.image || '/images/operations.jpg',
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Workspace Tools | Pristine Forests';
  }, []);

  const handleCategoryHover = (categoryId: string | null) => {
    setHoveredCategory(categoryId);
    setHoveredTool(null);
  };

  const handleToolClick = (url: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    window.open(url, '_blank');
  };

  if (!Array.isArray(tools)) {
    return (
      <div className="text-center text-muted-text mt-20">
        Loading tools…
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white dark:bg-dark-bg">
      {/* Hero Section - Only show if not authenticated */}
      {!isAuthenticated && (
      <section className="relative overflow-hidden bg-forest-gradient px-6 py-20 lg:px-12 lg:py-32">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }} />
        </div>
        
        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm animate-slide-down">
                <Sparkles className="h-4 w-4" />
                Trusted by 100+ teams
              </div>
              
              <h1 className="font-display text-5xl font-normal leading-tight text-white animate-slide-up lg:text-6xl" style={{ animationDelay: '0.1s' }}>
                Work smarter with
                <br />
                <span className="text-mint-accent">
                  integrated tools
                </span>
              </h1>
              
              <p className="font-sans text-lg leading-relaxed text-white/80 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Access all your essential tools in one centralized platform. 
                Streamline workflows, boost productivity, and collaborate seamlessly.
              </p>

              <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <Button 
                  size="lg" 
                  className="font-ui h-12 rounded-full bg-mint-accent px-8 text-base font-medium text-forest-dark shadow-lg shadow-mint transition-all hover:bg-mint-accent/90 hover:scale-105"
                  onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="font-ui h-12 rounded-full border-2 border-white/30 bg-white/10 px-8 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50 hover:scale-105"
                >
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Desktop Animation */}
            <div className="relative hidden lg:block animate-slide-left" style={{ animationDelay: '0.4s' }}>
              <div className="relative aspect-square w-full max-w-lg">
                <div className="absolute inset-0 rounded-3xl bg-mint-accent/10 blur-3xl" />
                <div className="relative grid grid-cols-2 gap-4 p-8">
                  {[
                    { icon: Zap, delay: '0s' },
                    { icon: Palette, delay: '0.1s' },
                    { icon: Megaphone, delay: '0.2s' },
                    { icon: Settings, delay: '0.3s' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className="mint-corner-accent aspect-square rounded-2xl border border-border bg-white p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-float"
                        style={{ animationDelay: item.delay }}
                      >
                        <div className="flex h-full flex-col justify-between">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-soft-mint">
                            <Icon className="h-6 w-6 text-forest-green" strokeWidth={1.5} />
                          </div>
                          <div>
                            <div className="mb-2 h-2 w-3/4 rounded bg-light-gray" />
                            <div className="h-2 w-1/2 rounded bg-border-gray" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Animation - Floating Blocks */}
            <div className="relative mt-12 h-64 lg:hidden">
              <div className="absolute inset-0 overflow-hidden">
                {/* Animated floating blocks */}
                {[...Array(12)].map((_, i) => {
                  const size = Math.random() * 60 + 40;
                  const left = Math.random() * 100;
                  const animationDuration = Math.random() * 10 + 15;
                  const animationDelay = Math.random() * 5;
                  const opacity = Math.random() * 0.15 + 0.05;
                  
                  return (
                    <div
                      key={i}
                      className="absolute rounded-lg bg-white/20 blur-md"
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `${left}%`,
                        bottom: '-20%',
                        opacity: opacity,
                        animation: `floatUp ${animationDuration}s linear infinite`,
                        animationDelay: `${animationDelay}s`,
                      }}
                    />
                  );
                })}
              </div>
              
              {/* Center icon */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-mint-accent shadow-2xl shadow-mint animate-float">
                  <Sparkles className="h-12 w-12 text-forest-dark" strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Features Section with LogoLoop - Only show if not authenticated */}
      {!isAuthenticated && (
      <section className="border-y border-border bg-light-gray dark:bg-dark-card px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <LogoLoop
            logos={features.map((feature, index) => ({
              node: (
                <div className="group text-center px-8">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-soft-mint dark:bg-mint-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-mint-accent group-hover:shadow-md">
                    <feature.icon className="h-7 w-7 text-forest-green dark:text-mint-accent transition-colors group-hover:text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-ui mb-2 text-lg font-semibold text-heading-dark dark:text-dark-text whitespace-nowrap">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-sm text-body-text dark:text-dark-muted max-w-[200px]">
                    {feature.description}
                  </p>
                </div>
              ),
              title: feature.title,
            }))}
            speed={40}
            direction="left"
            logoHeight={180}
            gap={60}
            hoverSpeed={10}
            scaleOnHover={false}
            fadeOut={true}
            fadeOutColor={effectiveTheme === 'dark' ? '#141C1A' : '#F6F8F7'}
            ariaLabel="Platform features"
          />
        </div>
      </section>
      )}

      {/* Categories Section with Interactive Preview */}
      <section id="categories" className="px-6 py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center animate-slide-up">
            <h2 className="font-display mb-4 text-4xl font-normal text-heading-dark dark:text-dark-text">
              Explore by Category
            </h2>
            <p className="font-sans mx-auto max-w-2xl text-lg text-body-text dark:text-dark-muted">
              Discover tools organized by function to help you work smarter and faster
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Categories List */}
            <div className="space-y-4">
              {categories.map((category, index) => {
                const Icon = category.icon;
                const isHovered = hoveredCategory === category.id;
                
                return (
                  <div
                    key={category.id}
                    className="mint-corner-accent group cursor-pointer rounded-2xl border border-border bg-white dark:bg-dark-card p-6 shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1 animate-slide-right"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onMouseEnter={() => handleCategoryHover(category.id)}
                    onClick={() => navigate(`/workspace/${category.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-soft-mint dark:bg-mint-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-mint-accent group-hover:shadow-md">
                        <Icon className="h-7 w-7 text-forest-green dark:text-mint-accent group-hover:text-white" strokeWidth={1.5} />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-display mb-2 text-xl font-normal text-heading-dark dark:text-dark-text transition-colors group-hover:text-forest-green dark:group-hover:text-mint-accent">
                          {category.title}
                        </h3>
                        <p className="font-sans mb-3 text-sm leading-relaxed text-body-text dark:text-dark-muted">
                          {category.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {category.allTools.map((toolName: string, idx: number) => {
                            const tool = tools.find(t => t.name === toolName);
                            return (
                              <span
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (tool) {
                                    window.open(tool.url, '_blank');
                                  }
                                }}
                                className="font-ui cursor-pointer rounded-full border border-mint-accent/30 bg-soft-mint dark:bg-mint-accent/10 px-2.5 py-1 text-xs font-medium text-forest-green dark:text-mint-accent transition-all hover:scale-105 hover:bg-mint-accent hover:text-white hover:border-mint-accent"
                              >
                                {toolName}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <ArrowRight className="h-5 w-5 flex-shrink-0 text-muted-text dark:text-dark-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-mint-accent" strokeWidth={1.5} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Preview Panel */}
            <div className="sticky top-24 hidden h-fit lg:block">
              <div 
                className="overflow-hidden rounded-2xl border border-border bg-white dark:bg-dark-card shadow-card"
                onMouseEnter={() => setIsPreviewHovered(true)}
                onMouseLeave={() => {
                  setIsPreviewHovered(false);
                  setHoveredTool(null);
                }}
              >
                {hoveredCategory || isPreviewHovered ? (
                  <div className="animate-scale-in">
                    {categories.map((category) => {
                      if (category.id !== hoveredCategory) return null;
                      const Icon = category.icon;
                      
                      return (
                        <div key={category.id}>
                          {/* Category Header */}
                          <div className="relative h-64 overflow-hidden bg-light-gray">
                            <img
                              src={category.image}
                              alt={category.title}
                              className="h-full w-full object-cover opacity-70 transition-all duration-700 hover:scale-110 hover:opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-forest-dark/40 to-transparent" />
                            <div className="absolute bottom-6 left-6">
                              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-mint-accent shadow-md">
                                <Icon className="h-6 w-6 text-white" strokeWidth={1.5} />
                              </div>
                              <h3 className="font-display text-2xl font-normal text-white">
                                {category.title}
                              </h3>
                            </div>
                          </div>

                          {/* Tools Grid */}
                          <div className="p-6">
                            <p className="font-sans mb-4 text-body-text dark:text-dark-muted">
                              {category.description}
                            </p>
                            
                            <div className="mb-4">
                              <h4 className="font-ui mb-3 text-sm font-semibold text-heading-dark dark:text-dark-text">
                                Available Tools
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                {category.tools.map((tool: Tool, idx: number) => (
                                  <div
                                    key={idx}
                                    className="group/tool relative cursor-pointer overflow-hidden rounded-xl border border-border bg-white dark:bg-dark-card transition-all duration-300 hover:border-mint-accent/50 hover:shadow-md"
                                    onMouseEnter={() => setHoveredTool(tool.name)}
                                    onMouseLeave={() => setHoveredTool(null)}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToolClick(tool.url);
                                    }}
                                  >
                                    {/* Tool Image */}
                                    <div className="relative h-24 overflow-hidden bg-white dark:bg-dark-hover">
                                      <ThemeAwareImage
                                        lightSrc={tool.image || '/images/tool-placeholder.png'}
                                        darkSrc={tool.image || '/images/tool-placeholder.png'}
                                        alt={tool.name}
                                        className="h-full w-full"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 to-transparent" />
                                      
                                      {/* External Link Icon */}
                                      <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-mint-accent opacity-0 shadow-md transition-all duration-300 group-hover/tool:opacity-100">
                                        <ExternalLink className="h-3 w-3 text-white" strokeWidth={2} />
                                      </div>
                                    </div>

                                    {/* Tool Info */}
                                    <div className="p-3">
                                      <h5 className="font-ui mb-1 text-sm font-semibold text-heading-dark dark:text-dark-text transition-colors group-hover/tool:text-forest-green dark:group-hover/tool:text-mint-accent">
                                        {tool.name}
                                      </h5>
                                      <p className="font-sans text-xs text-muted-text dark:text-dark-muted">
                                        {tool.description}
                                      </p>
                                    </div>

                                    {/* Hover Effect Border */}
                                    <div className="absolute inset-0 rounded-xl border-2 border-mint-accent opacity-0 transition-opacity duration-300 group-hover/tool:opacity-100" />
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Button
                              className="font-ui w-full rounded-full bg-mint-accent text-forest-dark font-medium hover:bg-mint-accent/90 hover:shadow-md transition-all"
                              onClick={() => navigate(`/workspace/${category.id}`)}
                            >
                              View All {category.title} Tools
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-96 items-center justify-center p-8 text-center">
                    <div>
                      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-soft-mint">
                        <Sparkles className="h-8 w-8 text-forest-green" />
                      </div>
                      <p className="font-sans text-body-text dark:text-dark-muted">
                        Hover over a category to see preview
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Only show if not authenticated */}
      {!isAuthenticated && (
      <section className="border-y border-border bg-white dark:bg-dark-card px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: 'Active Tools', value: '50+' },
              { label: 'Categories', value: '5' },
              { label: 'Team Members', value: '100+' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat, index) => (
              <div key={index} className="relative text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                {index < 3 && <div className="absolute right-0 top-1/2 h-12 w-px -translate-y-1/2 bg-border-gray" />}
                <div className="font-display mb-2 text-4xl font-normal text-forest-green">{stat.value}</div>
                <div className="font-ui text-sm font-medium text-muted-text">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

    </div>
  );
}
