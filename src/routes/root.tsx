import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  TwitterLogoIcon,
  GitHubLogoIcon,
  EnvelopeClosedIcon,
} from "@radix-ui/react-icons";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/useAuth";

const containerVariants1 = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.5 } },
};

const headingVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
};

const sideVariant = {
  hidden: (direction) => ({
    x: direction === "left" ? -200 : 200,
    opacity: 0,
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 30, duration: 0.5 },
  },
};

export default function Root() {
  const control = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  useEffect(() => {
    if (inView) {
      control.start("visible");
    }
  }, [control, inView]);

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants1}
        className="absolute left-4 top-4 md:left-6 z-10"
      >
        <Link to="/">
          <img
            src="/white-small.png"
            alt="Pomerene"
            className="rounded-full h-10"
          />
        </Link>
      </motion.div>
      <Link
        to="/signup"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 z-10"
        )}
      >
        Sign Up
      </Link>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants1}
        className="bg-green-600 flex flex-col w-full py-48 px-8 mt-20 justify-center items-center"
      >
        <motion.h1
          variants={itemVariants}
          className="font-serif text-white w-full md:text-center text-6xl md:text-8xl"
        >
          Pomerene
        </motion.h1>
        <motion.h2
          variants={itemVariants}
          className="text-yellow-400 text-xl w-full md:text-center uppercase"
          style={{ wordSpacing: "0.43rem" }}
        >
          Triple Entry International Trade
        </motion.h2>
      </motion.div>

      <div className="p-48 rounded flex flex-col w-full max-h-96 mt-4 md:mt-6 justify-center items-center">
        <motion.div
          ref={ref} // Attach the ref provided by useInView
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delay: 0.2, duration: 0.6 },
            },
          }}
          className="p-48 rounded flex flex-col w-full max-h-96 mt-4 md:mt-6 justify-center items-center"
        >
          <motion.h1
            className="font-serif text-black text-5xl"
            variants={headingVariants}
            initial="hidden"
            animate="visible"
          >
            Securing $13 Trillion in Global Trade
          </motion.h1>
        </motion.div>
      </div>

      <div>
        <div className="p-8 font-sans bg-green-600 text-white flex flex-col min-h-96 w-full mt-20 md:mt-6 justify-center items-center">
          <div className="w-full md:flex-row md:pb-10 flex-col flex justify-between xl:justify-around items-center">
            <motion.div
              custom="left"
              variants={sideVariant}
              initial="hidden"
              animate={control}
              className="w-1/2 xl:w-1/3 mt-6"
              ref={ref}
            >
              <h3 className="text-2xl">Shared Data Standard.</h3>
            </motion.div>
            <motion.div
              custom="right"
              variants={sideVariant}
              initial="hidden"
              animate={control}
              className="w-1/2 xl:w-1/3 mt-6"
            >
              <h3 className="text-2xl">IoT Network of Connected Devices.</h3>
            </motion.div>
          </div>
          <div className="w-full flex md:flex-row flex-col justify-between xl:justify-around items-center">
            <motion.div
              custom="left"
              variants={sideVariant}
              initial="hidden"
              animate={control}
              className="w-1/2 xl:w-1/3 mt-6"
            >
              <h3 className="text-2xl">
                Base Layer for a Smart Economic Stack.
              </h3>
            </motion.div>
            <motion.div
              custom="right"
              variants={sideVariant}
              initial="hidden"
              animate={control}
              className="w-1/2 xl:w-1/3 mt-6"
            >
              <h3 className="text-2xl">
                Authenticated Inventory Tracking System.
              </h3>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="p-24 sticky w-full top-[100vh] flex space-y-6 md:space-y-0 flex-col md:flex-row w-full justify-center items-center">
        <div className="w-1/3 flex justify-center flex-col items-center">
          <a href="https://github.com/russell-brouillard/hack-api">
            <GitHubLogoIcon style={{ width: "25px", height: "25px" }} />
          </a>
          <p>GitHub</p>
        </div>
        <div className="w-1/3 flex justify-center flex-col items-center">
          <a href="https://twitter.com/PomereneNetwork">
            <TwitterLogoIcon style={{ width: "25px", height: "25px" }} />
          </a>
          <p>Twitter</p>
        </div>
        <div className="w-1/3 flex justify-center flex-col items-center">
          <EnvelopeClosedIcon style={{ width: "25px", height: "25px" }} />
          <p>info@pomerene.xyz</p>
        </div>
      </div>
    </>
  );
}
