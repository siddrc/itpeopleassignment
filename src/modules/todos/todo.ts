import { ObjectID } from "mongodb";
export interface Todo{
    description:string;
    _id?:ObjectID
}