import { Blocks, Cloud, Grid3X3, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-linear-to-r border-b border-border from-slate-800 via-sky-950 to-slate-900 flex items-center px-4 py-3 gap-4">
      <div className="flex items-center gap-2 text-white">
        <Blocks className="size-8 -rotate-6 text-slate-500" strokeWidth={1.25} />
        <span className="font-semibold text-slate-100 text-3xl tracking-wide">
          tiny<span className="text-slate-400">.iiif</span>
        </span>
      </div>
      
      <div className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input 
            placeholder="Search images..." 
            className="pl-10 py-5 placeholder:tracking-wide border border-white/25 font-light bg-white/10 text-slate-400 placeholder:text-slate-400 focus-visible:ring-white/25 focus-visible:border-white/40"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
          <User className="size-5" strokeWidth={1.25} />
        </Button>
      </div>
    </header>
  )

}