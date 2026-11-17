// Legal texts, converted once from the original WordPress site.
import type { Rich } from './types.js';

export interface LegalText {
	title: string;
	sections: { heading?: string; paragraphs: Rich[] }[];
}

export const impressum: LegalText = {
	title: 'Impressum',
	sections: [
		{
			paragraphs: [
				['Organic Distillery GmbH\nDornierstrasse 139\n88048 Friedrichshafen\nBodensee\nGermany'],
				[
					{
						text: 'contact@organic-distillery.com',
						href: 'mailto:contact@organic-distillery.com'
					},
					'\n+49 (0) 178 172 4773'
				],
				['Geschäftsführung: Christine Brugger\nSitz Friedrichshafen'],
				['DE-ÖKO-007\nHandelsregistereintrag HRB 731086  Amtsgericht Ulm\nUst-IdNr. DE 296592121']
			]
		},
		{
			heading: 'Urheberrecht',
			paragraphs: [
				[
					'Die durch die Betreiber erstellten Inhalte und Werke auf diesen Webseiten unterliegen dem deutschen Urheberrecht. Das Herunterladen, Drucken und Speichern einzelner Seiten der Website darf nur zum privaten, nicht zum kommerziellen Gebrauch erfolgen.\nDie Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung. Jegliche andere Vervielfältigung ist ohne vorherige ausdrückliche Einwilligung untersagt.'
				]
			]
		},
		{
			heading: 'Disclaimer',
			paragraphs: [
				[
					'Die Inhalte unserer Seiten wurden mit grösster Sorgfalt erstellt. Obwohl wir uns um Aktualität, Vollständigkeit und Richtigkeit der Inhalte unserer Seiten bemühen, können wir hierfür keine Garantie übernehmen. Als Diensteanbieter sind wir laut § 7 Absatz 1 TMG für eigene Inhalte auf unseren Seiten nach den allgemeinen Gesetzen verantwortlich. Eine Verpflichtung zur Überwachung übermittelter oder gespeicherter fremder Informationen besteht jedoch nicht siehe §§ 8-10 TMG. Sobald uns Rechtsverstöße bekannt werden, werden wir die entsprechenden Inhalte umgehend entfernen. Eine dahingehende Haftung wird jedoch erst ab dem Zeitpunkt der Kenntnis konkreter Rechtsverletzungen übernommen.'
				],
				[
					'Unsere Seiten enthalten Links auf externe Webseiten Dritter. Auf die Inhalte dieser direkt oder indirekt verlinkten Webseiten haben wir keinen Einfluss. Für die Richtigkeit der Inhalte ist deshalb immer der jeweilige Anbieter oder Betreiber verantwortlich, weshalb wir diesbezüglich keinerlei Gewähr übernehmen können. Die fremden Webseiten haben wir zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Zum Zeitpunkt der Verlinkung waren uns keinerlei Rechtsverletzungen erkennbar. Eine ständige Überprüfung sämtlicher Inhalte der von uns verlinkten Seiten ohne tatsächliche Anhaltspunkte für einen Rechtsverstoß ist nicht zumutbar. Falls uns Rechtsverletzungen bekannt werden, werden wir die entsprechenden Links sofort entfernen.'
				]
			]
		}
	]
};

export const datenschutz: LegalText = {
	title: 'Datenschutzerklärung',
	sections: [
		{
			paragraphs: [
				[
					'Verantwortlich:\nChristine Brugger\nDornierstrasse 139\n88048 Friedrichshafen\nDeutschland\nTel. 0178-1724773'
				],
				[
					'Der Schutz ihrer Daten hat bei uns grosse Priorität. Schreiben Sie uns bitte bei Fragen eine email über das Kontaktformular.'
				],
				[
					'Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.\nIn Verbindung mit Ihrem Zugriff werden in unserem Server für Zwecke der Datensicherheit vorübergehend Daten gespeichert. Der Provider der Website erhebt und speichert automatisch Informationen, die ihr Browser automatisch an uns übermittelt. Dies sind Browsertyp / Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP Adresse. Diese Daten sind nicht bestimmten Personen zuordenbar. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Eine Auswertung, mit Ausnahme für statistische Zwecke in anonymisierter Form, erfolgt nicht.\nWir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung personenbezogener Daten unserer Nutzer erfolgt regelmäßig nur nach Einwilligung des Nutzers. Eine Ausnahme gilt in solchen Fällen, in denen eine vorherige Einholung einer Einwilligung aus tatsächlichen Gründen nicht möglich ist und die Verarbeitung der Daten durch gesetzliche Vorschriften gestattet ist.'
				],
				[
					'Sollten Sie uns kontaktieren, benötigen wir von Ihnen Name, E-Mail-Adresse sowie Angaben zur Lieferung und Rechnungsstellung. So können wir Ihre Bestellung bearbeiten und ausführen. Diese Daten werden für die Dauer der Auftragsabwicklung in elektronischer Form gespeichert. Eine weitergehende Nutzung personenbezogener Daten oder eine Weitergabe an Dritte erfolgt ohne Ihre ausdrückliche Einwilligung nicht. Mit der Bestellung willigen Sie in die genannte Verarbeitung Ihrer personenbezogenen Daten ein, soweit dies für den Zweck des Vertrages erforderlich ist. Sie können diese Einwilligung schriftlich oder per E-Mail uns gegenüber jederzeit mit Wirkung für die Zukunft widerrufen.'
				],
				[
					'Die personenbezogenen Daten der betroffenen Person werden gelöscht oder gesperrt, sobald der Zweck der Speicherung entfällt. Eine Speicherung kann darüber hinaus erfolgen, wenn dies durch den europäischen oder nationalen Gesetzgeber in unionsrechtlichen Verordnungen, Gesetzen oder sonstigen Vorschriften, denen der Verantwortliche unterliegt, vorgesehen wurde. Eine Sperrung oder Löschung der Daten erfolgt auch dann, wenn eine durch die genannten Normen vorgeschriebene Speicherfrist abläuft, es sei denn, dass eine Erforderlichkeit zur weiteren Speicherung der Daten für einen Vertragsabschluss oder eine Vertragserfüllung besteht.'
				],
				[
					'Diese Webseite verwendet so genannte Cookies. Diese Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Cookies sind kleine Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert. Der auf dieser Seite verwendete Sessioncookie wird nach Ende Ihres Besuchs automatisch gelöscht.'
				],
				[
					'Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Inc. („Google“). Google Analytics verwendet sog. „Cookies“, Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglichen. Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Website werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. Aufgrund der Aktivierung der IP-Anonymisierung auf diesen Webseiten, wird Ihre IP-Adresse von Google jedoch innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum zuvor gekürzt. Nur in Ausnahmefällen wird die volle IP-Adresse an einen Server von Google in den USA übertragen und dort gekürzt.\nIm Auftrag des Betreibers dieser Website wird Google diese Informationen benutzen, um Ihre Nutzung der Website auszuwerten, um Reports über die Websiteaktivitäten zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen gegenüber dem Websitebetreiber zu erbringen.'
				],
				[
					'Die Zwecke der Datenverarbeitung liegen in der Auswertung der Nutzung der Website und in der Zusammenstellung von Reports über Aktivitäten auf der Website. Auf Grundlage der Nutzung der Website und des Internets sollen dann weitere verbundene Dienstleistungen erbracht werden. Die Verarbeitung beruht auf dem berechtigten Interesse des Webseitenbetreibers.'
				],
				[
					'Die im Rahmen von Google Analytics von Ihrem Browser übermittelte IP-Adresse wird nicht mit anderen Daten von Google zusammengeführt. Sie können die Speicherung der Cookies durch eine entsprechende Einstellung Ihrer Browser-Software verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website vollumfänglich werden nutzen können. Sie können darüber hinaus die Erfassung der durch das Cookie erzeugten und auf Ihre Nutzung der Website bezogenen Daten (inkl. Ihrer IP-Adresse) an Google sowie die Verarbeitung dieser Daten durch Google verhindern, indem sie das unter dem folgenden Link verfügbare Browser-Plugin herunterladen und installieren ',
					{
						text: 'http://tools.google.com/dlpage/gaoptout?hl=de',
						href: 'http://tools.google.com/dlpage/gaoptout?hl=de'
					}
				]
			]
		}
	]
};
