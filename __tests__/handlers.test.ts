/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse>
{
    return new NextResponse("");
}