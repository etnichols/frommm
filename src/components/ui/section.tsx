export function Section({ headline, children }: { headline: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 flex flex-col gap-8 md:items-center w-full">
      <div className="flex flex-col justify-center items-center md:w-9/12 w-full">
        <h1 className="flex text-xl md:text-3xl text-center mx-8 font-semibold tracking-wide mb-8">
          {headline}
        </h1>
        <div className="flex flex-col gap-y-4 w-full items-center">{children}</div>
      </div>
    </div>
  )
}
