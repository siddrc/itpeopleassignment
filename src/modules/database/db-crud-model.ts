export interface DbCRUDModel{
    collection:string;
    payload?:any;
    criteria?:any;
    projection?:any;
}