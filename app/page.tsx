import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <main className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-3">
            <Image
              src="/linkee.svg"
              width={32}
              height={32}
              alt="Linkee Logo"
              className="text-foreground"
            />
            <h1 className="text-3xl font-bold text-foreground">Linkee</h1>
        </div>

        <p className="text-lg text-muted-foreground">A simple and authless URL shortner</p>

        <Input
          type="url"
          placeholder="Paste your long URL here"
          className="flex-1 h-1 text-base"
        />
        <Button className="px-6 sm:w-auto">Shorten</Button>
      </main>
    </div>
  )
}