
export type JwtPayload = {
  id: string;
  fullName: string;
  email: string;
  role: 'member' | 'manager';
};
