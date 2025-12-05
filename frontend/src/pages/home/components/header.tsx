import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";
import SettingsSheet from "./settings";
import { useGetMeQuery } from "@/api/queries";

export default function Header() {
  const user = useGetMeQuery();

  return (
    <header className="flex justify-between items-center py-2 px-5">
      <div className="flex items-center gap-5">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        {user.isPending && <span>Loading...</span>}
        {!user.isPending && user.data && <span>{user.data.email}</span>}
      </div>
      <SettingsSheet>
        <Button variant="ghost" size="icon">
          <SettingsIcon />
        </Button>
      </SettingsSheet>
    </header>
  );
}
