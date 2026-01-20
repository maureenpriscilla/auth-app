export interface User {
    id: number;
    email: string;
  }
  
  export interface SignInRequest {
    email: string;
    password: string;
  }
  
  export interface SignUpRequest {
    email: string;
    password: string;
  }
  
  export interface SignInResponse {
    token: string;
  }
  