import { userModel } from './schema';

export async function getUserByEmail(email: string) {
    const user = userModel.findOne({ email: email });
    if (!user) throw 'User not found!!';
    return user;
}

export async function getUserByUsername(username: string) {
    const user = userModel.findOne({ username: username });
    if (!user) throw 'User not found!!';
    return user;
}

export async function getUserById(id: string) {
    const user = await userModel.findById(id);
    if (!user) throw 'User not found!!';
    return user;
}

export async function createNewUser(user) {
    const newUser = new userModel({
        username: user.username,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt
    });

    newUser.save();
}
