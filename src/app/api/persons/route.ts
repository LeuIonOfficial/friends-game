// Backend: app/api/persons/route.ts
import { NextResponse } from "next/server";

const randomImageAPI = "https://picsum.photos/200/300";

const persons = Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
    name: `Person ${index + 1}`,
    description: `A famous personality known for great achievements.`,
    image: `${randomImageAPI}?random=${index + 1}`,
}));

export async function GET() {
    return NextResponse.json(persons);
}
