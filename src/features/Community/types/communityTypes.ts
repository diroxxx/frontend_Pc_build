export interface User {
    id: number;
    username: string;
    nickname: string;
}

export interface PostImageDTO {
    id: number;
    imageUrl: string;
    filename: string;
    mimeType: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    user: User;
    authorName?: string;
    createdAt: number[];
    category?: Category;
    categoryName?: string;
    images: PostImageDTO[];
    thumbnailImageId?: number;
    commentCount?: number;
}
