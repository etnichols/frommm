export const PageTitle = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <h1 className={`text-lg font-bold text-center ${className}`}>{children}</h1>
}
