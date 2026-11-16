<script lang="ts">
	interface Step {
		number: string;
		title: string;
		text: string;
		image: string;
		alt: string;
	}

	const steps: Step[] = [
		{
			number: 'I',
			title: 'Botanicals',
			text: 'Handverlesene, biologische Kräuter und Gewürze – inspiriert von den Düften des Orients.',
			image: '/media/2017/10/Coriandrum_Sativum_Koriander.webp',
			alt: 'Botanische Zeichnung von Koriander'
		},
		{
			number: 'II',
			title: 'Aroma infundieren',
			text: 'Die ätherischen Öle der Pflanzen werden eingefangen und an den Alkohol abgegeben: das Konservieren von Duft.',
			image: '/media/2017/10/organic-distillery-genuss.webp',
			alt: 'Gin und Aromen im Glas'
		},
		{
			number: 'III',
			title: 'Schonende Destillation',
			text: 'In sehr kleiner Auflage wird der Destillat schonend gebrannt – für Intensität und Komplexität.',
			image: '/media/2017/10/organic-distillery-schonendes-destillieren.webp',
			alt: 'Destillation in der Brennerei'
		},
		{
			number: 'IV',
			title: 'Reifung & Flaschengeist',
			text: 'Nach mehrmonatigem Reifen von Hand in dunkelgrüne Flaschen gefüllt, verkorkt und verschnürt.',
			image: '/media/2017/11/Ginn_200ml.webp',
			alt: 'Ginn Organic Dry Gin Flasche'
		}
	];
</script>

<section class="gin-process" aria-labelledby="gin-process-title">
	<span class="gin-process__ornament" aria-hidden="true">◇</span>
	<h2 id="gin-process-title">Vom Kraut zum Flaschengeist</h2>
	<p class="gin-process__intro">
		So entstehen Ginn &amp; Ginnie – vier Schritte, in denen sensorisches Wissen und
		Destillationshandwerk zusammenkommen.
	</p>

	<ol class="gin-process__steps">
		{#each steps as step (step.number)}
			<li class="gin-process__step">
				<div class="gin-process__image">
					<img src={step.image} alt={step.alt} loading="lazy" decoding="async" />
				</div>
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
