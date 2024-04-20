import {NextRequest, NextResponse} from "next/server";
import '../../lib/initGlobalStore';

export async function GET(request: NextRequest) {
    if (global.error) {
        return NextResponse.json({message: global.error}, { status: 500});
    } else {
        return NextResponse.json({message: "No server error"}, { status: 200 });
    }
}

export const dynamic = 'force-dynamic';