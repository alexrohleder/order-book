import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-between gap-4 p-12">
      <div className="flex-1 flex flex-col gap-4 justify-center items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Welcome to the Orderbook!</h1>
          <p>
            This is a sample orderbook application implemented with{" "}
            <br className="hidden lg:block" />
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
      <p>
        Made with ❤️ by{" "}
        <a
          href="https://alexrohleder.com"
          target="_blank"
          rel="noreferrer"
          className="text-purple-300"
        >
          Alex Rohleder
        </a>
      </p>
    </div>
  );
}
