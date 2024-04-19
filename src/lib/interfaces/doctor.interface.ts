export type Doctor = {
	id: any;
    name: string;
	img?: string;
	branches: number[];
    slug: string;
    details: string;
    star: number;
    comments: number;
    [key: string]: any;
};