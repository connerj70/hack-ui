import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { TwitterLogoIcon, GitHubLogoIcon, EnvelopeClosedIcon } from '@radix-ui/react-icons'

export default function Root() {

  return (
    <>
      <div>
        <Link
          to="/"
          className="absolute left-4 top-4 md:left-6 z-10"
        >
          <img src="/white-small.png" alt="Pomerene" className="rounded-full h-10" />
        </Link>
        <Link
          to="/signup"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 z-10"
          )}
        >
          Sign Up
        </Link>
      </div>
      <div className="bg-green-600 flex flex-col w-full py-48 px-8 mt-20 justify-center items-center">
        <h1 className="font-serif text-white w-full md:text-center text-6xl md:text-8xl">Pomerene</h1>
        <h2 className="text-yellow-400 text-xl w-full md:text-center uppercase" style={{wordSpacing: "0.43rem"}}>Triple Entry International Trade</h2>
      </div>
      <div className="p-48 rounded flex flex-col w-100 max-h-96 mt-4 md:mt-6 justify-center items-center">
        <h1 className="font-serif text-black text-5xl">Securing $13 Trillion in Global Trade</h1>
      </div>
      <div className="p-8 font-sans bg-green-600 text-white flex flex-col min-h-96 w-100 mt-20 md:mt-6 justify-center items-center">
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
      <div className="p-24 sticky w-full top-[100vh] flex space-y-6 md:space-y-0 flex-col md:flex-row w-full justify-center items-center">
        <div className="w-1/3 flex justify-center flex-col items-center">
          <a href="https://github.com/russell-brouillard/hack-api">
            <GitHubLogoIcon style={{width: '25px', height: '25px'}} />
          </a>
          <p>GitHub</p>
        </div>
        <div className="w-1/3 flex justify-center flex-col items-center">
          <a href="https://twitter.com/PomereneNetwork">
            <TwitterLogoIcon style={{width: '25px', height: '25px'}} />
          </a>
          <p>Twitter</p>
        </div>
        <div className="w-1/3 flex justify-center flex-col items-center">
          <EnvelopeClosedIcon style={{width: '25px', height: '25px'}} />
          <p>info@pomerene.xyz</p>
        </div>
      </div>
    </>
  );
}
