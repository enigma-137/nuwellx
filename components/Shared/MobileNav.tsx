import {
    Sheet,
    SheetContent,
    
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Image from "next/image"
import { Separator } from "../ui/separator"
import NavItems from "./NavItems"
  

const MobileNav = () => {
  return (
    <nav className="md:hidden">
        <Sheet>
  <SheetTrigger className="align-middle">
    <Menu className="cursor-pointer"/>
     </SheetTrigger>
  <SheetContent className="flex flex-col gap-6 bg-white md:hidden">
    <Image src="/logo.png" alt="logo" width={129} height={585} />
    <Separator className="border border-gray-100"/>
    <NavItems />
  </SheetContent>
</Sheet>

    </nav>
  )
}

export default MobileNav