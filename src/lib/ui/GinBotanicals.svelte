<script lang="ts">
	type Note = 'Kopf' | 'Herz' | 'Basis';
	type Icon =
		| 'juniper'
		| 'orange'
		| 'laurel'
		| 'rosemary'
		| 'pepper'
		| 'cardamom'
		| 'lavender'
		| 'jasmine'
		| 'clove'
		| 'coriander'
		| 'angelica';
	interface Botanical {
		name: string;
		latin: string;
		aroma: string;
		note: Note;
		icon: Icon;
	}

	let { variant }: { variant: 'ginn' | 'ginnie' } = $props();

	const gins = {
		ginn: {
			name: 'Ginn',
			abv: '51 % Vol.',
			lead: 'Für Gaumenmenschen: Die Aromen entfalten sich vor allem im Mund – herb, holzig-harzig, mit Zitrusnoten.',
			focus: 78,
			character: ['Herb', 'Harzig', 'Zitrisch', 'Pikant'],
			finish: 'Ein leicht pfeffriges Prickeln mit langem, trockenem Nachhall.',
			botanicals: [
				{
					name: 'Orange',
					latin: 'Citrus sinensis',
					aroma: 'schalig, frisch',
					note: 'Kopf',
					icon: 'orange'
				},
				{
					name: 'Lorbeer',
					latin: 'Laurus nobilis',
					aroma: 'herb-würzig',
					note: 'Herz',
					icon: 'laurel'
				},
				{
					name: 'Rosmarin',
					latin: 'Rosmarinus officinalis',
					aroma: 'harzig, krautig',
					note: 'Herz',
					icon: 'rosemary'
				},
				{
					name: 'Wacholder',
					latin: 'Juniperus communis',
					aroma: 'kiefernwürzig, harzig',
					note: 'Basis',
					icon: 'juniper'
				},
				{
					name: 'Pfeffer',
					latin: 'Piper nigrum',
					aroma: 'prickelnd, scharf',
					note: 'Basis',
					icon: 'pepper'
				}
			]
		},
		ginnie: {
			name: 'Ginnie',
			abv: '52 % Vol.',
			lead: 'Für Nasenmenschen: floral-würzig und schon mit der ersten Nase sehr präsent – Nelke und Koriander tragen den Gaumen.',
			focus: 22,
			character: ['Floral', 'Würzig', 'Elegant', 'Langanhaltend'],
			finish: 'Eine langanhaltende Wahrnehmung mit sanftem, aromatischem Ausklang.',
			botanicals: [
				{
					name: 'Kardamom',
					latin: 'Elettaria cardamomum',
					aroma: 'ätherisch, kühl',
					note: 'Kopf',
					icon: 'cardamom'
				},
				{
					name: 'Lavendel',
					latin: 'Lavandula angustifolia',
					aroma: 'blumig, krautig',
					note: 'Kopf',
					icon: 'lavender'
				},
				{
					name: 'Jasmin',
					latin: 'Jasminum officinale',
					aroma: 'floral, süßlich',
					note: 'Herz',
					icon: 'jasmine'
				},
				{
					name: 'Nelke',
					latin: 'Syzygium aromaticum',
					aroma: 'warm-würzig',
					note: 'Herz',
					icon: 'clove'
				},
				{
					name: 'Koriander',
					latin: 'Coriandrum sativum',
					aroma: 'zitrisch-würzig',
					note: 'Herz',
					icon: 'coriander'
				},
				{
					name: 'Angelikawurzel',
					latin: 'Angelica archangelica',
					aroma: 'erdig, bindet die Aromen',
					note: 'Basis',
					icon: 'angelica'
				}
			]
		}
	} satisfies Record<string, { botanicals: Botanical[] } & Record<string, unknown>>;

	const gin = $derived(gins[variant]);
	const notes: Note[] = ['Kopf', 'Herz', 'Basis'];
</script>

{#snippet icon(kind: Icon)}
	<svg viewBox="0 0 48 48" aria-hidden="true">
		{#if kind === 'juniper'}
			<path d="M10 40 C18 30 26 22 40 8" />
			<path d="M16 32 l-8 -4 M20 27 l-9 -2 M25 22 l-6 -7 M30 17 l-2 -9 M22 30 l8 3 M28 24 l9 1" />
			<circle cx="24" cy="34" r="4.5" /><circle cx="32" cy="30" r="4.5" /><circle
				cx="28"
				cy="38.5"
				r="4.5"
			/>
			<path d="M23 32.5 l2 1 M31 28.5 l2 1" />
		{:else if kind === 'orange'}
			<circle cx="24" cy="24" r="16" /><circle cx="24" cy="24" r="12.5" />
			{#each [0, 45, 90, 135, 180, 225, 270, 315] as angle (angle)}
				<path d="M24 24 L24 12.5" transform={`rotate(${angle} 24 24)`} />
			{/each}
			<circle cx="24" cy="24" r="1.6" />
		{:else if kind === 'laurel'}
			<path d="M8 42 C18 32 28 20 40 6" />
			<path d="M16 33 C8 32 6 24 10 18 C16 22 18 28 16 33 Z" />
			<path d="M26 21 C34 22 40 16 40 10 C32 10 27 15 26 21 Z" />
			<path d="M21 27 C14 22 16 12 22 8 C25 14 25 22 21 27 Z" />
		{:else if kind === 'rosemary'}
			<path d="M24 44 V6" />
			{#each [10, 16, 22, 28, 34, 40] as y (y)}
				<path
					d={`M24 ${y} C19 ${y - 2} 15 ${y - 5} 13 ${y - 8} M24 ${y} C29 ${y - 2} 33 ${y - 5} 35 ${y - 8}`}
				/>
			{/each}
		{:else if kind === 'pepper'}
			<circle cx="17" cy="20" r="7" /><circle cx="31" cy="20" r="7" /><circle
				cx="24"
				cy="32"
				r="7"
			/>
			<path d="M13 18 c2 2 6 2 8 0 M27 18 c2 2 6 2 8 0 M20 30 c2 2 6 2 8 0" />
		{:else if kind === 'cardamom'}
			<path d="M24 6 C34 14 34 34 24 42 C14 34 14 14 24 6 Z" />
			<path d="M24 8 V40 M19.5 12 C17 22 17 28 19.5 37 M28.5 12 C31 22 31 28 28.5 37" />
			<path d="M24 42 v3" />
		{:else if kind === 'lavender'}
			<path d="M24 44 V14 M24 30 C18 28 14 24 12 18 M24 36 C30 34 34 30 36 24" />
			{#each [8, 13, 18, 23] as y (y)}
				<ellipse cx="21" cy={y} rx="2.6" ry="3.6" /><ellipse
					cx="27"
					cy={y + 2.5}
					rx="2.6"
					ry="3.6"
				/>
			{/each}
		{:else if kind === 'jasmine'}
			{#each [0, 72, 144, 216, 288] as angle (angle)}
				<path
					d="M24 24 C20 18 20 10 24 6 C28 10 28 18 24 24 Z"
					transform={`rotate(${angle} 24 24)`}
				/>
			{/each}
			<circle cx="24" cy="24" r="3" />
		{:else if kind === 'clove'}
			<path d="M22 22 L23 44 h2 L26 22" />
			<path d="M18 22 h12 l-2 -5 h-8 Z" />
			<circle cx="24" cy="11" r="4" /><circle cx="19" cy="13" r="3" /><circle
				cx="29"
				cy="13"
				r="3"
			/>
		{:else if kind === 'coriander'}
			<circle cx="18" cy="30" r="6" /><circle cx="31" cy="33" r="6" /><circle
				cx="25"
				cy="21"
				r="5"
			/>
			<path d="M15 28 c2 -1 4 -1 6 1 M28 31 c2 -1 4 -1 6 1" />
			<path d="M30 16 C30 10 36 6 42 7 C41 13 36 17 30 16 Z M30 16 C34 12 37 10 40 9" />
		{:else}
			<path d="M24 44 V22" />
			{#each [-16, -8, 0, 8, 16] as dx (dx)}
				<path d={`M24 22 L${24 + dx} ${dx === 0 ? 8 : 10 + Math.abs(dx) / 3}`} />
				<circle cx={24 + dx} cy={dx === 0 ? 7 : 9 + Math.abs(dx) / 3} r="2.4" />
			{/each}
			<path d="M24 34 C18 32 14 28 12 24 M24 38 C30 36 34 32 36 28" />
		{/if}
	</svg>
{/snippet}

<section class="gin-botanicals" aria-labelledby="gin-botanicals-title">
	<div class="gin-botanicals__inner">
		<figure class="gin-botanicals__photo">
			<img
				src="/media/2017/10/gin-detail.webp"
				alt="Botanicals, zur Form einer Flasche gelegt"
				loading="lazy"
				decoding="async"
			/>
		</figure>

		<div class="gin-botanicals__content">
			<p class="gin-botanicals__eyebrow">
				<span aria-hidden="true">◇</span> Was in der Flasche steckt
			</p>
			<h2 id="gin-botanicals-title">Die Botanicals von {gin.name}</h2>
			<p class="gin-botanicals__lead">{gin.lead}</p>

			<div class="gin-botanicals__notes">
				{#each notes as note (note)}
					{@const items = gin.botanicals.filter((botanical) => botanical.note === note)}
					{#if items.length > 0}
						<div class="botanical-note">
							<h3>{note}note</h3>
							<ul>
								{#each items as botanical (botanical.name)}
									<li class="botanical">
										<span class="botanical__icon">{@render icon(botanical.icon)}</span>
										<span class="botanical__text">
											<strong>{botanical.name}</strong>
											<em>{botanical.latin}</em>
											<small>{botanical.aroma}</small>
										</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{/each}
			</div>

			<div class="gin-botanicals__profile">
				<div class="sense-scale" style={`--focus: ${gin.focus}%`}>
					<span>Nase</span>
					<div
						class="sense-scale__track"
						role="img"
						aria-label={`${gin.name} wirkt vor allem ${gin.focus > 50 ? 'am Gaumen' : 'in der Nase'}`}
					>
						<i></i>
					</div>
					<span>Gaumen</span>
				</div>
				<ul class="gin-botanicals__character">
					{#each gin.character as trait (trait)}
						<li>{trait}</li>
					{/each}
				</ul>
				<dl>
					<div>
						<dt>Alkohol</dt>
						<dd>{gin.abv}</dd>
					</div>
					<div>
						<dt>Abgang</dt>
						<dd>{gin.finish}</dd>
					</div>
					<div>
						<dt>Genuss</dt>
						<dd>Pur, bei Zimmertemperatur, in kleinen Schlucken.</dd>
					</div>
				</dl>
			</div>
		</div>
	</div>
</section>
