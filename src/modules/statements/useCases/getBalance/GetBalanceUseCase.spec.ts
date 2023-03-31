import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Get Balance', ()=> {

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }


  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase( inMemoryStatementsRepository, inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);

  });

  it('should be able to get balance', async()=>{

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
      "amount": 200,
      "description": "Deposit test",
    })

    await createStatementUseCase.execute({
      "user_id": userCreated.id as string,
      "type": "withdraw" as OperationType,
      "amount": 27,
      "description": "Withdraw test",
    })
  
    const user_id = userCreated.id as string;

    const getBalance = await getBalanceUseCase.execute({user_id});

    expect(getBalance.balance).toEqual(173);
  });

  it('should not be able to get balance a no existent user', async()=>{

    expect(async ()=>{
      const user_id = "1234567890";
      await getBalanceUseCase.execute({user_id});
    }).rejects.toEqual({ message: "User not found", statusCode: 404 });;
  });
});