import {SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import NavItems from "./NavItems"
import MobileNav from "./MobileNav"

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between ">
        <Link href="/" className="w-36">
          <Image alt="logo" height={585} width={129} className="" src="/logo.png" />
        </Link>

        <SignedIn>
          <nav className="md:flex-between max-w-xs hidden">
            <NavItems />
          </nav>
        </SignedIn>


          {/* Mobile Nav */}
        <div className="flex w-32 justify-end gap-3">
          <SignedIn>
            <MobileNav />
            <div className="size-10 ">
            <UserButton afterSignOutUrl="/" />
            </div>
         
          </SignedIn>
            
          
          <SignedOut>
            <Button asChild className="rounded-full" size="lg" >
              <Link href="/sign-in">
                Get Started
              </Link>
            </Button>

          </SignedOut>
        </div>
      </div>

    </header>
  )
}

export default Header