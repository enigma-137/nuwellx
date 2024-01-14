import Link from "next/link"
import { Button } from "../ui/button"
import Image from "next/image"


const Footer = () => {
  return (
   
<footer className="border-t">
<div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 sm:flex-row text-center">
  <Link href="/">
    <Image src="/logo.png" alt="logo" className="h-6 w-16" width={129} height={585} />
  </Link>
  <p className="text-xs">{new Date().getFullYear()} <strong>© Evento.</strong>  All Rights Reserved.</p>
 </div>
</footer>

   
  )
}

export default Footer