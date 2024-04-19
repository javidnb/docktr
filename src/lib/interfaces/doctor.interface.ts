export type Doctor = {
	id: any;
	name: string;
	img?: string;
	branches: number[];
	slug: string;
	details: string;
	star: number;
	comments: number;
	userComments?: [];
	[key: string]: any;
};
