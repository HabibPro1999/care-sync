
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  percentChange?: number;
  label?: string;
  chartData?: Array<{
    name: string;
    value: number;
  }>;
  className?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  percentChange,
  label,
  chartData,
  className,
}) => {
  const colors = ['#4f46e5', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

  return (
    <Card className={cn("glassmorphism animate-fade-in", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl font-bold">{value}</h3>
          
          {typeof percentChange !== 'undefined' && (
            <div className={cn(
              "flex items-center text-xs font-medium",
              percentChange > 0 
                ? "text-green-600 dark:text-green-400" 
                : percentChange < 0 
                  ? "text-red-600 dark:text-red-400" 
                  : "text-muted-foreground"
            )}>
              {percentChange > 0 ? (
                <ArrowUpIcon className="mr-1 h-3 w-3" />
              ) : percentChange < 0 ? (
                <ArrowDownIcon className="mr-1 h-3 w-3" />
              ) : null}
              {Math.abs(percentChange)}%
            </div>
          )}
        </div>
        
        {label && (
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
        )}
        
        {chartData && chartData.length > 0 && (
          <div className="mt-4 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  hide={true}
                  axisLine={false} 
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(200, 200, 200, 0.2)' }}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                  minPointSize={3}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
