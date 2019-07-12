import {Router,Request,Response} from "express";
import * as jwt from "jsonwebtoken"; 
export class Tokens{
    private static readonly TOKEN_SECRET_KEY = `XXX_TOKeN_SECrET_KEY_XXX`;
    router:Router;
    constructor(){
        this.router = Router();
        this.router.get("/get", async(req:Request,res:Response)=>{
            const token = jwt.sign({ id: "payload" }, Tokens.TOKEN_SECRET_KEY, {
                expiresIn: 1800
            })
            res.status(200).send(token);
        })
        this.router.get("/verify",Tokens.verifyToken,async(req:Request,res:Response,next:Function)=>{
            next();
        })
    }
    static verifyToken(req:Request,res:Response,next:Function){
        const headers = req.headers;
        const token:any = headers["x-token"];
        if(!token)
           return res.status(403).send();
        else
        return jwt.verify(token,Tokens.TOKEN_SECRET_KEY,(err:Error,decoded:any)=>{
            if(err)
            res.status(500).send(err.message)
            else
            next();
        })
    }
    

}