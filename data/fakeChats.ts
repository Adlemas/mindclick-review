import { Chat } from "types";


// 10 fake chats with Chat type for testing
export const fakeChats: Chat[] = [
    {
        _id: "1",
        user: {
            name: "John",
            avatar: "https://randomuser.me/api/portraits/men/69.jpg",
            lastName: "Doe",
            username: "jdoe",
            phone: "123456789",
            email: "johndoe@test.com",
        },
        messages: [
            {
                text: "Hello, how are you?",
                createdAt: "2020-01-01T12:00:00.000Z",
                isMine: false,
            },
            {
                text: "I'm fine, thanks!",
                createdAt: "2020-01-01T12:01:00.000Z",
                isMine: true,
            },
            {
                text: "How are you?",
                createdAt: "2020-01-01T12:02:00.000Z",
                isMine: true,
            },
            {
                text: "What's up?",
                createdAt: "2020-01-01T12:03:00.000Z",
                isMine: false,
            },
            {
                text: "Hello, how are you?",
                createdAt: "2020-01-01T12:00:00.000Z",
                isMine: false,
            },
            {
                text: "I'm fine, thanks!",
                createdAt: "2020-01-01T12:01:00.000Z",
                isMine: true,
            },
            {
                text: "How are you?",
                createdAt: "2020-01-01T12:02:00.000Z",
                isMine: true,
            },
            {
                text: "What's up?",
                createdAt: "2020-01-01T12:03:00.000Z",
                isMine: false,
            },
            {
                text: "Hello, how are you?",
                createdAt: "2020-01-01T12:00:00.000Z",
                isMine: false,
            },
            {
                text: "How are you?",
                createdAt: "2020-01-01T12:02:00.000Z",
                isMine: true,
            },
            {
                text: "What's up?",
                createdAt: "2020-01-01T12:03:00.000Z",
                isMine: false,
            },
            {
                text: "I'm fine, thanks!",
                createdAt: "2020-01-01T12:01:00.000Z",
                isMine: true,
            },
        ],
    },
    {
        _id: "2",
        user: {
            name: "Mary",
            avatar: "https://randomuser.me/api/portraits/women/76.jpg",
            lastName: "Doe",
            username: "jdoe",
            phone: "123456789",
            email: "marydoe@test.com",
        },
        messages: [
            {
                text: "Hello, how are you?",
                createdAt: "2020-01-01T12:00:00.000Z",
                isMine: false,
            },
            {
                text: "I'm fine, thanks!",
                createdAt: "2020-01-01T12:01:00.000Z",
                isMine: true,
            },
            {
                text: "How are you?",
                createdAt: "2020-01-01T12:02:00.000Z",
                isMine: true,
            },
            {
                text: "What's up?",
                createdAt: "2020-01-01T12:03:00.000Z",
                isMine: false,
            }
        ],
    },
];

export default fakeChats;