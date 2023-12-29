import Footer from "@/components/Shared/Footer"
import Header from "@/components/Shared/Header"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=" flex flex-col h-screen">
    <Header />
      <main className="flex-1" >{children}</main>
      <Footer />
    </div>
       
  
  )
}
