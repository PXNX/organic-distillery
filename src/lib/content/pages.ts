// Page content, converted once from the original WordPress site.
import type { Page } from './types.js';

export const home: Page = {
	path: '/',
	title: 'Von der Natur begeistert',
	description: '',
	blocks: [
		{
			kind: 'feature',
			image: '/media/2017/10/OD_Web_Startbildschirm_01.webp'
		},
		{
			kind: 'feature',
			title: 'Organic Distillery',
			text: 'In der kleinen familieneigenen Brennerei am Bodensee vereint Christine Brugger ihr Wissen als Sensorik-Wissenschaftlerin mit dem Destillationshandwerk.',
			image: '/media/2017/10/organic-distillery.webp',
			link: {
				href: '/organic-distillery',
				label: 'mehr'
			}
		},
		{
			kind: 'feature',
			title: 'Ginn & Ginnie',
			image: '/media/2017/11/OD_Web_GinnGinnie.webp',
			link: {
				href: '/ginn-ginnie',
				label: 'mehr'
			}
		},
		{
			kind: 'feature',
			title: 'Essenzen',
			image: '/media/2017/11/OD_Web_Essenzen.webp',
			link: {
				href: '/essenzen',
				label: 'mehr'
			}
		},
		{
			kind: 'teaser',
			title: 'Bezugsquellen',
			level: 2,
			body: [
				[
					'Unsere Produkte sind in über 50 Geschäften erhältlich. Im Folgenden finden Sie eine Liste unserer Händler.'
				]
			],
			actions: [
				{
					href: '/bezug',
					label: 'Zur Übersicht'
				}
			]
		},
		{
			kind: 'feature',
			title: 'Über uns',
			image: '/media/2017/11/8_Kontakt_20170526_072810_SeeKlein.webp',
			link: {
				href: '/ueber-uns',
				label: 'mehr'
			}
		}
	]
};

export const brandGeist: Page = {
	path: '/brand-geist',
	title: 'Brand & Geist',
	description: '',
	blocks: [
		{
			kind: 'teaser',
			title: 'Coming soon',
			level: 1,
			body: []
		},
		{
			kind: 'gallery',
			images: [
				'/media/2017/10/4_Brand_2_Brand-Geist-.webp',
				'/media/2017/11/5_Geist_20160619_163453_Klein-1-470x310.webp'
			]
		}
	]
};

export const essenzen: Page = {
	path: '/essenzen',
	title: 'Essenzen',
	description: '',
	blocks: [
		{
			kind: 'teaser',
			title: 'Unsere Essenzen',
			level: 1,
			subtitle: 'Aromen & Düfte der Natur für Köche, Bartender, Genussmenschen',
			body: [
				[
					'Biologisch hergestellte Essenzen und Schlüsselaromen, die einzigartig in ihrer Klarheit und Tiefe sind. Eingeteilt in Aromafamilien nicht nur Köchen, Bartendern und Genussmenschen verständlich.'
				]
			]
		},
		{
			kind: 'teaser',
			title: 'Inspiration Essenzen',
			level: 2,
			body: [
				[
					{
						text: 'Mein Anliegen als Sensorik-Wissenschaftlerin ist eine breite Aromen-Bibliothek, mit schonend und natürlich gewonnen Schlüsselaromen. Diese werden als Essenzen Köchen, Bartendern und Genussmenschen zu Teil.',
						em: true
					}
				]
			]
		},
		{
			kind: 'text',
			title: 'Verwendung',
			background: '/media/2017/10/organic-distillery-verwendung.webp',
			columns: [
				[
					[
						'Die Organic Distillery Essenzen regen Nase und Gaumen gleichermaßen an und laden zum Experimentieren und Schärfen der Sinne ein.\nIn der ',
						{
							text: 'Küche',
							strong: true
						},
						' lassen sich Speisen mit den Essenzen subtil würzen und aromatisieren. So werden neue Geschmacks-Ebenen und Aromen-Eindrücke unterstützt – vielschichtig und komplex, elegant und überraschend.'
					]
				],
				[
					[
						'An der ',
						{
							text: 'Bar',
							strong: true
						},
						' können Drinks und Cocktails mit den Essenzen kreativ entwickelt und veredelt werden.'
					],
					[
						'Zu jeder Essenz gehört eine individuelle Aromabeschreibung, die den sensorischen Hintergrund sowie einfache Kombinationsmöglichkeiten beinhaltet.'
					]
				]
			]
		},
		{
			kind: 'text',
			title: 'Aromafamilien',
			image: '/media/2017/10/OD_Essenzen_Gruppe_Holger-Jacob_Web-470x310.webp',
			columns: [
				[
					[
						'„Ich habe meine Essenzen in Aromen-Familien und den dazu konnotierten Farben eingeteilt. Ein System, das jedem – Laie oder Profi – einen schnellen Zugang zu den einzelnen Essenzen und ihrer Verwendung ermöglicht.“'
					]
				]
			]
		}
	]
};

export const ginnGinnie: Page = {
	path: '/ginn-ginnie',
	title: 'Ginn & Ginnie',
	description: '',
	blocks: [
		{
			kind: 'teaser',
			title: 'Ginn & Ginnie',
			level: 1,
			body: [
				[
					'Ginn & Ginnie – zwei Gins, deren intensive Pflanzenaromen den Geniesser sensorisch nachhaltig in den Orient entführen. Ginnie wurde für Nasenmenschen entwickelt, Ginn für Gaumenmenschen. In sehr kleiner Auflage werden die beiden Geiste mit der Intensität des Orients am Bodensee hergestellt.'
				]
			]
		},
		{
			kind: 'text',
			title: 'Sensorische Wahrnehmung',
			image: '/media/2017/11/140801_GIN_695_HRk_KLEIN-470x310.webp',
			columns: [
				[
					[
						'Das Wissen um die unterschiedlich intensive Wahrnehmung von Aromen über Nase oder Gaumen, ist Grundlage von „Ginn“ und „Ginnie“. Das besonders intensive Geniessen von Aromen über den Gaumen wird tendenziell der maskulinen Wahrnehmung zugeordnet (Gaumenmenschen), das Erleben über die Nase tendenziell der femininen Wahrnehmung (Nasenmenschen).'
					]
				]
			]
		},
		{
			kind: 'teaser',
			title: 'Herstellung & Reifung',
			level: 2,
			body: [
				[
					'Nach schonender Destillation und mehrmonatigem Reifen werden die Gins von Hand in dunkelgrüne, aromaschützende Flaschen mit orientalischem Erscheinungsbild abgefüllt, verkorkt und verschnürt.'
				]
			]
		},
		{
			kind: 'text',
			title: 'Aus 1001 Nacht',
			background: '/media/2017/10/organic-distillery-schonendes-destillieren.webp',
			columns: [
				[
					[
						'Neben den Märchen aus 1001 Nacht verzaubern uns die Düfte und Gewürze des Orients. Der Orient gilt auch als Wiege des Destillationshandwerks, des Konservierens von Düften. Dieses Einfangen und konservieren von natürlichen Aromen aus biologisch nachhaltigen Pflanzen ist die Philosophie von Christine Brugger.'
					]
				],
				[
					[
						'Der Tradition folgend erfüllen die ersten beiden Gins ',
						{
							text: '„Ginn & Ginnie“',
							strong: true
						},
						', einmal entkorkt, dem Genießer drei sensorische Wünsche: Intensität, Komplexität und Nachhaltigkeit. Weitere Destillate aus der Organic Distillery am Bodensee in ihrer betörenden und begeisternden Form werden folgen.'
					]
				]
			]
		},
		{
			kind: 'text',
			title: 'Genuss Pur',
			image: '/media/2017/10/organic-distillery-genuss.webp',
			columns: [
				[
					[
						'Die sensorischen Dimensionen der beiden aromatischen Gins spielen mit der unterschiedlichen Wahrnehmung: direkt über die Nase oder indirekt über den Gaumen.\nFein dosiert, pur und bei Zimmertemperatur entfalten sie ihre volle Komplexität und Kraft.'
					]
				]
			]
		}
	]
};

export const organicDistillery: Page = {
	path: '/organic-distillery',
	title: 'Organic Distillery',
	description: '',
	blocks: [
		{
			kind: 'teaser',
			title: 'Organic Distillery',
			level: 1,
			subtitle: 'Die richtungsweisende Brennerei mit rein biologischen Wurzeln',
			body: [
				[
					'In der Organic Distillery, der kleinen, familieneigenen Brennerei am Bodensee vereint Christine Brugger ihr Wissen als Sensorik-Wissenschaftlerin mit dem traditionellen Destillationshandwerk.'
				]
			]
		},
		{
			kind: 'text',
			title: '100 Jahre Destillation',
			image: '/media/2017/11/140801_GIN_556_HRk_Klein-470x310.webp',
			columns: [
				[
					[
						'Auf dem Obsthof Brugger am Bodensee werden seit hundert Jahren und nun in 4. Generation Obstbrände destilliert. Dort gründete Christine Brugger 2014 die Organic Distillery – mit richtungsweisenden Ideen und Methoden vereint sie Wissenschaft und Handwerk.'
					]
				]
			]
		},
		{
			kind: 'text',
			title: 'Sensorisches Wissen',
			image: '/media/2017/10/2_OD_5_P1110479_Sensorisches-Wissen.webp',
			columns: [
				[
					[
						'Der Duft von Apfelblüten und wilden Kräutern begleitet Christine Brugger seit klein auf. Diese Welt der Düfte und Aromen wird zur beruflichen Passion der Sensorik-Wissenschaftlerin. Neben Leidenschaft ist für Christine ihre langjährige Erfahrung im Bereich der Sensorik Antrieb für außergewöhnlich vielschichtige Destillate.'
					]
				]
			]
		},
		{
			kind: 'teaser',
			title: 'Ingredienzien',
			level: 2,
			body: [
				[
					'Für ihre Destillate verwendet Christine Brugger aus Überzeugung nur Früchte, Pflanzen und Kräuter aus rein kontrolliert biologisch und nachhaltigem Anbau.'
				]
			]
		},
		{
			kind: 'text',
			title: 'Schonendes Destillieren',
			background: '/media/2017/10/organic-distillery-schonendes-destillieren.webp',
			columns: [
				[
					[
						'Das Wissen der Sensorik-Wissenschaftlerin und der konzentrierte Blick der Destillateurin gelten bei der schonenden Destillation jedem Detail. Schonend und langsam destilliert wird nur das Herzstück zur Essenz deren Aroma sich während der Reifezeit verdichtet. „Meine Destillate sind ungefiltert, so dass die wertvollen Aromen erhalten bleiben.'
					]
				],
				[
					[
						'Basierend auf dem sensorischen Optimum variiert der Alkoholgehalt bei den einzelnen Destillaten.“\nDestillate auf den Punkt gebracht, unverfälscht mit vielschichtiger Aromatik, einzigartig in ihrer Klarheit und Tiefe verkörpern die Produkte der Organic Distillery.'
					]
				]
			]
		}
	]
};

export const ueberUns: Page = {
	path: '/ueber-uns',
	title: 'Über uns',
	description: '',
	blocks: [
		{
			kind: 'teaser',
			title: 'Über uns',
			level: 1,
			body: []
		},
		{
			kind: 'text',
			title: 'Christine Brugger',
			image: '/media/2017/11/140801_GIN_929_HR_Klein-470x310.webp',
			columns: [
				[
					[
						'Ihre Leidenschaft für Düfte und der Wunsch diese auf natürliche Art und Weise einzufangen brennt in Christine von klein auf. Mit der Organic Distillery geht für sie ein langjähriger Traum in Erfüllung: in der familieneigenen Kupferdestille auf dem Demeterhof am Bodensee vereint sie Wissenschaft und Handwerk mit dem Ergebnis natürlich biologischer, schonend destillierter und vielschichtiger Essenzen.'
					]
				]
			]
		},
		{
			kind: 'teaser',
			title: 'Familie & Freunde',
			level: 1,
			body: [
				['Lydia & Bruno Brugger'],
				[
					'Den helfenden Händen:\nAnuschka, Barbara, Beatrice, Christoph, Dieter, Ernst, Esther, Karin, Lorenz, Marc, Marietta, Melanie, Michael, Thomas, Sabine, Sascha, Ute'
				]
			]
		}
	]
};
