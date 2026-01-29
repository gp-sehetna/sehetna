import {connect} from 'mongoose'
import {config} from 'dotenv';
config();
const connectDB = async()=>{
    try {
        console.log(process.env.CONNECTION_STRING);
        
        const result =  await connect(process.env.CONNECTION_STRING as string);
        
        console.log({models : result.models});
        console.log("DB connected succcessfully!" );
    } catch (error) {
        console.log("Fail to connect on DB" , error);
    }

    
} 


export default connectDB;


await connectDB();