import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Props {
  data: {
    file: string;
    count: number;
  }[];
}

export default function MostImportedFilesChart({
  data,
}: Props) {
  return (
    <div
      style={{
        height: 400,
        marginTop: 24,
      }}
    >
      <h2>
        Most Imported Files
      </h2>

      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart data={data}>
          <XAxis dataKey="file" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}