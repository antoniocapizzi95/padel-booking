import { User } from "../models/user.model";

export interface IUserRepository {
    findById(id: number): Promise<User>;
    findByUsername(username: string): Promise<User>;
}