import { authRepository } from '../repositories/authRepository';
import { ApiError } from '../utils/ApiError';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const authService = {
  register: async (input: any) => {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) {
      throw new ApiError(409, 'An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    // Security: 'manager' role only granted if the correct invite code is provided.
    // Any mismatch or missing code silently falls back to 'member' — never trust
    // client input alone for privilege escalation.
    const requestedManager = input.role === 'manager';
    const validInviteCode = input.inviteCode === process.env.MANAGER_INVITE_CODE;
    const finalRole = requestedManager && validInviteCode ? 'manager' : 'member';

    const user = await authRepository.createUser({
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      role: finalRole,
    });

    const token = generateToken(user._id.toString(), user.role);
    const userObj = { _id: user._id, fullName: user.fullName, email: user.email, role: user.role };
    return { user: userObj, token };
  },

  login: async (data: any) => {
    const { email, password } = data;
    const user = await authRepository.findUserByEmail(email);

    if (!user) throw new ApiError(401, 'Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.passwordHash); 
    if (!isMatch) throw new ApiError(401, 'Invalid credentials');

    const token = generateToken(user._id.toString(), user.role);
    const userObj = { _id: user._id, fullName: user.fullName, email: user.email, role: user.role };
    return { user: userObj, token };
  }
};