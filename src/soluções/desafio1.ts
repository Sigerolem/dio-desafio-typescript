// Como podemos rodar isso em um arquivo .ts sem causar erros? 

type EmployeeType = {
  code: number;
  name: string;
}

let employee = {} as EmployeeType;
employee.code = 10;
employee.name = "John";