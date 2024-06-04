import { useMemo } from 'react';
import { Chart } from 'react-charts';

import type { AxisOptions } from 'react-charts';

type PriceChartData = {
  label: string;
  serie: {
    date: string;
    value: number;
  }[];
}[];

type Datum = { date: Date; value: number };

const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split(' ')[0].split('/').map(Number);
  return new Date(year, month - 1, day);
};

const formatData = (data: PriceChartData) =>
  data.map(({ label, serie }) => ({
    label,
    data: serie.map(({ date, value }) => ({
      date: parseDate(date),
      value,
    })),
  }));

type Props = {
  data: PriceChartData;
};

const PriceChart = ({ data }: Props) => {
  const formattedData = formatData(data);

  const primaryAxis = useMemo(
    (): AxisOptions<Datum> => ({
      getValue: datum => datum.date,
      scaleType: 'localTime',
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<Datum>[] => [
      {
        getValue: datum => datum.value,
        elementType: 'line',
        hardMin: 0,
        formatters: {
          scale: (value: number) => (value ? value.toFixed(2) : ''),
        },
        showDatumElements: true,
      },
    ],
    []
  );

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Chart
        options={{
          data: formattedData,
          primaryAxis,
          secondaryAxes,
        }}
      />
    </div>
  );
};

export default PriceChart;
