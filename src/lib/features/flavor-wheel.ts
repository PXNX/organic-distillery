export interface WheelEssence {
	name: string;
	path: string;
	pairings: string[];
}

export interface WheelFamily {
	name: string;
	color: string;
	light: string;
	essences: [WheelEssence, WheelEssence];
}

export interface WheelSegment {
	path: string;
	labelX: number;
	labelY: number;
	rotation: number;
	family: string;
	color: string;
	essence?: WheelEssence;
}

/** The aroma families from the original "Aromarad der ersten Essenzen". */
export const flavorFamilies: WheelFamily[] = [
	{
		name: 'ZITRUS',
		color: '#f2d117',
		light: '#fff0a8',
		essences: [
			{
				name: 'Mandarine',
				path: '/essenzen/mandarine-geist',
				pairings: ['Desserts', 'Karotten', 'Geflügel']
			},
			{
				name: 'Zitronen Verbena',
				path: '/essenzen/zitronen-verbena-geist',
				pairings: ['Couscous', 'Spargel', 'Curries']
			}
		]
	},
	{
		name: 'FRUCHTIG',
		color: '#f2a33c',
		light: '#ffe0b8',
		essences: [
			{
				name: 'Brombeere',
				path: '/essenzen/brombeer-geist',
				pairings: ['Rindfleisch', 'Frischkäse', 'Radicchio']
			},
			{
				name: 'Vogelbeere',
				path: '/essenzen/vogelbeere-geist',
				pairings: ['Reisgerichte', 'Chutney', 'Wild']
			}
		]
	},
	{
		name: 'FLORAL',
		color: '#8d6aa3',
		light: '#e3d3eb',
		essences: [
			{
				name: 'Rosenmonarde',
				path: '/essenzen/rosen-monarde-geist',
				pairings: ['Couscous', 'Fruchtsalate', 'Gemüsegerichte']
			},
			{
				name: 'Koriander',
				path: '/essenzen/137-2',
				pairings: ['Apfel & Birne', 'Hülsenfrüchte', 'Wurzelgemüse']
			}
		]
	},
	{
		name: 'GRÜN',
		color: '#4a9c3d',
		light: '#d5e8ce',
		essences: [
			{
				name: 'Argentinische Minze',
				path: '/essenzen/argentinische-minze-geist',
				pairings: ['Lachs', 'Blattsalate', 'Dunkle Schokolade']
			},
			{
				name: 'Eucalyptus',
				path: '/essenzen/eucalyptus-geist',
				pairings: ['Lamm', 'Himbeere', 'Linsengerichte']
			}
		]
	},
	{
		name: 'HERBAL',
		color: '#9db62c',
		light: '#e9efc4',
		essences: [
			{
				name: 'Cistrose',
				path: '/essenzen/cistrose-geist',
				pairings: ['Eintopf', 'Frischkäse', 'Wurstgerichte']
			},
			{
				name: 'Silber Wermut',
				path: '/essenzen/silber-wermut-geist',
				pairings: ['Pilzgerichte', 'Fisch & Meeresfrüchte', 'Würzige Drinks']
			}
		]
	}
];

const polar = (cx: number, cy: number, radius: number, angle: number) => {
	const rad = (angle * Math.PI) / 180;
	return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
};

/** Finds the colour family for an essence detail path. */
export function familyForPath(path: string): WheelFamily | undefined {
	return flavorFamilies.find((family) => family.essences.some((essence) => essence.path === path));
}

/** SVG path for an annular sector, used by both rings of the wheel. */
export function sectorPath(
	cx: number,
	cy: number,
	outer: number,
	inner: number,
	start: number,
	end: number
): string {
	const a = polar(cx, cy, outer, start);
	const b = polar(cx, cy, outer, end);
	const c = polar(cx, cy, inner, end);
	const d = polar(cx, cy, inner, start);
	return `M ${a.x} ${a.y} A ${outer} ${outer} 0 0 1 ${b.x} ${b.y} L ${c.x} ${c.y} A ${inner} ${inner} 0 0 0 ${d.x} ${d.y} Z`;
}

export interface WheelGeometry {
	outer: WheelSegment[];
	inner: WheelSegment[];
}

/** Builds both rings of the wheel with label positions and rotations. */
export function buildWheel(families: WheelFamily[] = flavorFamilies): WheelGeometry {
	const cx = 200;
	const cy = 200;
	const familyAngle = 360 / families.length;
	const startOffset = -126;
	const outer: WheelSegment[] = [];
	const inner: WheelSegment[] = [];

	families.forEach((family, familyIndex) => {
		const familyStart = startOffset + familyIndex * familyAngle;
		const familyEnd = familyStart + familyAngle;
		const familyMid = (familyStart + familyEnd) / 2;
		const outerLabel = polar(cx, cy, 156, familyMid);
		outer.push({
			path: sectorPath(cx, cy, 180, 130, familyStart, familyEnd),
			labelX: outerLabel.x,
			labelY: outerLabel.y,
			rotation: familyMid + 90,
			family: family.name,
			color: family.color
		});

		family.essences.forEach((essence, essenceIndex) => {
			const start = familyStart + essenceIndex * (familyAngle / 2);
			const end = start + familyAngle / 2;
			const mid = (start + end) / 2;
			const label = polar(cx, cy, 101, mid);
			inner.push({
				path: sectorPath(cx, cy, 126, 76, start, end),
				labelX: label.x,
				labelY: label.y,
				rotation: mid + 90,
				family: family.name,
				color: family.light,
				essence
			});
		});
	});

	return { outer, inner };
}

/** An arc used as a textPath; runs counter-clockwise on the lower half so text stays upright. */
export function labelArc(cx: number, cy: number, r: number, start: number, end: number): string {
	const mid = (((start + end) / 2) % 360 + 360) % 360;
	const flip = mid > 0 && mid < 180;
	const from = polar(cx, cy, r, flip ? end : start);
	const to = polar(cx, cy, r, flip ? start : end);
	return `M ${from.x} ${from.y} A ${r} ${r} 0 0 ${flip ? 0 : 1} ${to.x} ${to.y}`;
}

export interface CompassFamily {
	family: WheelFamily;
	path: string;
	label: string;
}

export interface CompassSegment {
	family: WheelFamily;
	essence: WheelEssence;
	path: string;
	label: string;
	/** Centre of the drawing thumbnail inside the segment. */
	x: number;
	y: number;
}

/** Geometry for the aroma compass: a family ring around ten essence segments. */
export function aromaCompass(size = 600, families: WheelFamily[] = flavorFamilies) {
	const c = size / 2;
	const step = 360 / families.length;
	const start = -90 - step / 2;
	const rings = { outer: c - 4, family: c - 42, essence: c * 0.52 };
	const familyArcs: CompassFamily[] = [];
	const segments: CompassSegment[] = [];

	families.forEach((family, index) => {
		const a0 = start + index * step;
		const a1 = a0 + step;
		familyArcs.push({
			family,
			path: sectorPath(c, c, rings.outer, rings.family + 2, a0 + 0.6, a1 - 0.6),
			label: labelArc(c, c, (rings.outer + rings.family) / 2, a0, a1)
		});
		family.essences.forEach((essence, essenceIndex) => {
			const s0 = a0 + essenceIndex * (step / 2);
			const s1 = s0 + step / 2;
			const mid = polar(c, c, (rings.family + rings.essence) / 2 + 6, (s0 + s1) / 2);
			segments.push({
				family,
				essence,
				path: sectorPath(c, c, rings.family - 2, rings.essence, s0 + 0.5, s1 - 0.5),
				label: labelArc(c, c, rings.family - 16, s0, s1),
				x: mid.x,
				y: mid.y
			});
		});
	});

	return { size, center: c, rings, familyArcs, segments };
}
