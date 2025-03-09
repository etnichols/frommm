"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "./navigation-menu";

import Badge from "./badge";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  return (
    <div className="flex flex-col mb-4">
      <div className="flex flex-col gap-y-4">
        <Basketballs />
        <div>
          From??? Basketball Quizzes <Badge>{"0.0.2"}</Badge>
        </div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    onClick={() => router.push("/about")}
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    onClick={() => router.push("/quizzes")}
                  >
                    Browse
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    onClick={() => router.push("/leaderboard")}
                  >
                    Leaderboard
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
      </div>
    </div>
  );
}

function Basketballs() {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/")}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          router.push("/");
        }
      }}
      className="flex flex-row gap-x-4 items-center cursor-pointer"
    >
      {new Array(4).fill(0).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: decoration
        <div key={`basketball-${index}`} className="flex flex-row gap-x-4">
          <div className="bg-orange-500 size-6 rounded-full" />
          <div className="rotate-45 bg-black size-5 text-white">
            <div className="-rotate-45 flex items-center justify-center h-full">
              {"?"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
