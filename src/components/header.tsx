import { buttonVariants } from '@/components/ui/button'
import { IconSeparator } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import EnvCard from './cards/envcard'

export async function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-white ">
      <EnvCard />
      <Link href="/" rel="nofollow" className="mr-2 font-bold">
        Vergaderingsanalyse AI
      </Link>
      <IconSeparator />
      <Link href="/chat" className={cn(buttonVariants({ variant: 'link' }), 'mr-auto font-normal')}>
        <span className="hidden md:flex">AI Vergaderingsanalyse</span>
      </Link>
    </header>
  )
}
