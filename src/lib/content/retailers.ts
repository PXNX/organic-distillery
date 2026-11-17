// Where to buy, converted once from the original WordPress site.
import type { Retailer } from './types.js';

export const retailerSections: {
	title: string;
	groups: { label: string; retailers: Retailer[] }[];
}[] = [
	{
		title: 'Direkte Email Bestellung mit Postversand',
		groups: [
			{
				label: 'Deutschland',
				retailers: [
					{
						city: 'Berlin',
						name: 'Manufactum Warenhaus im Haus Hardenberg',
						street: 'Hardenbergstrasse 4-5',
						zip: '10623 Berlin'
					},
					{
						city: 'Hamburg',
						name: 'Manufactum Warenhaus im Chilehaus',
						street: 'Fischertwiete 2',
						zip: '20095 Hamburg'
					},
					{
						city: 'Düsseldorf',
						name: 'Manufactum Warenhaus in der Steinstraße',
						street: 'Steinstrasse 4',
						zip: '40212 Düsseldorf'
					},
					{
						city: 'Waltrop',
						name: 'Manufactum Warenhaus, Gasthaus',
						street: 'Hiberniastrasse 4',
						zip: '45731 Waltrop'
					},
					{
						city: 'Köln',
						name: 'Manufactum Warenhaus im Disch-Haus Köln',
						street: 'Brückenstrasse 23',
						zip: '50667 Köln'
					},
					{
						city: 'Frankfurt',
						name: 'Manufactum Warenhaus im Opernturm Frankfurt',
						street: 'Bockenheimer Anlage 49-50',
						zip: '60322 Frankfurt a. M.'
					},
					{
						city: 'Stuttgart',
						name: 'Manufactum Warenhaus und Magazin® Stuttgart',
						street: 'Lautenschlagerstrasse 16',
						zip: '70173 Stuttgart'
					},
					{
						city: 'München',
						name: 'Dallmayr Delikatessenhaus',
						street: 'Dienerstrasse 14 / 15',
						zip: '80331 München'
					},
					{
						city: 'München',
						name: 'Manufactum Warenhaus im Alten Hof',
						street: 'Dienerstrasse 12',
						zip: '80331 München'
					},
					{
						city: 'München',
						name: 'Szenedrinks',
						street: 'Fraunhoferstrasse 14',
						zip: '80469 München'
					},
					{
						city: 'Friedrichshafen',
						name: 'Gessler 1862',
						street: 'Friedrichstrasse 53',
						zip: '88045 Fr’hafen'
					},
					{
						city: 'Lindau',
						name: 'Wein & Spirituosen Lammers & Lammers',
						street: 'Maximilianstrasse 15',
						zip: '88131 Lindau'
					},
					{
						city: 'Meersburg',
						name: 'Georg Hack - Haus der guten Weine',
						street: 'Schützengasse 1',
						zip: '88709 Meersburg'
					},
					{
						city: 'Passau',
						name: 'Feinkost Bachl',
						street: 'Rosstränke 13',
						zip: '94032 Passau'
					},
					{
						city: 'Villingen',
						name: 'Der Genussladen',
						street: 'Vorderer Eckweg 18',
						zip: '78048 Villingen'
					}
				]
			},
			{
				label: 'Österreich',
				retailers: [
					{
						city: 'Wien',
						name: 'Marco Simonis - Bastei 10',
						street: 'Dominikanerbastei 10',
						zip: '1010 Wien'
					},
					{
						city: 'Wien',
						name: 'Lingenhel',
						street: 'Landstrasser Hauptstrasse 74',
						zip: '1030 Wien'
					},
					{
						city: 'Wien',
						name: 'Alt Wien',
						street: 'Schleifmühlengasse 23',
						zip: '1040 Wien'
					},
					{
						city: 'Wien',
						name: 'Haug Delikatessen',
						street: 'Sonnbergmarkt 11',
						zip: '1090 Wien'
					},
					{
						city: 'Salzburg',
						name: 'Feinkost Heinrich Kölbl',
						street: 'Theatergasse 2',
						zip: '5020 Salzburg'
					},
					{
						city: 'Bregenz',
						name: 'Römer VII',
						street: 'Römerstrasse 7',
						zip: '6900 Bregenz'
					},
					{
						city: 'Graz',
						name: 'Delikatessen Frankowitsch',
						street: 'Stempfergasse 2-4',
						zip: '8010 Graz'
					}
				]
			},
			{
				label: 'Schweiz',
				retailers: [
					{
						city: 'Basel',
						name: 'Tellplatz 3',
						street: 'Gundeldingerstrasse 505',
						zip: '4053 Basel'
					},
					{
						city: 'Basel',
						name: 'Tanja Grandits',
						street: 'Bruderholzallee 422',
						zip: '4059 Basel'
					},
					{
						city: 'Eschenbach',
						name: 'Selection Widmer',
						street: 'Alte Kantonsstrasse 39',
						zip: '6274 Eschenbach'
					},
					{
						city: 'Davos',
						name: 'Kaufmann Weine',
						street: 'Dischmastrasse 7b',
						zip: '7260 Davos Dorf'
					},
					{
						city: 'Zürich',
						name: 'Berg und Tal Marktladen im Viadukt',
						street: 'Limmatstrasse 231',
						zip: '8004 Zürich'
					},
					{
						city: 'Zürich',
						name: 'Kosmos Kultur AG',
						street: 'Lagerstrasse 102',
						zip: '8004 Zürich'
					},
					{
						city: 'Zürich',
						name: 'Weindepot',
						street: 'Forchstrasse 260',
						zip: '8008 Zürich'
					},
					{
						city: 'Zürich',
						name: 'Vicino',
						street: 'Seefeldstrasse 212',
						zip: '8008 Zürich'
					},
					{
						city: 'St. Gallen',
						name: 'Vogelsanger Weine',
						street: 'Oberstrasse 271',
						zip: '9014 St. Gallen'
					}
				]
			}
		]
	},
	{
		title: 'Ausgewählte Restaurants & Bars',
		groups: [
			{
				label: 'Deutschland',
				retailers: [
					{
						city: 'Köln',
						name: 'Restaurant Le Moissonnier GmbH & Co. KG',
						street: 'Krefelder Straße 25',
						zip: '50670 Köln'
					},
					{
						city: 'München',
						name: "Schumann's",
						street: 'Odeonsplatz 6-7',
						zip: '80539 München'
					},
					{
						city: 'Friedrichshafen',
						name: 'Hotel Maier',
						street: 'Poststrasse 1-3',
						zip: '88048 Fr’hafen'
					},
					{
						city: 'Nonnenhorn',
						name: 'Hotel Restaurant Torkel',
						street: 'Seehalde 14',
						zip: '88149 Nonnenhorn'
					},
					{
						city: 'Ravensburg',
						name: 'Aurum',
						street: 'Rosenstrasse 16',
						zip: '88212 Ravensburg'
					}
				]
			},
			{
				label: 'Österreich',
				retailers: [
					{
						city: 'Wien',
						name: 'Restaurant Konstantin Filippou',
						street: 'Dominikanerbastei 17',
						zip: '1010 Wien'
					},
					{
						city: 'Wien',
						name: 'Restaurant Steirereck',
						street: 'Am Heumarkt 2 A',
						zip: '1030 Wien'
					},
					{
						city: 'Ybbs',
						name: 'Raw Selection',
						street: 'Herrengasse 3',
						zip: '3370 Ybbs'
					},
					{
						city: 'Langenlebahrn',
						name: 'Gastwirtschaft zum Floh',
						street: 'Tullnerstrasse 1',
						zip: '3425 Langenlebahrn'
					},
					{
						city: 'Stuben am Arlberg',
						name: 'Restaurant Fuxbau',
						street: 'Dorfstrasse 22',
						zip: '6762 Stuben'
					},
					{
						city: 'Lochau',
						name: 'Restaurant Mangold',
						street: 'Pfänderstrasse 1',
						zip: '6911 Lochau'
					}
				]
			},
			{
				label: 'Schweiz',
				retailers: [
					{
						city: 'Bern',
						name: 'Restaurant Schöngrün im Paul Klee Zentrum',
						street: 'Monument im Fruchtland 1',
						zip: '3000 Bern'
					},
					{
						city: 'Basel',
						name: 'Restaurant Stucki',
						street: 'Bruderholzallee 422',
						zip: '4059 Basel'
					},
					{
						city: 'Zürich',
						name: 'Hotel Widder',
						street: 'Rennweg 7',
						zip: '8001 Zürich'
					},
					{
						city: 'Zürich',
						name: 'Kronenhalle Bar',
						street: 'Rämistrasse 4',
						zip: '8001 Zürich'
					},
					{
						city: 'Zürich',
						name: 'Gaucho',
						street: 'Nietengasse 18',
						zip: '8004 Zürich'
					},
					{
						city: 'Zürich',
						name: 'Bar Dante',
						street: 'Zwinglistrasse 22',
						zip: '8004 Zürich'
					},
					{
						city: 'Zürich',
						name: 'Maison Manesse',
						street: 'Hopfenstrasse 2',
						zip: '8048 Zürich'
					},
					{
						city: 'Zürich',
						name: 'Restaurant Maison Manesse',
						street: 'Hopfenstrasse 2',
						zip: '8048 Zürich'
					},
					{
						city: 'Zürich',
						name: 'Restaurant Malabar',
						street: 'Wallisellerstrasse 11',
						zip: '8050 Zürich'
					},
					{
						city: 'Heiden',
						name: 'Restaurant Fernsicht',
						street: 'Seeallee 10',
						zip: '9410 Heiden'
					}
				]
			}
		]
	}
];

export const retailerPdf = '/media/2017/11/OD_Bezugsquellen_DACH_1711.pdf';
