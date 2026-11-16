<script lang="ts">
	let { variant }: { variant: 'ginn' | 'ginnie' } = $props();

	const profiles = {
		ginn: {
			name: 'Ginn',
			subtitle: 'Organic unfiltered Dry Gin · 51 % Vol.',
			focus: 'Gaumenmensch',
			sensorial:
				'Die Aromen entfalten sich vor allem im Mund – herbe, holzig-harzige Akzente mit Zitrusnoten.',
			notes: ['Wacholder', 'Orange', 'Lorbeer', 'Rosmarin', 'Pfeffer'],
			character: ['Herb', 'Harzig', 'Zitrisch', 'Pikant'],
			finish: 'Ein leicht pfeffriges Prickeln mit langem, trockenem Nachhall.',
			image: '/media/2017/11/Ginn_500ml.webp'
		},
		ginnie: {
			name: 'Ginnie',
			subtitle: 'Organic unfiltered Dry Gin · 52 % Vol.',
			focus: 'Nasenmensch',
			sensorial:
				'Floral-würzig und bereits über die erste Nase sehr präsent – Nelke und Koriander tragen den Gaumen.',
			notes: ['Kardamom', 'Lavendel', 'Jasmin', 'Nelke', 'Koriander', 'Angelikawurzel'],
			character: ['Floral', 'Würzig', 'Elegant', 'Langanhaltend'],
			finish: 'Eine langanhaltende sensorische Wahrnehmung mit sanftem, aromatischem Ausklang.',
			image: '/media/2017/11/Ginnie_500ml.webp'
		}
	} as const;

	let profile = $derived(profiles[variant]);
</script>

<section class="aroma-profile" aria-labelledby="aroma-title">
	<span class="aroma-profile__ornament" aria-hidden="true">◇</span>
	<h2 id="aroma-title">Aroma-Profil: {profile.name}</h2>
	<p class="aroma-profile__subtitle">{profile.subtitle} · {profile.focus}</p>

	<div class="aroma-profile__body">
		<div class="aroma-profile__bottle">
			<img src={profile.image} alt={`${profile.name} Flasche`} loading="lazy" decoding="async" />
		</div>

		<div class="aroma-profile__details">
			<p class="aroma-profile__lead">{profile.sensorial}</p>

			<h3>Botanicals &amp; Aromen</h3>
			<ul class="aroma-profile__tags">
				{#each profile.notes as note (note)}
					<li>{note}</li>
				{/each}
			</ul>

			<h3>Sensorischer Charakter</h3>
			<ul class="aroma-profile__tags aroma-profile__tags--muted">
				{#each profile.character as trait (trait)}
					<li>{trait}</li>
				{/each}
			</ul>

			<h3>Abgang</h3>
			<p>{profile.finish}</p>
		</div>
	</div>

	<p class="aroma-profile__tip">
		<strong>Genusstipp:</strong> Pur bei Zimmertemperatur in kleinen Schlucken – so entfalten
		{profile.name}s Aromen ihre volle Komplexität.
	</p>
</section>
