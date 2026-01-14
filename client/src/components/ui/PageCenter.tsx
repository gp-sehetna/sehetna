
const PageCenter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen font-bold text-3xl w-full flex items-center justify-center">
      {children}
    </div>
  )
}

export default PageCenter