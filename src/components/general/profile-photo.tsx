import { UserProfile } from "@/lib/api/accounts/profile";
import Image from "next/image";

export default function ProfilePhoto({ user }: { user: UserProfile }) {
  return (
    <div>
      {user?.photo ? (
        <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-white shadow-lg">
          <Image
            src={user.photo || "/placeholder-avatar.jpg"}
            alt={user.firstName}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-hairsby-orange to-amber-600 text-gray-50 font-bold group-hover:scale-105 transition-transform">
          {user?.firstName?.[0]}
          {user?.lastName?.[0]}
        </div>
      )}
    </div>
  );
}
