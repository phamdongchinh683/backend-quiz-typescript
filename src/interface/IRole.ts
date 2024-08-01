import IUserProfile from "./IUserProfile";

export default interface IRole extends IUserProfile{
    id: string,
    role: string
}

