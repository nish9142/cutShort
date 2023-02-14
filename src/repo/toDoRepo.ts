import { ITodo,Todo} from '../models/ToDo';
import { getMongoId } from '../utils/helpers';

interface ToDoFilters {
    limit?: number;
    skip?: number;
    query: { [k: string] : string } 
}

export class ToDoRepo {
    static async updateToDo(data: Partial<ITodo>,id:any): Promise<ITodo> {
        const filter =  { _id: id }
        return Todo.findOneAndUpdate(filter, data, { upsert: true,new:true}).select("-__v");
    }

    static async createToDo(data: Partial<ITodo>): Promise<ITodo> {
        return Todo.create(data)
    }


    static async getToDos({limit=100,skip=0,query={}}): Promise<ITodo[]>{
        return Todo.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("-__v")
            
    }

    static async deleteToDo(id: string) {
        return Todo.findByIdAndDelete(id)
    }
}
