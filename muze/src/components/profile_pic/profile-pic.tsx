import Link from "next/link";
import * as AvatarPrimitive from '@radix-ui/react-avatar';

export default function ProfilePic({userId, src}: {userId: string, src: string | undefined}) {
    return (
        <Link href={"/user/" + userId}>
            <AvatarPrimitive.Root>
                <AvatarPrimitive.Image src={src} alt="Profile Pic" className="rounded-full"/>
                <AvatarPrimitive.Fallback delayMs={600}></AvatarPrimitive.Fallback>
            </AvatarPrimitive.Root>
        </Link>
    )
}