import {Request,Response} from "express";
import { validationResult } from 'express-validator';
export class RouterUtils{
    static reportSchemaErrors(req:Request,res:Response,next:Function){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }else 
          next();  
       }
}