import {connect} from 'mongoose'

export const connectDB = async()=>{
    try {
        const result =  await connect(process.env.URI as string);

        console.log("DB connected succcessfully!");
    } catch (error) {
        
    }

    
} 





