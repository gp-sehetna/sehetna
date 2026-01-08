

export default function Home() {
  return (
    <div className="m-5 space-y-5">

      {/* This doesn't work */}
      <h1 className="font-heading text-3xl bg-green">
        Space Grotesk Heading
      </h1>

      <p className="font-body  text-secondary-500">Plus Jakarta Body</p>

      {/* This works */}
      <div className=" bg-primary text-white p-4">Primary</div>
      <div className="text-secondary-500">Secondary</div>
      <div className="text-neutral-900">Neutral</div>
      <div className=" text-green-300">Green</div>
    </div>
  );
}
