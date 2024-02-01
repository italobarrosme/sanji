type  OverlayProps = {
  children?: React.ReactNode

}

export const Overlay = ({
  children
}: OverlayProps) => {

  return (
    <div className="z-10 absolute left-0 top-0 p-8 w-full min-h-screen overflow-y-auto">
      {children}
    </div>
  )
}