import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"



describe("Create User",()=>{
  let createUserUseCase: CreateUserUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  it("should be able to create a user", async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    const user = await createUserUseCase.execute({
        "name": "User Test",
        "email": "utest@example.com",
        "password": "123456"
    });

    expect(user).toHaveProperty("id");
    expect(user.name).toEqual("User Test");

  });

  it("should not be able to create a user with same email", async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    expect(async ()=>{
      await createUserUseCase.execute({
        "name": "User Test 1",
        "email": "utest@example.com",
        "password": "123456"
    });

    await createUserUseCase.execute({
      "name": "User Test 2",
      "email": "utest@example.com",
      "password": "123456"
    });
    }).rejects.toBeInstanceOf(AppError);

  });

})