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
        <div className="w-full" style={{height: "560px"}}>
          <img src="/landing.webp" alt="shipping containers" className="w-full h-full object-cover object-top" />
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

      <section className="bg-green-100 text-black py-32 relative">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl font-bold mb-8">Get Involved</h2>
        <p className="text-lg mb-10">Join our community and stay connected. Follow us for the latest updates!</p>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-10 mb-10">
          <a href="" className="bg-black flex justify-center items-center text-white py-3 px-6 text-lg rounded-lg hover:bg-gray-700 transition-colors">
            <DiscordLogoIcon style={{width: '20px', height: '20px'}} className="mr-2" />
            Join Discord
          </a>
          <a href="https://x.com/PomereneNetwork" className="bg-black text-white flex justify-center items-center py-3 px-6 text-lg rounded-lg hover:bg-gray-700 transition-colors">
            <TwitterLogoIcon style={{width: '20px', height: '20px'}} className="mr-2" />
            Follow on Twitter
          </a>
        </div>
      </div>
      <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {avatars.map((avatar, index) => (
          <img key={index} src={avatar} alt={`User ${index}`} className="w-16 h-16 rounded-full opacity-70 hover:opacity-100 transition-opacity"
            style={{
              animation: `float-${index} 20s ease-in-out infinite alternate`,
              position: 'absolute',
              top: `${10 + (index * 16) % 70}%`, // Keeping avatars within the top 70% of the section
              left: `${10 + (index * 20) % 80}%`
            }} />
        ))}
      </div>
    </section>

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
