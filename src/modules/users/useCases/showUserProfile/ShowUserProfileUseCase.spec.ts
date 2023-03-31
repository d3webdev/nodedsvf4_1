import { ProfileMap } from "../../mappers/ProfileMap";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";



let showUserProfileUseCase: ShowUserProfileUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show user profile", ()=>{
beforeEach(() => {
  inMemoryUsersRepository = new InMemoryUsersRepository();
  createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  authenticateUserUseCase: new AuthenticateUserUseCase(inMemoryUsersRepository);
  showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
});

it("should show user profile", async () => {
  

  const user = {
    "name": "User Test",
    "email": "utest@example.com",
    "password": "123456"
  }

  const userCreated = await createUserUseCase.execute({
    "name": user.name,
    "email": user.email,
    "password": user.password
  });

  const profile = await showUserProfileUseCase.execute(userCreated.id as string);
  const profileDTO = ProfileMap.toDTO(profile);

  expect(profileDTO.id).toEqual(userCreated.id);

});
});
