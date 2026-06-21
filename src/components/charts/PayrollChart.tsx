import { PayrollRecord } from '../../types';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatMoney } from '../../utils';

interface PayrollChartProps {
  data: PayrollRecord[];
}

const PayrollChart = ({ data }: PayrollChartProps) => {
  const chartData = data.map((item) => ({
    month: item.month,
    发放金额: item.totalAmount / 10000,
    发放人数: item.actualPayCount,
    应发人数: item.totalWorkers,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}万`}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '12px',
            }}
            formatter={(value: number, name: string) => {
              if (name === '发放金额') return [`${value.toFixed(2)}万元`, name];
              return [`${value}人`, name];
            }}
          />
          <Legend 
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
          />
          <Bar
            yAxisId="left"
            dataKey="发放金额"
            fill="#3a6b9d"
            radius={[4, 4, 0, 0]}
            barSize={36}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="发放人数"
            stroke="#f39c12"
            strokeWidth={2.5}
            dot={{ fill: '#f39c12', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="应发人数"
            stroke="#94a3b8"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={{ fill: '#94a3b8', strokeWidth: 1, r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PayrollChart;
