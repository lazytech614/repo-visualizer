interface Props {
  title: string;
  value: string | number;
}

export default function StatsCard({
  title,
  value,
}: Props) {

  return (
    <div className="rounded-lg border border-white/10 flex-1 px-10 py-4">
      <p>
        {title}
      </p>
      <h2 className="font-bold text-2xl">
        {value}
      </h2>
    </div>
  );
}