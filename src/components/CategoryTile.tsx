import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Category {
  id: string;
  title: string;
  description: string;
  aim: string;
  topTools: string[];
  icon: LucideIcon;
  gradient: string;
}

interface CategoryTileProps {
  category: Category;
  index: number;
}

export default function CategoryTile({ category, index }: CategoryTileProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const Icon = category.icon;

  const handleClick = () => {
    navigate(`/workspace/${category.id}`);
  };

  return (
    <Card
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Animated Border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-tertiary to-primary bg-[length:200%_100%] p-[1px] animate-shimmer">
          <div className="h-full w-full rounded-2xl bg-card" />
        </div>
      </div>

      {/* Glow Effect */}
      <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${category.gradient} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30`} />

      <div className="relative p-8">
        {/* Icon with Gradient Background */}
        <div className="mb-6 flex items-start justify-between">
          <div className={`relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
            <Icon className="h-7 w-7 text-white" strokeWidth={2} />
            
            {/* Pulse Effect */}
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${category.gradient} opacity-0 transition-opacity duration-500 group-hover:animate-ping group-hover:opacity-75`} />
          </div>

          <ArrowUpRight 
            className={`h-5 w-5 text-muted-foreground transition-all duration-300 ${
              isHovered ? 'translate-x-1 -translate-y-1 text-primary' : ''
            }`}
            strokeWidth={2}
          />
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="mb-2 text-2xl font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
            {category.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {category.description}
          </p>
        </div>

        {/* Expanded Content */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            isHovered ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-4 border-t border-border/50 pt-4">
            <p className="text-sm font-medium text-foreground">
              {category.aim}
            </p>
            
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Featured Tools
              </p>
              <div className="flex flex-wrap gap-2">
                {category.topTools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <span>Explore tools</span>
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
