import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
export const NavBar = () => {
  return (
    <nav className="w-full h-full max-h-16 p-4 flex items-center justify-end">
      <Avatar>
        <AvatarImage src={undefined} />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </nav>
  );
};
