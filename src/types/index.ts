export interface User {
  id: string;
  email: string;
}

export interface Room {
  id: string;
  name: string;
  createdBy: string;
  createdAt: number;
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  userEmail: string;
  createdAt: number;
}
