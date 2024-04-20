import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    console.log("Received question:", body.question);
    console.log("Received documents:", body.documents);
    return NextResponse.json({message: 'Question received'});
}