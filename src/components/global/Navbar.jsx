import React from 'react'
import Image from 'next/image'
import logo from '@/asserts/logo.png'
import Link from 'next/link'
import {MenuIcon} from 'lucide-react'
const Navbar= async()=> {
  return (
    <header className='fixed right-0 left-0 top-0 py-4 px-4 bg-black/40 blackdrop-blur-lg z-[100] flex items-center border-b-[1px] border-neutral-900 justify-between'>
<aside className='flex items-center gap-[2px]'><Image src={logo} alt='logo' className='shadow-sm ' width={26} height={26}></Image><p className='text-3xl font-bold'>pvs</p></aside><nav className='absolute left-[50%] translate-x-[-50%] translate-y-[-50%] hidden md:block'>
<ul className='flex items-center gap-4 list-none'>
    <li>
        <Link href='/dashboard'>Products</Link>
    </li>
    <li>
        
        <Link href='#'>Resources</Link>
    </li>
    <li>
        <Link href='#'>Documentations</Link>
    </li>
     <li>
        <Link href='#'>Enterprise</Link>
    </li>
</ul>
</nav>
<aside className='flex items-center gap-4'>
<Link href='/dashboard' className='relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'>
<span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]'/>
<span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl'>
    {true ? 'Dashboard' : 'Get Started'}
</span>

</Link>

<MenuIcon className='md:hidden'/>
</aside>
    </header>
  )
}

export default Navbar