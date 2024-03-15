import { User } from "../../models/user.model";
import { IUserRepository } from "../user.repository.interface";
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository implements IUserRepository {
    private users: User[];
    
    constructor() {
        this.users = [
            {
                id: 1,
                username: "user1",
                email: "user1@email.com"
            },
            {
                id: 2,
                username: "user2",
                email: "user2@email.com"
            },
            {
                id: 3,
                username: "user3",
                email: "user3@email.com"
            },
            {
                id: 4,
                username: "user4",
                email: "user4@email.com"
            },
        ]
    }

    async findById(id: number): Promise<User> {
        return this.users.find(user => user.id === id);
    }

    async findByUsername(username: string): Promise<User> {
        return this.users.find(user => user.username === username);
    }
}