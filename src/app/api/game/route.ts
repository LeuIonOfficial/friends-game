import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

interface RoundScores {
  team1Score: number;
  team2Score: number;
}

interface GameData {
  team1: string;
  team2: string;
  round: { [key: number]: RoundScores };
}

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_PASSWORD!,
});

// 🟢 Save Teams (POST)
export async function POST(req: Request) {
  try {
    const { deviceId, team1, team2 } = await req.json();
    const gameData: GameData = {
      team1,
      team2,
      round: {
        1: {
          team1Score: 0,
          team2Score: 0,
        },
      },
    };

    await redis.set(`game:${deviceId}`, JSON.stringify(gameData));

    return NextResponse.json(
      { message: "Game initialized successfully." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error initializing game.", error: (error as Error).message },
      { status: 500 },
    );
  }
}

// 🔵 Get Game Data (GET)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const deviceId = url.searchParams.get("deviceId");
    if (!deviceId)
      return NextResponse.json(
        { message: "Device ID required." },
        { status: 400 },
      );

    const gameData = await redis.get<string>(`game:${deviceId}`);
    if (!gameData)
      return NextResponse.json({ message: "Game not found." }, { status: 404 });

    return NextResponse.json(gameData);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error retrieving game data.",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// 🟠 Update Scores (PUT)
export async function PUT(req: Request) {
  try {
    const { deviceId, roundNumber, team1Score, team2Score } = await req.json();
    const gameData = await redis.get<GameData>(`game:${deviceId}`);

    if (!gameData)
      return NextResponse.json({ message: "Game not found." }, { status: 404 });

    const updatedGame: GameData = {
      ...gameData,
      round: {
        ...gameData.round,
        [roundNumber]: {
          team1Score,
          team2Score,
        },
      },
    };

    await redis.set(`game:${deviceId}`, JSON.stringify(updatedGame));

    return NextResponse.json(
      { message: "Scores updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating scores.", error: (error as Error).message },
      { status: 500 },
    );
  }
}
