import { NextResponse } from "next/server"

export const successResponse = (data : any , statusCode = 200)=>{
    return NextResponse.json(
        {success : true , ...data},
        {status : statusCode}
    );
}

export const errorResponse = (message : string , statusCode = 400 , details : unknown )=>{
    return NextResponse.json(
        {success : false , message  , err_details : details},
        {status : statusCode},
    );
}
