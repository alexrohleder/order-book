import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 p-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Welcome to the Orderbook!</h1>
        <p>
          This is a sample orderbook application implemented with <br />
          NextJS, TailwindCSS, Redux and Redux-Saga 🚀
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Link href="/responsive">
          <a className="btn btn--purple px-6 py-2">Open responsive layout</a>
        </Link>
        <Link href="/dashboard">
          <a className="btn btn--purple px-6 py-2">Open dashboard layout</a>
        </Link>
      </div>
    </div>
  );
}
