import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ArrowRightIcon, TwitterLogoIcon, GitHubLogoIcon, DiscordLogoIcon, HamburgerMenuIcon, Cross1Icon, ArrowTopRightIcon } from '@radix-ui/react-icons'
import { useState, useEffect } from "react"

export default function Root() {
  const [mobileMenu, setMobileMenu] = useState(false)

  useEffect(() => {
    if (mobileMenu) {
      document.body.classList.add("overflow-y-hidden")
    } else {
      document.body.classList.remove("overflow-y-hidden")
    }
  })

  return (
    <>
      <div className="hidden md:flex bg-green-100 w-full justify-between px-4 py-6 lg:px-20">
        <div className="flex items-center gap-10">
          <Link
            to="/"
          >
            <img src="/white-small.png" alt="Pomerene" className="rounded-full h-10" />
          </Link>
          <div className="flex items-center gap-8">
            <Link to="/about" className="text-sm hover:underline">About</Link>
            <Link to="/contact" className="ml-4 text-sm hover:underline">Contact</Link>
            <Link to="/build" className="ml-4 text-sm hover:underline">Build</Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <a href="https://twitter.com/PomereneNetwork">
              <TwitterLogoIcon style={{width: '20px', height: '20px'}} />
            </a>
            <a href="">
              <DiscordLogoIcon style={{width: '20px', height: '20px'}} />
            </a>
            <a href="https://github.com/russell-brouillard/hack-api">
              <GitHubLogoIcon style={{width: '20px', height: '20px'}} />
            </a>
          </div>
          <Link
            to="/signup"
            className={cn(
              buttonVariants({ variant: "default" }),
              "rounded-full"
            )}
          >
            Sign Up
          </Link>
        </div>
      </div>

      <div className={"md:hidden flex w-full justify-between px-4 py-6" + (mobileMenu ? " bg-black" : " bg-green-100")}>
        <div className="flex items-center gap-3">
          <HamburgerMenuIcon onClick={() => setMobileMenu(true)} className={"bg-green-500 text-white p-2 rounded-full" + (mobileMenu ? " hidden" : "")} style={{width: '35px', height: '35px'}} />
          <Cross1Icon onClick={() => setMobileMenu(false)} className={"bg-green-500 text-white p-2 rounded-full" + (mobileMenu ? "" : " hidden")} style={{width: '35px', height: '35px'}} />
          <Link
            to="/"
          >
            <img src="/white-small.png" alt="Pomerene" className="rounded-full h-10" />
          </Link>
        </div> 
          <Link
            to="/signup"
            className={cn(
              buttonVariants({ variant: mobileMenu ? "outline" : "default" }),
              "rounded-full"
            )}
          >
            Sign Up
          </Link>
      </div>

      <div className={"px-4 bg-black text-white flex flex-col gap-4 relative top-0 left-0 w-screen h-screen overscroll-none" + (mobileMenu ? "" : " hidden")}>
        <ul>
          <li className="py-4 border-b">
            <Link to="/about" className="text-sm hover:underline">About</Link>
          </li>
          <li className="py-4 border-b">
            <Link to="/contact" className="text-sm hover:underline">Contact</Link>
          </li>
          <li className="py-4 border-b">
            <Link to="/build" className="text-sm hover:underline">Build</Link>
          </li>
        </ul>
        <div className="bg-green-200 border-br-rounded flex justify-between flex-col min-h-72 text-black p-6 rounded-br-3xl">
          <h2>Earn rewards with Pomerene</h2>
          <div className="flex justify-end">
          <button className="bg-green-500 text-white rounded-full p-4">
            <ArrowTopRightIcon style={{height: "20px", width: "20px"}}/>
          </button>
          </div>
        </div>
      </div>

      <div className="bg-green-600 flex flex-col w-full bg-green-100 justify-center items-center">
        <div className="px-4 py-10">
          <h1 className="font-serif text-black w-full md:text-center text-6xl md:text-8xl">Pomerene</h1>
          <h2 className="text-black text-xl w-full md:text-center uppercase" style={{wordSpacing: "0.43rem"}}>Triple Entry International Trade</h2>
          <div className="flex justify-center items-center pt-8">
            <Link
              to="/signup"
              className={cn(
                buttonVariants({ variant: mobileMenu ? "outline" : "default" }),
                "rounded-full p-8 text-lg"
              )}
            >
              Get Started
            </Link>
          </div>
          <Link to="/explore" className="uppercase flex items-center md:justify-center w-full mt-8">
            Explore the network
            <ArrowRightIcon style={{width: "20px", height: "20px"}} /> 
          </Link>
        </div>
        <img src="/landing.webp" alt="shipping containers" className="w-full" />
      </div>
      <div className="p-48 rounded flex flex-col w-100 max-h-96 mt-4 md:mt-6 justify-center items-center">
        <h1 className="font-serif text-black text-5xl">Securing $13 Trillion in Global Trade</h1>
      </div>
      <div className="p-8 font-sans bg-green-100 text-black flex flex-col min-h-96 w-100 mt-20 md:mt-6 justify-center items-center">
        <img src="/containers.jpg" alt="shipping containers" className="rounded-br-3xl relative -top-24" />
        <div className="w-full md:flex-row md:pb-10 flex-col flex justify-between xl:justify-around items-center">
          <div className="w-1/2 xl:w-1/3 mt-6">
            <h3 className="text-2xl">Shared Data Standard.</h3>
          </div>
          <div className="w-1/2 xl:w-1/3 mt-6">
            <h3 className="text-2xl">IoT Network of Connected Devices.</h3>
          </div>
        </div>
        <div className="w-full flex md:flex-row flex-col justify-between xl:justify-around items-center">
          <div className="w-1/2 xl:w-1/3 mt-6">
            <h3 className="text-2xl">Base Layer for a Smart Economic Stack.</h3>
          </div>
          <div className="w-1/2 xl:w-1/3 mt-6">
            <h3 className="text-2xl">Authenticated Inventory Tracking System.</h3>
          </div>
        </div>
      </div>
      <div className="p-8 font-sans text-black flex flex-col min-h-96 w-100 mt-20 md:mt-6 justify-start items-start">
        <img src="/containers.jpg" alt="shipping containers" className="rounded-br-3xl relative -top-32" />
        <h4 className="uppercase">Use the network</h4>
        <h2 className="text-2xl">Shipping & Warehouses:</h2>
        <h3 className="text-lg">Track your shipments</h3>
        <p>
          Pomerene is an open source and user-owned network. Businesses use your data and you are rewarded.
        </p>
        <Link to="/explore" className="uppercase flex items-center md:justify-center w-full mt-8">
          Get connected
          <ArrowRightIcon style={{width: "20px", height: "20px"}} /> 
        </Link>
      </div>
    </>
  );
}
