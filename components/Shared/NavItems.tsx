"use client"

import { Links } from "@/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"


const NavItems = () => {

    const pathname = usePathname();
  return (
    <ul className="flex md:flex-between w-full flex-col gap-9 md:flex-row items-start">
        {
             
            Links.map((link) => {
                const isActive = pathname === link.route
                
          return(
            <Link href={link.route}>
            <li key={link.route}
             className={ `${isActive && ' text-primary-500'} flex-center p-medium-16 whitespace-nowrap `}>
                
                {link.label}</li>
             </Link>
          )  }   
            )
        }
        </ul>
  )
}

export default NavItems