import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export type ProxyHandler = (request: NextRequest) => NextResponse | undefined
