
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ArrowRightIcon, TwitterLogoIcon, GitHubLogoIcon, DiscordLogoIcon, HamburgerMenuIcon, Cross1Icon, ArrowTopRightIcon } from '@radix-ui/react-icons'
import { useState, useEffect } from "react"
import { CalendarDaysIcon, HandRaisedIcon } from '@heroicons/react/24/outline'

export default function Root() {
  const [mobileMenu, setMobileMenu] = useState(false)

  useEffect(() => {
    if (mobileMenu) {
      document.body.classList.add("overflow-y-hidden")
    } else {
      document.body.classList.remove("overflow-y-hidden")
    }
  })

  const avatars = [
    "/avatar1.jpg",
    "/avatar2.jpg",
    "/avatar3.jpg",
    "/avatar4.jpg",
    "/avatar5.jpg",
  ];

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
            <a href="https://x.com/PomereneNetwork">
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
          <HamburgerMenuIcon onClick={() => setMobileMenu(true)} className={"bg-green-600 text-white p-2 rounded-full" + (mobileMenu ? " hidden" : "")} style={{width: '35px', height: '35px'}} />
          <Cross1Icon onClick={() => setMobileMenu(false)} className={"bg-green-600 text-white p-2 rounded-full" + (mobileMenu ? "" : " hidden")} style={{width: '35px', height: '35px'}} />
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
        <div className="bg-green-200 bg-gradient-to-r from-green-200 to-green-800 border-br-rounded flex justify-between flex-col min-h-72 text-black p-6 rounded-br-3xl">
          <h2 className="text-sm">Earn rewards with Pomerene</h2>
          <div className="flex justify-end">
          <button className="bg-green-500 text-white rounded-full p-4">
            <ArrowTopRightIcon style={{height: "20px", width: "20px"}}/>
          </button>
          </div>
        </div>
      </div>

      <div className="bg-green-100 flex flex-col w-full bg-green-100 justify-center items-center">
        <div className="px-4 pt-10 pb-10 md:pb-44">
          <h1 className="font-serif text-green-600 w-full md:text-center text-6xl md:text-8xl">Pomerene</h1>
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
      </div>
      <div className="p-48 rounded flex flex-col bg-white w-100 max-h-96 mt-4 md:mt-6 justify-center items-center">
        <h1 className="font-serif text-black text-5xl">Securing $13 Trillion in Global Trade</h1>
      </div>
      <div className="lg:px-20 p-8 font-sans bg-green-100 text-black flex flex-col md:flex-row-reverse min-h-96 w-100 mt-20 md:mt-6 justify-center items-center">
        <img src="/containers.jpg" alt="shipping containers" className="w-full md:w-1/2 rounded-br-3xl relative -top-24" />
        <div className="w-full md:w-1/2 flex-col flex relative -top-20 justify-between md:justify-start items-center md:items-start">
          <div className="w-full mt-6 md:mt-0 flex justify-center items-center md:justify-start">
            <img src="/container.png" alt="container" width="50" height="50" className="mr-3 bg-yellow-100 rounded-full" />
            <h3 className="text-2xl">Shared Data Standard.</h3>
          </div>
          <div className="w-full flex justify-center items-center mt-6 md:justify-start">
            <img src="/container.png" alt="container" width="50" height="50" className="mr-3 bg-yellow-100 rounded-full" />
            <h3 className="text-2xl">Network of Connected Devices.</h3>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-between relative -top-20 md:justify-start items-center md:items-start">
          <div className="w-full flex justify-center items-center mt-6 md:mt-0 md:justify-start">
            <img src="/container.png" alt="container" width="50" height="50" className="mr-3 bg-yellow-100 rounded-full" />
            <h3 className="text-2xl">Smart Economic Stack.</h3>
          </div>
          <div className="w-full flex items-center justify-center mt-6 md:justify-start">
            <img src="/container.png" alt="container" width="50" height="50" className="mr-3 bg-yellow-100 rounded-full" />
            <h3 className="text-2xl">Authenticated Inventory Tracking.</h3>
          </div>
        </div>
      </div>
      <div className="p-8 md:px-20 font-sans text-black gap-6 flex flex-col md:flex-row min-h-96 w-100 mt-20 md:mt-6 justify-start items-start">
        <img src="/shipping.jpg" alt="container ships" className="w-full md:w-1/2 rounded-bl-3xl relative -top-44 md:-top-28" />
        <div className="w-full md:w1/2 relative -top-36 md:top-32">
          <h4 className="uppercase mb-2">Use the network</h4>
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
      </div>
      <div className="p-8 md:px-20 bg-green-100 font-sans text-black gap-6 flex flex-col md:flex-row-reverse min-h-96 w-100 mt-20 md:mt-6 justify-start items-start">
        <img src="/shipping2.jpg" alt="container ships" className="w-full md:w-1/2 rounded-br-3xl relative -top-44 md:-top-28" />
        <div className="w-full md:w1/2 relative -top-36 md:top-32">
          <h4 className="uppercase mb-2">Project overview</h4>
          <h2 className="text-2xl">Explore Pomerene.</h2>
          <h3 className="text-lg">Track your shipments</h3>
          <p>
            Pomerene is an open source and user-owned network. Businesses use your data and you are rewarded.
          </p>
          <Link to="/explore" className="uppercase flex items-center md:justify-center w-full mt-8">
            Get connected
            <ArrowRightIcon style={{width: "20px", height: "20px"}} /> 
          </Link>
        </div>
      </div>
      <div className="p-8 md:px-20 font-sans text-black gap-6 flex flex-col md:flex-row min-h-96 w-100 mt-20 md:mt-6 justify-start items-start">
        <img src="/shipping2.jpg" alt="container ships" className="w-full md:w-1/2 rounded-br-3xl relative -top-44 md:-top-28" />
        <div className="w-full md:w1/2 relative -top-36 md:top-32">
          <h4 className="uppercase mb-2">Project overview</h4>
          <h2 className="text-2xl">Explore Pomerene.</h2>
          <h3 className="text-lg">Track your shipments</h3>
          <p>
            Pomerene is an open source and user-owned network. Businesses use your data and you are rewarded.
          </p>
          <Link to="/explore" className="uppercase flex items-center md:justify-center w-full mt-8">
            Get connected
            <ArrowRightIcon style={{width: "20px", height: "20px"}} /> 
          </Link>
        </div>
      </div>

      <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            <div className="max-w-xl lg:max-w-lg">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Sign up for news and updates.</h2>
              <p className="mt-4 text-lg leading-8 text-gray-300">
                Get the latest from Pomerene sent straight to your inbox.
              </p>
              <div className="mt-6 flex max-w-md gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="flex-none rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
          <div
            className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-green-200 to-green-500 opacity-30"
            style={{
              clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      <footer className="bg-black text-white p-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="w-full md:w-auto text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm">&copy; {new Date().getFullYear()} Pomerene. All rights reserved.</p>
            </div>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="" className="text-sm hover:text-green-500">
                Terms of use
              </a>
              <a href="" className="text-sm hover:text-green-500">
                Privacy Policy
              </a>
              <a href="" className="text-sm hover:text-green-500">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
