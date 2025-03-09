"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Track } from "@spotify/web-api-ts-sdk";
import AddReviewView from "@/components/reviews/AddReviewView";
import Container from "@mui/material/Container";


export default function ReviewPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [track, setTrack] = useState<Track | null>(null);

    useEffect(() => {
        const trackData = searchParams.get("track");
        if (trackData) {
            setTrack(JSON.parse(decodeURIComponent(trackData)));
        } else {
            router.replace("/search");
        }
    }, [searchParams, router]);

    return track ? (
        <Container maxWidth="md" className="p-6">
            <AddReviewView media={track} onBack={() => router.push("/search")} onDone={() => {}} />
        </Container>
    ) : null;
}
