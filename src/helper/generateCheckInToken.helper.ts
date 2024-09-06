import { Injectable } from "@nestjs/common";

@Injectable()
export class GenerateCheckInTokenHelper {
  private characters: string = "0123456789";

  generateCIToken(): string {
    let token = "";
    for (let i=0; i<parseInt(process.env.CHECK_IN_TOKEN_LENGTH); i++) {
      token += this.characters.charAt(Math.floor(Math.random() * this.characters.length));
    }
    return token;
  }
}