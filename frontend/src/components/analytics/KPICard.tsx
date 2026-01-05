import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  format?: 'currency' | 'number' | 'percentage';
  isDemo?: boolean;
}

export function KPICard({ title, value, change, icon, format = 'number', isDemo }: KPICardProps) {
  const formatValue = (val: string | number) => {
    if (val === undefined || val === null) return '0';
    const numVal = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(numVal)) return '0';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(numVal);
      case 'percentage':
        return `${numVal.toFixed(1)}%`;
      default:
        return numVal.toLocaleString();
    }
  };

  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
          {isDemo && <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Demo</span>}
        </CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatValue(value)}
        </div>
        {change !== undefined && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {isPositive && <TrendingUp className="w-3 h-3 mr-1 text-green-500" />}
            {isNegative && <TrendingDown className="w-3 h-3 mr-1 text-red-500" />}
            <span className={cn(
              isPositive && "text-green-500",
              isNegative && "text-red-500"
            )}>
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
            <span className="ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
