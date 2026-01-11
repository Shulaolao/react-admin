const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full h-full" id='main-container'>
      {children}
    </div>
  )
}

export default Main
