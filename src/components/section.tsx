export function Section({
  headline,
  children,
  withImage,
}: {
  headline: string
  withImage?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-8 md:items-center w-full">
      <div className="flex flex-col justify-center items-center md:max-w-96 gap-y-8">
        <h1 className="flex text-xl md:text-3xl text-center mx-8 font-semibold tracking-wide">
          {headline}
        </h1>
        <div className="flex flex-col md:max-w-96 gap-y-4">{children}</div>
      </div>
    </div>
  )
}
