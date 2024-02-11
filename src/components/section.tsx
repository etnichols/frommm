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
    <div className="flex flex-col gap-8 items-center pt-8 p-4 min-h-screen lg:min-h-72">
      {withImage && <div className="placeholder-image w-full h-48 bg-slate-900"></div>}
      <h1 className="flex text-xl text-center mx-8">{headline}</h1>
      {children}
    </div>
  )
}
