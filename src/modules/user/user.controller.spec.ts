import { Test, TestingModule } from "@nestjs/testing"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { User } from "./entities/user.entity"
import { Post } from "../post/entities/post.entity"
import { NotFoundException } from "@nestjs/common"

describe("userController", () => {
    let userController: UserController
    let moduleRef: TestingModule

    const mockUser: Partial<User> = {
        id: "testid",
        username: "user",
        avatar: "avatar.png",
        email: "user@gmail.com",
        displayName: "User",
        dob: "01/01/2003",
        gender: "MALE"
    }

    const mockPost: Partial<Post> = {
        id: "testid",
        title: "title",
        content: "content",
    }

    const mockUserService = {
        findOne: jest.fn().mockImplementation((username: string) => {
            return username === "user" ? mockUser : {}
        }),
        findPostsOfUser: jest.fn().mockImplementation((username: string) => {
            return username === "user" ? [mockPost] : []
        }),
        
    }

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            controllers: [UserController],
            providers: [{
                provide: UserService,
                useValue: mockUserService
            }]
        }).compile()

        userController = moduleRef.get<UserController>(UserController)
    })

    it("It must be defined.", () => {
        expect(userController).toBeDefined()
    })
})