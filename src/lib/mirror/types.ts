/** A single page crawled from the live site. */
export interface MirroredPage {
	path: string;
	title: string;
	description: string;
	html: string;
}

/** All content needed to render the mirrored site. */
export interface MirroredSite {
	pages: MirroredPage[];
	header: string;
	footer: string;
	ageCheck: string;
	order: string;
}
