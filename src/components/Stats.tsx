type Stat = {
  prompt: string;
  value: string;
};

interface StatsProps {
  stats: [Stat, Stat, Stat];
}

const Stats = ({ stats }: StatsProps) => {
  return (
    <dl className="rounded-lg bg-white shadow-lg dark:bg-slate-800 sm:grid sm:grid-cols-3">
      <div className="flex flex-col border-b border-gray-100 p-6 text-center dark:border-slate-700 sm:border-0 sm:border-r">
        <dt className="order-2 mt-2 font-medium leading-6 text-gray-500 dark:text-slate-400 md:text-lg">
          {stats[0].prompt}
        </dt>
        <dd className="order-1 text-3xl font-bold tracking-tight text-indigo-600 dark:text-slate-100 md:text-5xl">
          {stats[0].value}
        </dd>
      </div>
      <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
        <dt className="order-2 mt-2 font-medium leading-6 text-gray-500 dark:text-slate-400 md:text-lg">
          {stats[1].prompt}
        </dt>
        <dd className="order-1 text-3xl font-bold tracking-tight text-indigo-600 dark:text-slate-100 md:text-5xl">
          {stats[1].value}
        </dd>
      </div>
      <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
        <dt className="order-2 mt-2 font-medium leading-6 text-gray-500 dark:text-slate-400 md:text-lg">
          {stats[2].prompt}
        </dt>
        <dd className="order-1 text-3xl font-bold tracking-tight text-indigo-600 dark:text-slate-100 md:text-5xl">
          {stats[2].value}
        </dd>
      </div>
    </dl>
  );
};

export default Stats;
