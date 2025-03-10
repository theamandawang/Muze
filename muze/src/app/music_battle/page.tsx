"use client";

import { useState, useEffect } from "react";
import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { activeBattles, getVotesForBattle, getVotesForArtistInBattle, addVote, removeVote } from "../api/musicBattles/route";

export default function MusicBattle() {
    const [battles, setBattles] = useState<any[]>([]);
    const [votes, setVotes] = useState<{ [key: string]: string }>({}); // Tracks votes per battle
    const [voteCounts, setVoteCounts] = useState<{ [key: string]: { [key: string]: number } }>({}); // Tracks vote counts for each battle

    useEffect(() => {
        async function fetchData() {
            const battlesData = await activeBattles();
            const votesData = await Promise.all(battlesData.map(battle => getVotesForBattle(battle.id)));
            const countsMap = battlesData.reduce((acc, battle) => {
                acc[battle.id] = {
                    [battle.artist_one_id]: getVotesForArtistInBattle(battle.id, battle.artist_one_id),
                    [battle.arist_two_id]: getVotesForArtistInBattle(battle.id, battle.arist_two_id),
                };
                return acc;
            }, {} as { [key: string]: { [key: string]: number } });
            console.log("votes", await getVotesForBattle(battlesData[0].id));
            console.log("votes for artist 1", await getVotesForArtistInBattle(battlesData[0].id, battlesData[0].artist_one_id));
            console.log("votes for artist 2", await getVotesForArtistInBattle(battlesData[0].id, battlesData[0].arist_two_id));
            
            setBattles(battlesData);
            setVotes(Object.fromEntries(battlesData.map(battle => [battle.id, votesData[battlesData.indexOf(battle)]])));
            setVoteCounts(countsMap);
        }

        fetchData();
    }, []);

    const handleVote = async (battleId: string, artistId: string) => {
        const isSameArtist = votes[battleId] === artistId;
        isSameArtist ? await removeVote(battleId) : await addVote(battleId, artistId);
        setVotes(prev => ({ ...prev, [battleId]: isSameArtist ? null : artistId }));
    };

    const getPercent = (battleId: string) => {
        const counts = voteCounts[battleId];
        if (!counts) return { artistOne: 0, artistTwo: 0 };
        const totalVotes = counts[battleId.artist_one_id] + counts[battleId.artist_two_id];
        return totalVotes > 0
            ? {
                  artistOne: (counts[battleId.artist_one_id] / totalVotes) * 100,
                  artistTwo: (counts[battleId.artist_two_id] / totalVotes) * 100,
              }
            : { artistOne: 0, artistTwo: 0 };
    };

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
                                <button onClick={() => handleVote(battle.id, battle.artist_two_id)}>
                                    {votedArtist === battle.artist_two_id ? (
                                        <HeartFilledIcon className="w-6 h-6 text-red-500" />
                                    ) : (
                                        <HeartIcon className="w-6 h-6 text-gray-500" />
                                    )}
                                </button>
                                <span>{battle.arist_two_id}</span>
                            </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                                className="h-2 rounded-full"
                                style={{
                                    width: `${artistOne}%`,
                                    backgroundColor: "#f87171",
                                }}
                            ></div>
                            <div
                                className="h-2 rounded-full"
                                style={{
                                    width: `${artistTwo}%`,
                                    backgroundColor: "#60a5fa",
                                }}
                            ></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
