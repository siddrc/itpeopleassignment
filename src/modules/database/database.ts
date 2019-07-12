import {
    MongoClient
} from "mongodb";
import {
    DBProperties
} from "./dbProperties";
import {
    DbCRUDModel
} from "./db-crud-model";
export class Database {
    private async getConnection(): Promise < MongoClient > {
        try {
            const connection = await MongoClient.connect(DBProperties.connectionString, {
                useNewUrlParser: true
            });
            return connection;
        } catch (error) {
            throw error
        }
    }
    public async create(createParams: DbCRUDModel): Promise < any > {
        try {
            const connection = await this.getConnection();
            const rowsAffected = await this.createHandler(connection, createParams);
            return rowsAffected;
        } catch (error) {
            throw error;
        }
    }
    private async createHandler(connection: MongoClient, createParams: DbCRUDModel): Promise < any > {
        try {
            const db = connection.db(DBProperties.databaseName);
            const collection = db.collection(createParams.collection);
            const rowsAffected = await collection.insertOne(createParams.payload);
            if(rowsAffected.insertedCount === 0)
                throw new Error(`No rows inserted for ${JSON.stringify(createParams)}`)
            return rowsAffected
        } catch (error) {
            throw error
        } finally {
            connection.close();
        }

    }
    public async read(readParams: DbCRUDModel):Promise<any[]> {
        try {
            const connection = await this.getConnection();
            const documents = await this.readHandler(connection, readParams);
            return documents;
        } catch (error) {
            throw error;
        }
    }
    private async readHandler(connection: MongoClient, readParams: DbCRUDModel): Promise < any[] > {
        try {
            const db = connection.db(DBProperties.databaseName);
            const collection = db.collection(readParams.collection);
            const documents = await collection.find(readParams.criteria)
                .project(readParams.projection).toArray();
            if(documents.length === 0)
                throw new Error("No documents");
            return documents;
        } catch (error) {
            throw error
        } finally {
            connection.close();
        }
    }
    public async update(updateParams:DbCRUDModel):Promise<any> {
        try {
            const connection = await this.getConnection();
            const rowsAffected = await this.updateHandler(connection, updateParams);
            return rowsAffected;
        } catch (error) {
            throw error;
        }
    }
    private async updateHandler(connection:MongoClient, updateParams:DbCRUDModel):Promise<any> {
        try {
            const db = connection.db(DBProperties.databaseName);
            const collection = db.collection(updateParams.collection);
            const rowsAffected = await collection.updateOne(updateParams.criteria, {"$set":updateParams.payload});
            if(rowsAffected.modifiedCount === 0)
                throw new Error("No documents were updated.")
            return rowsAffected;
        } catch (error) {
            throw error
        } finally {
            connection.close();
        }
    }
    public async delete(deleteParams:DbCRUDModel) {
        try {
            const connection = await this.getConnection();
            const rowsAffected = await this.deleteHandler(connection, deleteParams);
            return rowsAffected;
        } catch (error) {
            throw error;
        }
    }
    private async deleteHandler(connection:MongoClient, deleteParams:DbCRUDModel) {
        try {
            const db = connection.db(DBProperties.databaseName);
            const collection = db.collection(deleteParams.collection);
            const rowsAffected = await collection.deleteOne(deleteParams.criteria);
            if(rowsAffected.deletedCount === 0)
             throw new Error("No documents were deleted.")
            return rowsAffected;
        } catch (error) {
            throw error
        } finally {
            connection.close();
        }
    }   
}
