import { NextRequest } from "next/server";


export interface INextRequestWithBody extends NextRequest{
    validatedBody? : any
}