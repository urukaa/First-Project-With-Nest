export class UserResponse {
  id?: number;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  token?: string;
}

export class RegisterUserReq {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
}

export class LoginUserReq {
  username: string;
  password: string;
}

export class UpdateUserReq {
  name?: string;
  phone?: string;
}

