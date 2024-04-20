import {NextRequest, NextResponse} from "next/server";
import '../../lib/initGlobalStore';

export async function GET(request: NextRequest) {
    if (global.storedData && Object.keys(global.storedData).length > 0) {
        return NextResponse.json(global.storedData, { status: 200 });
    } else {
        return NextResponse.json({ error: "No question and documents found" }, { status: 404 });
    }
}
