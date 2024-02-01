import { cn } from "@/utils/cn/cn"

type ButtonProps = {
  children?: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button = ({
  children,
  className,
  ...props
}:ButtonProps) => {
  return (
    <button className={cn('bg-neutral-950 text-white p-4 rounded-md flex gap-4 w-fit items-center', className)} {...props}>
    {children}
  </button>
  )
}