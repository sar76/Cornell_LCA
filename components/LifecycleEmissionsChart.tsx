import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { LifecycleEmissions } from '../lib/pharmaceuticalData';

interface LifecycleEmissionsChartProps {
  emissions: LifecycleEmissions;
}

const LifecycleEmissionsChart: React.FC<LifecycleEmissionsChartProps> = ({ emissions }) => {
  const data = [
    { 
      name: 'Raw Materials', 
      value: emissions.rawMaterials, 
      color: '#0ea5e9',
      description: 'Emissions from extraction and processing of raw materials'
    },
    { 
      name: 'Manufacturing', 
      value: emissions.manufacturing, 
      color: '#22c55e',
      description: 'Emissions from production and manufacturing processes'
    },
    { 
      name: 'Transportation', 
      value: emissions.transportation, 
      color: '#f59e0b',
      description: 'Emissions from transportation and distribution'
    },
    { 
      name: 'Use', 
      value: emissions.use, 
      color: '#8b5cf6',
      description: 'Emissions during product use phase'
    },
    { 
      name: 'End of Life', 
      value: emissions.endOfLife, 
      color: '#ef4444',
      description: 'Emissions from disposal and waste treatment'
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          color: '#1f2937'
        }}>
          <p style={{ fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>{data.name}</p>
          <p style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 4px 0' }}>{data.value}% of total emissions</p>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>{data.description}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '16px'
      }}>
        {payload.map((entry: any, index: number) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div 
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: entry.color
              }}
            />
            <span style={{
              fontSize: '14px',
              color: '#374151',
              fontWeight: '500'
            }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        Carbon Emissions by Lifecycle Stage
      </h3>
      <div style={{ width: '100%', height: '320px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <p style={{
          fontSize: '14px',
          color: '#4b5563',
          lineHeight: '1.5',
          margin: '0'
        }}>
          This chart shows the percentage distribution of carbon emissions across the five main lifecycle stages.
          The largest segment represents the stage with the highest environmental impact.
        </p>
      </div>
    </div>
  );
};

export default LifecycleEmissionsChart;
