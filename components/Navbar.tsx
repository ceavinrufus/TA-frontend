import Link from "next/link";
import UserMenu from "./UserMenu";

export function Navbar() {
  return (
    <nav className="flex w-full px-3 md:px-0 h-fit py-10 justify-between items-center">
      <Link href={"/"} className="text-xl">
        <span className="font-bold">Trip</span>
        Anon
      </Link>

      <UserMenu />
    </nav>
  );
}
