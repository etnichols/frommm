export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full py-4 bg-white/80 backdrop-blur-sm flex justify-center">
      <div className="flex space-x-2 text-sm text-slate-500 items-center justify-center">
        <div>Frommm???</div>
        <div>&#9400;&nbsp;{new Date().getFullYear()}</div>
      </div>
    </footer>
  )
}
