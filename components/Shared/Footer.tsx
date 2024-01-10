import Link from "next/link"
import { Button } from "../ui/button"
import Image from "next/image"


const Footer = () => {
  return (
   
<footer className="border-t">
<div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 sm:flex-row text-center">
  <Link href="/">
    <Image src="/logo.png" alt="logo" width={129} height={585} />
  </Link>
  <p className="text-xs">{new Date().getFullYear()} © Evento. All Rights Reserved.</p>
 </div>
</footer>

   
  )
}

export default Footer