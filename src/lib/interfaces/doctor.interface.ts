export type Doctor = {
	id: any;
    name: string;
	img?: string;
	branches: number[];
    slug: string;
    details: string;
    [key: string]: any;
};