import { MoveLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="h-[85vh] w-full flex flex-col items-center justify-center bg-background">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-4">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-8xl md:text-9xl font-bold tracking-tighter bg-gradient-to-br from-primary to-muted-foreground bg-clip-text text-transparent drop-shadow-sm">
            404
          </h1>
          <motion.div
            className="absolute -bottom-2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </motion.div>

        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
            Page not found
          </h2>
          <p className="text-muted-foreground max-w-[600px] md:text-lg">
            Sorry, we couldn't find the page you're looking for. The page might
            have been moved, deleted, or never existed.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button className="text-lg mt-4 font-bold" asChild size="lg">
            <Link href="/">
              <MoveLeft className="mr-2 h-6 w-6 scale-[1.5]" />
              Return
            </Link>
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-gray-950 dark:[background:radial-gradient(#1f2937_1px,transparent_1px)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
}
