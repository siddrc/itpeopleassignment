import {Router,Request,Response} from "express";
import {
    check
} from 'express-validator';
import {Todos} from "./todos";
import {RouterUtils} from "../utils/router-utils";
export class TodosRouter{
 router:Router;
 constructor(){
     this.router = Router();
     this.router.get("/", async(req:Request,res:Response)=>{
        let status = 200, response = {};
        try{
            response = await new Todos().getAll();
        }catch(e){
            status = 500;
            response = e.message;
        }finally{
            res.status(status).send(response)
        }
     });
    this.router.post("/", TodosDataSchema.POST_REQUEST_SCHEMA_VALIDATIONS,RouterUtils.reportSchemaErrors,async(req:Request,res:Response)=>{
        let status = 200, response = {};
        try{
            response = await new Todos().create(req.body);
        }catch(e){
            status = 500;
            response = e.message;
        }finally{
            res.status(status).send(response)
        }
    });
    this.router.put("/:id",TodosDataSchema.POST_REQUEST_SCHEMA_VALIDATIONS,RouterUtils.reportSchemaErrors, async(req:Request,res:Response)=>{
        let status = 200, response = {};
        try{
            response = await new Todos().update(req.params.id,req.body);
        }catch(e){
            status = 500;
            response = e.message;
        }finally{
            res.status(status).send(response)
        }
    });
    this.router.delete("/:id", async(req:Request,res:Response)=>{
        let status = 200, response = {};
        try{
            response = await new Todos().delete(req.params.id);
        }catch(e){
            status = 500;
            response = e.message;
        }finally{
            res.status(status).send(response)
        }
    });
 }
}
class TodosDataSchema{
    public static readonly POST_REQUEST_SCHEMA_VALIDATIONS = [check('description').trim().isLength({min:10}).withMessage('Please enter description of ToDo of minimum length - 10.')]
}