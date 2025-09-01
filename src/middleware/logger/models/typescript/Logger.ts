// Imported libraries
import { Logger_EnvironmentType } from "./EnvironmentType";
import { Log } from "./Log";


// Interfaces



// Class (Atributes)



// Methods



// Export Methods

export class LoggerInstance {
    public enviroment: Logger_EnvironmentType;
    private name: string;

  constructor(
    enviroment: Logger_EnvironmentType,
    name: string
  ) {
    this.enviroment = enviroment;
    this.name = name;
  }

  // Methods
  testTerminal(log : Log) {
    let message = 'Message Failed. \n';
    message = log.toTerminal();
    console.log( message );
  }
}