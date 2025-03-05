import Image from "next/image"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="container relative min-h-screen grid lg:grid-cols-2 items-center gap-12 py-12">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
      <div className="hidden lg:block relative h-full">
        <Image
          src="https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1974&auto=format&fit=crop"
          alt="Authentication background"
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>
    </div>
  )
}