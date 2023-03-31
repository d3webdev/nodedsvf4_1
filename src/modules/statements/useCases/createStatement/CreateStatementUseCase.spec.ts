import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";



let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create Statement", () => {
  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able deposit an amount",async ()=>{

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

    const statementCreated = await createStatementUseCase.execute({
      "user_id": userCreated.id as string,
      "type": "deposit" as OperationType,
      "amount": 200,
      "description": "Deposit test",
    })

    expect(statementCreated.amount).toEqual(200);

  });

  it("should be able withdraw an amount",async ()=>{

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

    await createStatementUseCase.execute({
      "user_id": userCreated.id as string,
      "type": "deposit" as OperationType,
      "amount": 300,
      "description": "Deposit test",
    })

    const statementCreated = await createStatementUseCase.execute({
      "user_id": userCreated.id as string,
      "type": "withdraw" as OperationType,
      "amount": 150,
      "description": "Withdaw test",
    })

    expect(statementCreated.amount).toEqual(150);

  });
  
  it("should not be able withdraw an amount without funds",async ()=>{

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



    expect(async ()=>{
      await createStatementUseCase.execute({
        "user_id": userCreated.id as string,
        "type": "deposit" as OperationType,
        "amount": 50,
        "description": "Deposit test",
      })
  
      await createStatementUseCase.execute({
        "user_id": userCreated.id as string,
        "type": "withdraw" as OperationType,
        "amount": 100,
        "description": "Withdaw test",
      })
    }).rejects.toBeInstanceOf(AppError);

  });
});
