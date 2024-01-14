import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <>
    <section
    className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
      <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
        <div className="flex flex-col justify-center gap-8">
      <h1 className="h1-bold">
        Find, Create and Join Events within and Around your school on <span className="text-primary">EventO!</span>
      </h1>
      <p className="p-regular-20 md:p-regular-24">
        Easily Create and host events, buy popular events tickets, easily reach out to thousands of attendees
      </p>
      <Button asChild size="lg" className="button w-full sm:w-fit  ">
        <Link href="#events">
          Explore Events
        </Link>
      </Button>
        </div>
        <Image 
        height={1000}
        width={1000}
        alt="hero-image"
        src="/assets/images/hero.png"
        className="object-contain max-h-[70vh] object-center 2xl:max-h-[50vh] "
        />
      </div>
    </section>
    </>
  )
}
