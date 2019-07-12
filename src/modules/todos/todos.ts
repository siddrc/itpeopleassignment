import {Database} from "../database/database";
import {Todo} from "./todo";
import { ObjectID } from "mongodb";
export class Todos{
    private static readonly collection = "todos";
    public async getAll():Promise<Todo[]>{
        try{
            return await new Database().read({collection:Todos.collection,criteria:{},projection:{}})
        }catch(e){
            throw e;
        }
    }
    public async create(toDo:Todo){
        try{
            return await new Database().create({collection:Todos.collection,payload:toDo})
        }catch(e){
            throw e;
        }
    }
    public async update(id:string,toDo:Todo){
        try{
            return await new Database().update({collection:Todos.collection,
                payload:toDo,
                criteria:{
                    _id:new ObjectID(id)
                }})
        }catch(e){
            throw e;
        }
    }
    public async delete(id:string){
        try{
            return await new Database().delete({collection:Todos.collection,
                criteria:{
                    _id:new ObjectID(id)
                }})
        }catch(e){
            throw e;
        }
    }

}