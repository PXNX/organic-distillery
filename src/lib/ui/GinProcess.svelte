<script lang="ts">
	interface Step {
		number: string;
		key: 'botanicals' | 'maceration' | 'distillation' | 'bottling';
		title: string;
		text: string;
	}

	const steps: Step[] = [
		{
			number: 'I',
			key: 'botanicals',
			title: 'Botanicals',
			text: 'Handverlesene, biologische Kräuter und Gewürze – Wacholder, Koriander, Kardamom, Lavendel – inspiriert von den Düften des Orients.'
		},
		{
			number: 'II',
			key: 'maceration',
			title: 'Aroma infundieren',
			text: 'In der Kupferblase geben die Pflanzen ihre ätherischen Öle an den Alkohol ab: das Konservieren von Duft.'
		},
		{
			number: 'III',
			key: 'distillation',
			title: 'Schonende Destillation',
			text: 'Über die Kolonne steigt der Dampf auf, kondensiert im Kühler und wird in sehr kleiner Auflage langsam aufgefangen.'
		},
		{
			number: 'IV',
			key: 'bottling',
			title: 'Reifung & Ginnie',
			text: 'Nach mehrmonatigem Reifen ungefiltert von Hand in dunkle Flaschen gefüllt, verkorkt und verschnürt.'
		}
	];

	let active = $state<Step['key'] | null>(null);
	const dim = (key: Step['key']) => active !== null && active !== key;

	// One shared path: vapour leaves the pot, climbs the column and runs into the condenser.
	const vapourPath =
		'M340 172 C 340 128, 350 112, 372 112 C 410 104, 440 98, 470 104 L 470 104 C 480 104, 490 106, 500 112 C 530 118, 560 124, 586 146';
</script>

<section class="gin-process" aria-labelledby="gin-process-title">
	<span class="gin-process__ornament" aria-hidden="true">◇</span>
	<h2 id="gin-process-title">Vom Kraut zur Ginnie</h2>
	<p class="gin-process__intro">
		So entstehen Ginn &amp; Ginnie – vier Schritte, in denen sensorisches Wissen und
		Destillationshandwerk in der Kupferbrennblase am Bodensee zusammenkommen.
	</p>

	<figure class="gin-process__figure">
		<svg
			class="still"
			viewBox="0 0 900 380"
			role="img"
			aria-labelledby="still-title"
			class:has-active={active !== null}
		>
			<title id="still-title">
				Zeichnung der Destillation: Botanicals, Kupferbrennblase mit Kolonne, Kühler und Flasche
			</title>
			<defs>
				<linearGradient id="still-copper" x1="0" x2="1">
					<stop offset="0" stop-color="#8a4f24" />
					<stop offset="0.35" stop-color="#d08a4f" />
					<stop offset="0.55" stop-color="#f0bd84" />
					<stop offset="1" stop-color="#9a5a2a" />
				</linearGradient>
				<linearGradient id="still-glass" x1="0" x2="1">
					<stop offset="0" stop-color="#1c2419" />
					<stop offset="0.4" stop-color="#3a4a33" />
					<stop offset="1" stop-color="#151a12" />
				</linearGradient>
				<linearGradient id="still-gold-sheen" x1="0" x2="1">
					<stop offset="0" stop-color="var(--mystic-gold)" stop-opacity="0" />
					<stop offset="0.5" stop-color="#f4e0b0" stop-opacity="0.9" />
					<stop offset="1" stop-color="var(--mystic-gold)" stop-opacity="0" />
				</linearGradient>
				<pattern
					id="still-hatch"
					width="6"
					height="6"
					patternUnits="userSpaceOnUse"
					patternTransform="rotate(35)"
				>
					<line x1="0" y1="0" x2="0" y2="6" stroke="#5a3415" stroke-width="1" opacity="0.45" />
				</pattern>
				<clipPath id="still-bottle-inside">
					<path
						d="M736 276 c0 10 28 14 28 34 v44 c0 5 -3 7 -8 7 h-56 c-5 0 -8 -2 -8 -7 v-44 c0 -20 28 -24 28 -34 z"
					/>
				</clipPath>
				<path id="still-vapour" d={vapourPath} />
			</defs>

			<!-- Ground line and engraved frame -->
			<path class="still__ground" d="M30 362 H870" />

			<!-- I · Botanicals: mortar with sprigs and berries -->
			<g
				class="still__part"
				class:is-dim={dim('botanicals')}
				class:is-active={active === 'botanicals'}
			>
				<path class="still__line still__fill-paper" d="M60 300 Q120 372 180 300 Z" />
				<path class="still__line" d="M56 300 H184" />
				<path class="still__hatch" d="M70 304 Q120 360 170 304 Z" />
				<g class="still__sprig">
					<path class="still__line" d="M100 300 C 96 270, 90 252, 78 236" />
					<path class="still__leaf" d="M90 262 c -14 -4 -22 -14 -22 -24 c 12 2 20 10 22 24 z" />
					<path class="still__leaf" d="M95 280 c 12 -8 24 -8 32 -2 c -10 8 -22 8 -32 2 z" />
					<path class="still__line" d="M130 300 C 134 268, 146 250, 160 240" />
					<path class="still__leaf" d="M140 268 c 4 -14 14 -20 24 -20 c -2 12 -12 20 -24 20 z" />
				</g>
				<g class="still__berries">
					<circle cx="112" cy="292" r="7" />
					<circle cx="126" cy="288" r="6" />
					<circle cx="120" cy="278" r="5.5" />
					<circle cx="146" cy="294" r="5" />
				</g>
				<path class="still__flow" d="M170 262 C 210 220, 260 176, 318 170" />
			</g>

			<!-- II · Copper pot on its firebox -->
			<g
				class="still__part"
				class:is-dim={dim('maceration')}
				class:is-active={active === 'maceration'}
			>
				<rect class="still__line still__fill-ink" x="262" y="300" width="160" height="50" rx="3" />
				<path class="still__line" d="M262 318 H422 M262 334 H422" opacity="0.4" />
				<g class="still__flames">
					<path d="M300 300 c -8 -12 -2 -22 6 -28 c 0 10 10 12 6 28 z" />
					<path d="M336 300 c -10 -16 -2 -28 8 -36 c 0 14 12 16 6 36 z" />
					<path d="M374 300 c -8 -12 -2 -22 6 -28 c 0 10 10 12 6 28 z" />
				</g>
				<path
					class="still__line still__copper"
					d="M268 296 C 244 240, 266 180, 340 172 C 414 180, 436 240, 412 296 Z"
				/>
				<path
					class="still__hatch-copper"
					d="M380 186 C 420 206, 428 252, 410 292 L 392 292 C 404 252, 398 214, 372 190 Z"
				/>
				<path class="still__sheen" d="M290 230 C 292 206, 306 192, 324 186" />
				<!-- Liquid sloshing inside the pot -->
				<path class="still__wash" d="M262 262 C 300 252, 380 272, 418 258" />
				<!-- Helmet -->
				<rect class="still__line still__copper" x="326" y="142" width="28" height="32" />
				<path class="still__line still__copper" d="M310 146 C 310 112, 370 112, 370 146 Z" />
			</g>

			<!-- III · Column with portholes, swan neck and condenser -->
			<g
				class="still__part"
				class:is-dim={dim('distillation')}
				class:is-active={active === 'distillation'}
			>
				<path class="still__line still__pipe" d="M370 124 C 410 104, 440 98, 456 102" />
				<rect class="still__line still__copper" x="452" y="96" width="40" height="200" rx="6" />
				{#each [130, 180, 230] as y (y)}
					<circle class="still__line still__porthole" cx="472" cy={y} r="12" />
					<circle class="still__porthole-glint" cx="468" cy={y - 4} r="3" />
				{/each}
				<path class="still__line" d="M452 296 v 54 M492 296 v 54" />
				<path class="still__line still__pipe" d="M492 110 C 530 116, 560 124, 586 146" />
				<!-- Condenser tank with coil -->
				<rect
					class="still__line still__fill-water"
					x="570"
					y="140"
					width="80"
					height="150"
					rx="4"
				/>
				<path
					class="still__coil"
					d="M586 150 C 640 158, 640 172, 586 180 C 640 188, 640 202, 586 210 C 640 218, 640 232, 586 240 C 640 248, 640 262, 610 270"
				/>
				<path class="still__line" d="M570 290 v 60 M650 290 v 60" />
				<path
					class="still__line still__pipe"
					d="M610 270 V 300 C 610 312, 640 236, 690 236 H 736 V 256"
				/>
			</g>

			<!-- Vapour travelling through the still -->
			<g class="still__vapour" aria-hidden="true">
				{#each [0, 1, 2, 3, 4] as index (index)}
					<circle r="4">
						<animateMotion
							dur="4.5s"
							repeatCount="indefinite"
							begin={`${index * 0.9}s`}
							rotate="auto"
						>
							<mpath href="#still-vapour" />
						</animateMotion>
						<animate
							attributeName="opacity"
							values="0;0.8;0.8;0"
							keyTimes="0;0.15;0.8;1"
							dur="4.5s"
							begin={`${index * 0.9}s`}
							repeatCount="indefinite"
						/>
					</circle>
				{/each}
			</g>

			<!-- IV · Drops into the apothecary bottle -->
			<g class="still__part" class:is-dim={dim('bottling')} class:is-active={active === 'bottling'}>
				<circle class="still__drop" cx="736" cy="262" r="3.2" />
				<circle class="still__drop still__drop--late" cx="736" cy="262" r="3.2" />
				<path
					class="still__line still__bottle"
					d="M722 268 h28 v8 c0 10 28 14 28 34 v44 c0 5 -3 7 -8 7 h-68 c-5 0 -8 -2 -8 -7 v-44 c0 -20 28 -24 28 -34 z"
				/>
				<g clip-path="url(#still-bottle-inside)">
					<rect class="still__gin" x="690" y="290" width="92" height="80" />
				</g>
				<path class="still__line still__label" d="M712 318 l24 -14 l24 14 l-24 14 z" />
				<text class="still__label-text" x="736" y="321" text-anchor="middle">G</text>
				<rect class="still__cork" x="726" y="256" width="20" height="12" rx="2" />
				<path class="still__sheen" d="M708 318 v 30" />
			</g>

			<!-- Step markers -->
			{#each [{ n: 'I', x: 120, y: 214, key: 'botanicals' }, { n: 'II', x: 250, y: 162, key: 'maceration' }, { n: 'III', x: 530, y: 76, key: 'distillation' }, { n: 'IV', x: 800, y: 246, key: 'bottling' }] as marker (marker.n)}
				<g
					class="still__marker"
					class:is-active={active === marker.key}
					transform={`translate(${marker.x} ${marker.y})`}
				>
					<circle r="15" />
					<text text-anchor="middle" dominant-baseline="central">{marker.n}</text>
				</g>
			{/each}
		</svg>
	</figure>

	<ol class="gin-process__steps">
		{#each steps as step (step.number)}
			<li
				class="gin-process__step"
				class:is-active={active === step.key}
				onmouseenter={() => (active = step.key)}
				onmouseleave={() => (active = null)}
			>
				<span class="gin-process__number" aria-hidden="true">{step.number}</span>
				<h3>{step.title}</h3>
				<p>{step.text}</p>
			</li>
		{/each}
	</ol>

	<div class="gin-process__note">
		<span aria-hidden="true">◇</span>
		<p>
			<strong>Ginn für Gaumenmenschen · Ginnie für Nasenmenschen.</strong> Beide entfalten ihre volle
			Komplexität pur, bei Zimmertemperatur und in kleinen Schlucken.
		</p>
	</div>
</section>
