"use client";

import { useEffect, useState } from "react";
import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import {
    activeBattles,
    getVotesForArtistInBattle,
    addVote,
    removeVote,
} from "../api/musicBattles/route";

export default function MusicBattle() {
    const [battles, setBattles] = useState<any[]>([]);
    const [votes, setVotes] = useState<{ [key: string]: string | null }>({});
    const [voteCounts, setVoteCounts] = useState<{ [key: string]: { [key: string]: number } }>({});

    const fetchBattles = async () => {
        const battlesData = await activeBattles();
        const countsMap: { [key: string]: { [key: string]: number } } = {};

        await Promise.all(
            battlesData.map(async (battle) => {
                const artistOneVotes = await getVotesForArtistInBattle(battle.id, battle.artist_one_id);
                const artistTwoVotes = await getVotesForArtistInBattle(battle.id, battle.arist_two_id);
                countsMap[battle.id] = {
                    [battle.artist_one_id]: artistOneVotes.length,
                    [battle.arist_two_id]: artistTwoVotes.length,
                };
            })
        );

        setBattles(battlesData);
        setVoteCounts(countsMap);
    };

    const handleVote = async (battleId: string, artistId: string) => {
        const currentVote = votes[battleId];

        if (currentVote === artistId) {
            await removeVote(battleId);
            setVotes((prev) => ({ ...prev, [battleId]: null }));
            setVoteCounts((prev) => ({
                ...prev,
                [battleId]: {
                    ...prev[battleId],
                    [artistId]: prev[battleId][artistId] - 1,
                },
            }));
        } else {
            await addVote(battleId, artistId);
            setVotes((prev) => ({ ...prev, [battleId]: artistId }));
            setVoteCounts((prev) => ({
                ...prev,
                [battleId]: {
                    ...prev[battleId],
                    [artistId]: prev[battleId][artistId] + 1,
                    [currentVote || ""]: currentVote ? prev[battleId][currentVote] - 1 : prev[battleId][artistId],
                },
            }));
        }
    };

    const getPercent = (battleId: string) => {
        const counts = voteCounts[battleId] || {};
        const totalVotes = (counts[battles.find((b) => b.id === battleId)?.artist_one_id] || 0) +
                           (counts[battles.find((b) => b.id === battleId)?.arist_two_id] || 0);

        if (totalVotes === 0) return { artistOne: 50, artistTwo: 50 };

        return {
            artistOne: ((counts[battles.find((b) => b.id === battleId)?.artist_one_id] || 0) / totalVotes) * 100,
            artistTwo: ((counts[battles.find((b) => b.id === battleId)?.arist_two_id] || 0) / totalVotes) * 100,
        };
    };

    useEffect(() => {
        fetchBattles();
    }, [])
    return (
        <div>
            <div className="text-center font-bold mt-6">
                <h1>Music Battles</h1>
            </div>

            {battles.map((battle) => {
                const { artistOne, artistTwo } = getPercent(battle.id);
                const votedArtist = votes[battle.id];

                return (
                    <div key={battle.id} className="mx-8 px-4 py-2 text-lg font-semibold sm:text-xl md:text-2xl">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span>{battle.artist_one_id}</span>
                                <button onClick={() => handleVote(battle.id, battle.artist_one_id)}>
                                    {votedArtist === battle.artist_one_id ? (
                                        <HeartFilledIcon className="w-6 h-6 text-red-500" />
                                    ) : (
                                        <HeartIcon className="w-6 h-6 text-gray-500" />
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleVote(battle.id, battle.arist_two_id)}>
                                    {votedArtist === battle.arist_two_id ? (
                                        <HeartFilledIcon className="w-6 h-6 text-blue-500" />
                                    ) : (
                                        <HeartIcon className="w-6 h-6 text-gray-500" />
                                    )}
                                </button>
                                <span>{battle.arist_two_id}</span>
                            </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2 relative">
                            <div className="absolute top-0 left-0 h-2 bg-red-500 rounded-full" style={{ width: `${artistOne}%` }}></div>
                            <div className="absolute top-0 right-0 h-2 bg-blue-500 rounded-full" style={{ width: `${artistTwo}%` }}></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
