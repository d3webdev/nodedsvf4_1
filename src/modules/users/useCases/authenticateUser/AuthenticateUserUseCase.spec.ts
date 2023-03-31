import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User",()=>{

  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

  });


  it("should be able to get user token",async ()=>{

    await createUserUseCase.execute({
      "name": "User Test",
      "email": "utest@example.com",
      "password": "123456",
    });

    const userAuth = await authenticateUserUseCase.execute({
      "email": "utest@example.com",
      "password": "123456",
    });

    expect(userAuth).toHaveProperty("token");

  });

  it("should not be able to get token for wrong email or nonexists",async ()=>{

    await createUserUseCase.execute({
      "name": "User Test",
      "email": "utest@example.com",
      "password": "123456",
    });

    expect(async ()=>{
      await authenticateUserUseCase.execute({
        "email": "nonet@example.com",
        "password": "123456",
      });
    }).rejects.toBeInstanceOf(AppError)


  });

  it("should not be able to get token for wrong password",async ()=>{

    await createUserUseCase.execute({
      "name": "User Test",
      "email": "utest@example.com",
      "password": "123456",
    });

    expect(async ()=>{
      await authenticateUserUseCase.execute({
        "email": "utest@example.com",
        "password": "654321",
      });
    }).rejects.toBeInstanceOf(AppError)


  });
});