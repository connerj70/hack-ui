import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowRightIcon,
  TwitterLogoIcon,
  GitHubLogoIcon,
  DiscordLogoIcon,
  // HamburgerMenuIcon,
  Cross1Icon,
  // ArrowTopRightIcon,
} from "@radix-ui/react-icons";
import { useState, useEffect } from "react";

export default function Root() {
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (mobileMenu) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }
  });

  return (
    <>
      <div className="hidden md:flex bg-green-100 w-full justify-between px-4 py-6 lg:px-20">
        <div className="flex items-center gap-10">
          <Link to="/">
            <img
              src="/white-small.png"
              alt="Pomerene"
              className="rounded-full h-10"
            />
          </Link>
          {/* <div className="flex items-center gap-8">
            <Link to="/about" className="text-sm hover:underline">About</Link>
            <Link to="/contact" className="ml-4 text-sm hover:underline">Contact</Link>
          </div> */}
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <a href="https://x.com/PomereneNetwork">
              <TwitterLogoIcon style={{ width: "20px", height: "20px" }} />
            </a>
            <a href="https://discord.gg/mT4XFURfr8">
              <DiscordLogoIcon style={{ width: "20px", height: "20px" }} />
            </a>
            <a href="https://github.com/russell-brouillard/hack-api">
              <GitHubLogoIcon style={{ width: "20px", height: "20px" }} />
            </a>
          </div>
          <Link
            to="/signup"
            className={cn(
              buttonVariants({ variant: "default" }),
              "rounded-full"
            )}
          >
            Login
          </Link>
        </div>
      </div>

      <div
        className={
          "md:hidden flex w-full justify-between px-4 py-6" +
          (mobileMenu ? " bg-black" : " bg-green-100")
        }
      >
        <div className="flex items-center gap-3">
          {/* <HamburgerMenuIcon
            onClick={() => setMobileMenu(true)}
            className={
              "bg-green-600 text-white p-2 rounded-full" +
              (mobileMenu ? " hidden" : "")
            }
            style={{ width: "35px", height: "35px" }}
          /> */}
          <Cross1Icon
            onClick={() => setMobileMenu(false)}
            className={
              "bg-green-600 text-white p-2 rounded-full" +
              (mobileMenu ? "" : " hidden")
            }
            style={{ width: "35px", height: "35px" }}
          />
          <Link to="/">
            <img
              src="/white-small.png"
              alt="Pomerene"
              className="rounded-full h-10"
            />
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

      {/* <div
        className={
          "px-4 bg-black text-white flex flex-col gap-4 relative top-0 left-0 w-screen h-screen overscroll-none" +
          (mobileMenu ? "" : " hidden")
        }
      >
        <ul>
          <li className="py-4 border-b">
            <Link to="/about" className="text-sm hover:underline">
              About
            </Link>
          </li>
          <li className="py-4 border-b">
            <Link to="/contact" className="text-sm hover:underline">
              Contact
            </Link>
          </li>
        </ul>
        <div className="bg-green-200 bg-gradient-to-r from-green-200 to-green-800 border-br-rounded flex justify-between flex-col min-h-72 text-black p-6 rounded-br-3xl">
          <h2 className="text-sm">Earn rewards with Pomerene</h2>
          <div className="flex justify-end">
            <button className="bg-green-500 text-white rounded-full p-4">
              <ArrowTopRightIcon style={{ height: "20px", width: "20px" }} />
            </button>
          </div>
        </div>
      </div> */}

      <div className="bg-green-100 flex flex-col w-full h-screen bg-green-100 justify-center items-center">
        <div className="px-4 pt-10 pb-10 md:pb-44">
          <h1 className="font-serif text-green-600 w-full md:text-center text-6xl md:text-8xl">
            Pomerene
          </h1>
          <h2
            className="text-black text-xl w-full md:text-center uppercase"
            style={{ wordSpacing: "0.43rem" }}
          >
            Triple Entry International Trade
          </h2>
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
          <Link
            to="/explore"
            className="uppercase flex items-center md:justify-center w-full mt-8"
          >
            Explore the network
            <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
          </Link>
        </div>
      </div>
      <div className="p-48 rounded flex flex-col bg-white w-100 max-h-96 mt-4 md:mt-6 justify-center items-center">
        <h1 className="font-serif text-black text-5xl">
          Securing $13 Trillion in Global Trade
        </h1>
      </div>
      <div className="p-8 md:px-20 font-sans text-black gap-6 bg-green-100 flex flex-col md:flex-row-reverse min-h-96 w-100 mt-20 md:mt-6 justify-around items-start">
        <img
          src="/containers.jpg"
          alt="container ships"
          className="w-full md:w-1/2 rounded-bl-3xl relative -top-44 md:-top-28"
        />
        <div className="w-full md:w1/2 max-w-md relative -top-36 md:top-32">
          <h2 className="text-2xl">Shared Data Standard</h2>
          <p className="mt-3">
            The network is a neutral data standard for use by all trade
            counterparties.
          </p>
          <Link
            to="/explore"
            className="uppercase flex items-center md:justify-center w-full mt-8"
          >
            Learn more
            <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
          </Link>
        </div>
      </div>
      <div className="p-8 md:px-20 font-sans text-black gap-6 flex flex-col md:flex-row min-h-96 w-100 mt-20 md:mt-6 justify-around items-start">
        <img
          src="/warehouse.jpg"
          alt="container ships"
          className="w-full md:w-1/2 rounded-tr-3xl relative -top-44 md:-top-28"
        />
        <div className="w-full md:w1/2 max-w-md relative -top-36 md:top-32">
          <h2 className="text-2xl">IoT Network of Connected Devices</h2>
          <p className="mt-3">
            Pomerene is a decentralized infrastructure network. Powered by
            hardware.
          </p>
          <Link
            to="/explore"
            className="uppercase flex items-center md:justify-center w-full mt-8"
          >
            Get connected
            <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
          </Link>
        </div>
      </div>
      <div className="p-8 md:px-20 bg-green-100 font-sans text-black gap-6 flex flex-col md:flex-row-reverse min-h-96 w-100 mt-20 md:mt-6 justify-around items-start">
        <img
          src="/warehouse2.jpg"
          alt="container ships"
          className="w-full md:w-1/2 rounded-bl-3xl relative -top-44 md:-top-28"
        />
        <div className="w-full max-w-md md:w1/2 relative -top-36 md:top-32">
          <h2 className="text-2xl">Authenticated Inventory Tracking System</h2>
          <p className="mt-3">
            The network is an open, global inventory tracking system, secured by
            cryptographic authentication.
          </p>
          <Link
            to="/explore"
            className="uppercase flex items-center md:justify-center w-full mt-8"
          >
            Start tracking
            <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
          </Link>
        </div>
      </div>
      <div className="p-8 md:px-20 font-sans text-black gap-6 flex flex-col md:flex-row min-h-96 w-100 mt-20 md:mt-6 justify-around items-start">
        <img
          src="/shipping2.jpg"
          alt="container ships"
          className="w-full md:w-1/2 rounded-tr-3xl relative -top-44 md:-top-28"
        />
        <div className="w-full md:w1/2 max-w-md relative -top-36 md:top-32">
          <h2 className="text-2xl">Base Layer for a Smart Economic Stack</h2>
          <p className="mt-3">
            Pomerene’s authenticated data layer is the foundation for a value
            stack that includes: smart invoices, counterparty escrow contracts,
            trade finance and insurance products.
          </p>
          <Link
            to="/explore"
            className="uppercase flex items-center md:justify-center w-full mt-8"
          >
            Learn more
            <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
          </Link>
        </div>
      </div>

      <footer className="bg-black text-white p-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="w-full md:w-auto text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} Pomerene. All rights reserved.
              </p>
            </div>
            <div className="flex justify-center md:justify-start space-x-4">
              {/* <a href="" className="text-sm hover:text-green-500">
                Terms of use
              </a>
              <a href="" className="text-sm hover:text-green-500">
                Privacy Policy
              </a> */}
              <a
                href="mailto:info@pomerene.xyz"
                className="text-sm hover:text-green-500"
              >
                info@pomerene.xyz
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
