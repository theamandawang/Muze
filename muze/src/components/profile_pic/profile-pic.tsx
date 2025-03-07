import Image from "next/image";
import Link from "next/link";

export default function ProfilePic(){
    // console.log("userer", userInfo)
    return (
        <Link href="/profile">
            <div className="aspect-square rounded-full bg-tertiary w-full flex place-content-center">
                <Image src='/default-profile-pic.svg' alt='profile pic' fill />
            </div>
        </Link>
    )
}