#set page(paper: "a3", margin: 2cm)
#set text(size: 16pt)

// Hlavička posteru
#align(center)[
  #block(
    fill: rgb("f4f4f5"),
    inset: 24pt,
    width: 100%,
  )[
    #text(
      size: 32pt,
      weight: "bold",
      fill: rgb("18181b"),
    )[Ding]
    #v(1em)
    #text(
      size: 24pt,
      weight: "semibold",
    )[Systém pro skupinovou komunikaci přes SMS]
    #v(1em)
    #text(
      size: 16pt,
    )[*Autor:* Jakub Vejražka, 4.E | *Vedoucí:* Ing. Daniel Kahoun]
    #v(.1em)
    #text(
      size: 16pt,
    )[Gymnázium, Praha 6, Arabská 14]
  ]
]

#v(2.5em)

// Dvousloupcový layout pro obsah
#columns(2, gutter: 3cm)[

  #text(size: 18pt, weight: "bold", fill: rgb("0284c7"))[O projektu]

  Ding je platforma, která přináší výhody skupinových chatů do klasických SMS zpráv. Umožňuje tak komunikaci i v prostředí bez přístupu k internetu, např. na tlačítkových telefonech.

  #v(1.5em)

  #text(size: 18pt, weight: "bold", fill: rgb("0284c7"))[Cílová skupina]

  - *Tlačítkové telefony:* Uživatelé, pro které aktuálně neexistuje podobná alternativa.
  - *Offline dostupnost:* Lidé dlouhodobě mimo dosah internetu.
  - *Rodiny:* Komunikace např. pro rodinnou skupinu s dětmi, které ještě nemají přístup k internetu.

  #v(1.5em)

  #text(size: 18pt, weight: "bold", fill: rgb("0284c7"))[Jak to funguje?]

  - *Webové rozhraní:* Slouží pro správu skupin a financí.
  - *Správa:* Administrátor skupiny zadá e-mail osoby, systém jí pošle unikátní připojovací odkaz.
  - *Zprávy:* Odeslaná SMS se na serveru zpracuje, přidá se k ní přezdívka odesílatele a rozešle se všem členům.

  #colbreak()

  #text(size: 18pt, weight: "bold", fill: rgb("0284c7"))[Použité technologie]

  - *Aplikace:* SvelteKit a TypeScript
  - *Vzhled:* Tailwind CSS
  - *Databáze:* SQLite přes Drizzle ORM
  - *Uživatelé:* Knihovna BetterAuth
  - *Hosting:* Oracle Cloud s virtuálním strojem s Linuxem
  - *SMS brána:* BulkGate (HTTP API pro odesílání a webhook pro příjem zpráv)

  #v(1.5em)

  #text(size: 18pt, weight: "bold", fill: rgb("0284c7"))[Prostor pro zlepšení]

  - *Vyhrazená čísla:* Nyní se používají systémová čísla, přechod na vyhrazené číslo vyřeší problém s omezenou délkou života konverzací.
  - *Sdružené účty:* Možnost zaregistrovat profil pro prarodiče bez e-mailu a hradit jejich zprávy ze společného kreditu.
  - *Více skupin:* Povolit uživatelům členství v několika skupinách zároveň.

]
