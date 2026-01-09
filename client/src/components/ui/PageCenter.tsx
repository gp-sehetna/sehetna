
const PageCenter = ({children} : {children: React.ReactNode}) => {
  return (
    <div className=" h-screen text-primary  font-bold text-xl w-full flex items-center justify-center">
        {children}
    </div>
  )
}

export default PageCenter