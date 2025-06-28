interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
}

interface IUser {
    access_token: string;
    _id: string;
    role: string;
    email: string;
    phone: string
}

interface ICompany {
    _id?: string;
    name?: string;
    address?: string;
    description?: string
}