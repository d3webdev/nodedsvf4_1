import { rejects } from "assert";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Get a Statement", () => {
  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to get a statement", async () => {
    const user = {
      "name": "User Test 1",
      "email": "utest@example.com",
      "password": "123456"
    }

    const userCreated =  await createUserUseCase.execute({
      "name": user.name,
      "email": user.email,
      "password": user.password,
    });

    const statement = await createStatementUseCase.execute({
      "user_id": userCreated.id as string,
      "type": "deposit" as OperationType,
      "amount": 200,
      "description": "Deposit test",
    });

    const user_id = userCreated.id as string;
    const statement_id = statement.id as string;

    const getStatement = await getStatementOperationUseCase.execute({user_id, statement_id});

    expect(getStatement).toHaveProperty("id");

  });
  
  it("should not be able to get a statement of a nonexistent user", async () => {
    const user = {
      "name": "User Test 1",
      "email": "utest@example.com",
      "password": "123456"
    }

    const userCreated =  await createUserUseCase.execute({
      "name": user.name,
      "email": user.email,
      "password": user.password,
    });

    const statement = await createStatementUseCase.execute({
      "user_id": userCreated.id as string,
      "type": "deposit" as OperationType,
      "amount": 200,
      "description": "Deposit test",
    });

    const user_id = "111111111";
    const statement_id = statement.id as string;

    expect(async ()=>{
      await getStatementOperationUseCase.execute({user_id, statement_id});
    }).rejects.toBeInstanceOf(AppError);

  });
  
  it("should not be able to get a nonexistent statement", async () => {
    const user = {
      "name": "User Test 1",
      "email": "utest@example.com",
      "password": "123456"
    }

    const userCreated =  await createUserUseCase.execute({
      "name": user.name,
      "email": user.email,
      "password": user.password,
    });

    const statement = await createStatementUseCase.execute({
      "user_id": userCreated.id as string,
      "type": "deposit" as OperationType,
      "amount": 200,
      "description": "Deposit test",
    });

    const user_id = userCreated.id as string;
    const statement_id = "1234567890";

    expect(async ()=>{
      await getStatementOperationUseCase.execute({user_id, statement_id});
    }).rejects.toBeInstanceOf(AppError);

  });
});
