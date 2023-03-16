export class UserWithSameEmailError extends Error {
  constructor() {
    super('E-mail already exists!')
  }
}
