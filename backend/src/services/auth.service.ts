import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel, { UserSystemRole } from '../models/User';
import { LoginDTO, RegisterDTO } from '../dtos/auth.dto';
import { httpError } from '../middlewares/error';

const JWT_SECRET = process.env.JWT_SECRET || 'contaquiz-dev-secret';

function signToken(userId: string, role: string) {
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
    return jwt.sign({ sub: userId, role }, JWT_SECRET, { expiresIn });
}

export async function register(data: RegisterDTO) {
    const exists = await UserModel.findOne({ email: data.email.toLowerCase() });
    if (exists) throw httpError(409, 'E-mail ja cadastrado');

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await UserModel.create({
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash,
        systemRole: UserSystemRole.ALUNO,
        active: true,
    });

    const token = signToken(user._id.toString(), user.systemRole);

    return {
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            systemRole: user.systemRole,
        },
    };
}

export async function login(data: LoginDTO) {
    const user = await UserModel.findOne({ email: data.email.toLowerCase() });
    if (!user) throw httpError(401, 'Credenciais invalidas');

    if (!user.active) throw httpError(403, 'Usuario desativado');

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw httpError(401, 'Credenciais invalidas');

    const token = signToken(user._id.toString(), user.systemRole);

    return {
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            systemRole: user.systemRole,
        },
    };
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as { sub: string; role: string };
}
