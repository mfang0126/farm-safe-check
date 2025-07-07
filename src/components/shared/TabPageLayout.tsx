import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';

interface TabConfig {
  id: string;
  label: string;
  icon?: LucideIcon;
  content: React.ReactNode;
}

interface TabPageLayoutProps {
  title: string;
  description?: string;
  headerActions?: React.ReactNode;
  tabs: TabConfig[];
  defaultTab?: string;
  className?: string;
}

export const TabPageLayout = ({
  title,
  description,
  headerActions,
  tabs,
  defaultTab,
  className = ""
}: TabPageLayoutProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {headerActions}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full md:w-auto`} style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <TabsTrigger key={id} value={id} className="flex items-center gap-2">
              {Icon && <Icon size={16} />}
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(({ id, content }) => (
          <TabsContent key={id} value={id} className="space-y-6">
            {content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}; 