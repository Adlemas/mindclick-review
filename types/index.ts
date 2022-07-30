export type MobileNumber = {
    country: string;
    mobile: string;
    code: number;
}

/**
 * Response for the Get Auth User API
 */

export interface GetAuthUserResponse {
    user: User;
}

export type Next = "HOME" | "PROFILE" | string

export type Role = "STUDENT" | "TEACHER";

export interface Meta {
    status: boolean;
    expiry: string;
    role: Role;
}

// export interface User {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     phone: MobileNumber;
//     email: string;
//     createdAt: string;
//     updatedAt: string;
//     lastLogin: string;
//     profileImg: string | null;
//     meta: Meta;
// }

export interface PortfolioItem {
    filename: string;
    displayName: string;
    uploadAt: Date;
}

export interface User {
    _id?: string;
    firstName: string;
    lastName: string;
    phone: string;
    lastLogin: Date;
    profileImg: string | null;
    rate: number;
    points: number;
    status: boolean;
    birthDate: string;
    role: Role;
    email: string;
    password: string;
    description: string;
    portfolio: PortfolioItem[];
    createdAt: Date;
    city: string | undefined;
    address: string | undefined;
    groups: string[];
    socketId: string | undefined | null;
    balance: {
        available: number,
        reserved: number
    } | undefined;
}

export type AuthState = {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    next: Next,
}

export type STAGE = "LOADING" | "START" | "BEFORE" | "COUNT" | "ANSWER" | "WAIT"

export const STAGES = {
    LOADING: "LOADING",
    START: "START",
    BEFORE: "BEFORE",
    COUNT: "COUNT",
    ANSWER: "ANSWER",
}

export interface Group {
    _id: string;
    name: string;
    maxMembers: number;
    members: User[];
}

export interface SimulatorSettings { }

export type CountFormula = "NF" | "LF" | "BF" | "FF"

export interface MultiplySettings extends SimulatorSettings {
    first: string[];
    second: string[];
}

export interface DivideSettings extends SimulatorSettings {
    first: string;
    second: string;
}

export interface CountSettings extends SimulatorSettings {
    terms: number;
    min: number;
    max: number;
    formula: CountFormula;
    forceFormula: boolean;
}

export interface Statistic {
    settings: SimulatorSettings;
    isRight: boolean;
    your: string;
    expression: number[];
    createdAt?: string
}

export type GroupsState = {
    groups: Group[];
    loading: boolean;
}

export type Simulator = 'MENTAL' | 'MULTIPLY' | 'FLASHCARDS' | 'TABLES' | 'DIVIDE'

export type Task = {
    _id?: string;
    userId: string;
    completed: boolean;
    simulator: Simulator;
    task: IMentalTask | IMultiplyTask | IDivideTask | ITablesTask | IFlashCardsTask;
    creator: string;
    createdAt?: string;
    stats: Statistic[];
}

export type TaskState = {
    tasks: Task[]
    loading: boolean
}

export interface AuthBody {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface LoginResponse {
    token: string;
    refreshToken: string;
    next: Next;
    user: User;
}

export type ITaskBase = {
    count: number;
    reward: 'auto' | number;
    expire: string;
}

export type IMentalTask = ITaskBase & {
    formula: CountFormula;
    terms: number;
    speed: number;
    reward: 'auto' | number;
    diapason: {
        min: number;
        max: number;
    };
    expire: string;
}

export type IMultiplyTask = ITaskBase & {
    first: string[];
    second: string[];
    // speed: number; TODO: uncomment when added speed logic for multiply
}

export type IFlashCardsTask = ITaskBase & {
    digitNumber: number;
}

export type ITablesTask = ITaskBase & IMentalTask

export type IDivideTask = ITaskBase & {
    first: string;
    second: string;
}


export interface Conference {
    name: string
    visibility: "PRIVATE" | "PUBLIC"
    date: string
    members: string[]
}

/** Type Defination for Schedule */

export interface Schedule {
    _id?: string;
    name: string;
    description: string;
    organizerId: string;
    visibility: "PRIVATE" | "PUBLIC"
    date: string;
    members: string[];
    createdAt?: string;
}

export type MessageType = 'text' | 'photo' | 'audio' | 'document' | 'sticker' | 'video' | 'voice';

export type ChannelType = "text" | "call"

export interface Message {
    _id?: string
    type: MessageType
    from: User
    replyTo?: Message
    content: string
    createdAt: string
    updatedAt: string
}

export interface Channel {
    _id?: string
    title: string
    type: ChannelType
    messages: Message[]
    createdAt?: string
    updatedAt?: string
}

export interface Chat {
    _id?: string
    createdAt?: string
    updatedAt?: string
    groupId: string
    title: string
    channels: Channel[]
}

export interface SocketNotification {
    fromId: string
    title: string
    description: string
    next?: string
}

export interface SocketMessage {
    channelId: string;
    chatId: string;
    fromId: string;
}
