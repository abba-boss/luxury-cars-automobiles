import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StatusChartProps {
  data: Array<{
    status: string;
    count: number;
  }>;
  loading?: boolean;
}

const COLORS = {
  available: '#10b981', // green
  sold: '#3b82f6',      // blue
  reserved: '#f59e0b',  // amber
  inactive: '#ef4444'   // red
};

const STATUS_LABELS = {
  available: 'Available',
  sold: 'Sold',
  reserved: 'Reserved',
  inactive: 'Inactive'
};

export function StatusChart({ data, loading }: StatusChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formattedData = data.map(item => ({
    ...item,
    name: STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] || item.status,
    fill: COLORS[item.status as keyof typeof COLORS] || '#6b7280'
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
