declare namespace Express {
    export interface Request {
        email?: string,
        emailConfirmed?: boolean,
    }
}