export default interface IAuth {
    token: string;
    userId: string;
    accessToken?: string;
    refreshToken?: string;
}

