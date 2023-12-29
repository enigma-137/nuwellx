import Image from "next/image"
import Link from "next/link"


const Header = () => {
  return (
   <header className="w-full border-b">
<div className="wrapper flex items-center justify-between ">
    <Link href="/" className="w-36">
        <Image alt="logo" height={585} width={129} className="" src="/logo.png" />
    </Link>
    <div className="flex w-32 justify-end gap-3"> 
Login 
</div>
</div>

   </header>
  )
}

export default Header