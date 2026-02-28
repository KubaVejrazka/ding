#table(
  stroke: none,
  columns: (2fr, 3fr),
  image("images/gyarab.png", width: 40%),
  align(right)[#heading(outlined: false)[Gymnázium, Praha 6, Arabská 14]
    tel.: 235 351 708 \
    fax.: 222 262 066 \
    e-mail: ga\@gyarab.cz\
    www.gyarab.cz],
)

#line(stroke: 0.15em + rgb("#808080"), length: 100%)

#heading(outlined: false)[Zadání ročníkového projektu]
#v(0.25cm)
#grid(
  columns: (1fr, 3fr),
  row-gutter: 0.5cm,
  heading(level: 2, outlined: false)[Název:],
  heading(
    level: 2,
    outlined: false,
  )[Ding - Systém pro skupinové chaty v SMS],

  heading(level: 2, outlined: false)[Řešitel:],
  heading(level: 2, outlined: false)[Vejražka Jakub, 4.E],

  heading(level: 2, outlined: false)[Vedoucí práce:],
  heading(level: 2, outlined: false)[Ing. Daniel Kahoun],

  heading(level: 2, outlined: false)[Datum odevzdání:],
  heading(level: 2, outlined: false)[28. 2. 2026],
)

#heading(level: 2, outlined: false)[Způsob zpracování a kritéria hodnocení:]
Zpracování v požadovaném rozsahu se řídí obecně závaznými pokyny zpracování ročníkových projektů. Řešitel elektronicky odevzdáve stanoveném termínu dokumentaci, prezentaci, poster a další vyžádané přílohy (např. zdrojové kódy, ukázková data). Před obhajobou řešitel odevzdá jeden výtisk stejné dokumentace s podepsaným prohlášením o autorství a jeden poster, neurčí-li vedoucí jinak. Hodnotí se odborné zpracování úlohy, použití návrhových vzorů, prezentace při obhajobě a funkcionalita produktu.

#heading(level: 2, outlined: false)[Popis (povinná část):]
Vytvořte konzolovou aplikaci pro procedurální syntézu zvuků motorů určenou pro film a animaci. Program generuje zvukové vzorky na základě uživatelské konfigurace a klíčových snímků definovaných ve vlastním datovém formátu _DST_.

#heading(level: 2, outlined: false)[Upřesnění zadání:]
- Implementace parseru konfiguračních souborů _adess_
- Procedurální generování pole vzorků zvuku motoru
- Práce s klíčovými snímky pro změnu zvuku v čase
- Export _audia_ do standardního formátu _WAV_
- Ovládání aplikace pomocí příkazové řádky (_CLI_)

#heading(level: 2, outlined: false)[Bonus (nepovinná část):]
- Podpora pro různé typy motorů (vrtulové, spalovací)
- Přidání zvukových efektů (např. ozvěna, zkreslení)
- Grafické znázornění generované zvukové vlny v _CLI_
- Možnost reálného náhledu (přehřání) před uložením

#heading(level: 2, outlined: false)[Platforma:]
- C

#v(1fr)

#table(
  columns: (1fr, 1fr, 1fr),
  align: center,
  stroke: none,
  row-gutter: -0.4em,

  [],
  [#line(stroke: (dash: "dashed", paint: rgb("#808080")), length: 92%)],
  [#line(stroke: (dash: "dashed", paint: rgb("#808080")), length: 92%)],

  [], [datum podpisu], [podpis řešitele],
)

#pagebreak()
#outline(
  title: "Obsah",
)
#pagebreak()
#set heading(numbering: "1.")
#show ref: it => if it.element.func() != heading { it } else {
  let l = it.target
  let h = it.element
  link(l, [(viz #h.body, str. #h.location().page())])
}
#show figure: set block(spacing: 4em)
#set page(numbering: "1")
#counter(page).update(1)

= Úvod <intro>
Ding je platforma, která zprostředkovává skupinové konverzace v SMS zprávách. To umožňuje využívání výhod skupinových chatů i v prostředích bez internetu, např. na tlačítkových telefonech. Systém stojí na webovém rozhraní, přes které lze spravovat skupiny a finance.

Primární cílovou skupinou projektu jsou uživatelé tl ačítkových telefonů, pro které v současné době neexistuje žádná podobná alternativa. Zároveň ale může být dobrou volbou pro lidi, kteří se dlouhodobě nachází mimo dosah internetu.

Službu si lze vyzkoušet zde: #link("https://ding.kubavejrazka.dev")

#pagebreak()

= Použité technologie <stack>

Celý projekt stojí na frameworku _SvelteKit_. Je v něm napsaný front-end i back-end webové aplikace. Veškerá back-endová logika je řešená v TypeScriptu.

Dále je pro provoz naprosto klíčová SMS brána. V aktuální verzi používám _BulkGate_, ale mám v plánu migrovat jinam @intro. Během vývoje jsem také použil platformu _SmsManager_.

Web hostuji na virtuálním stroji u _Oracle Cloud_, během vývoje jsem původně využíval VM u _Google Cloud_, ale přesunul jsem se, jelikož Oracle nabízí lepší výkon za nižší cenu. Přes _Google Cloud_ nyní řeším pouze automatizované odesílání emailů.

Výrazně mi usnadnily práci také následující _Node.js_ knihovny:
- _Tailwind CSS_ - framework pro jednodušší práci s CSS pomocí předdefinovaných tříd
- _BetterAuth_ - knihovna pro autentizaci a autorizaci uživatelů
- _Drizzle_ - ORM pro komunikaci s databází (_SQLite_)

= UI a UX
== Z pohledu uživatele
Uživatel je při navštívení webu přivítán úvodní stránkou, kde nalezne stručný popis služby a panel pro registraci nebo přihlášení.

#figure(
  image("images/homepage.png"),
  supplement: [Obrázek],
  caption: [Domovská stránka na PC],
)

Po registraci je požadováno ověření emailové adresy. Uživateli přijde email s odkazem. Dokud neověří svoji emailovou adresu, aplikace ho nepustí dál.

#figure(
  grid(
    columns: (2fr, 1fr),
    gutter: 1em,
    [#image("images/verify-request.png")], [#image("images/verify-email.png")],
  ),
  supplement: [Obrázek],
  caption: [Ověřovací email],
)

Ve chvíli, kdy uživatel úspěšně ověří svou emailovou adresu, je přesměrován na hlavní administrační stránku. Ještě než mu je dovoleno spravovat skupiny (vytvářet je nebo se do nich přidávat), musí si ověřit svoje telefonní číslo.

Než si nechá zaslat přivítací zprávu, má ještě možnost si zkontrolovat, že své telefonní číslo zadal správně, popř. ho opravit. Tuto zprávu si může nechat bezplatně zaslat pouze jednou (z důvodu nákladů na její odeslání).

Po potvrzení odeslání přivítací zprávy je uživatel vyzván, aby na ni odpověděl. Zároveň je mu doporučeno si uložit kontakt, ze kterého zprávu obdržel, jelikož skrz tento kontakt bude později komunikovat se svou skupinou.

#figure(
  image("images/awaiting-response.png"),
  supplement: [Obrázek],
  caption: [Výzva k odpovědi],
)

Ve chvíli kdy dorazí do systému odpověď od uživatele, je mu zpřístupněna hlavní funkcionalita aplikace. Má možnost buď vytvořit novou skupinu, nebo se přes pozvánku připojit do existující skupiny.

Pozvánky fungují tak, že administrátor skupiny (její zakladatel) zadá email osoby, kterou chce do své skupiny pozvat, a systém automaticky vygeneruje připojovací odkaz a pošle jí ho. Tento odkaz bude fungovat pouze pro účet s daným emailem a je požadováno, aby uživatel měl dokončenou registraci a nebyl v žádné jiné skupině. V případě, že není splněna nějaká z podmínek pro připojení, uživateli je po kliknutí na odkaz vyobrazena stránka popisující potřebné kroky k připojení.

Ve chvíli, kdy je více uživatelů v jedné skupině, služba už je plně funkční. Pokud někdo z nich na systémové číslo pošle zprávu, přijde všem ostatním členům skupiny s připsanou přezdívkou odesílatele.

#figure(
  image("images/admin-dashboard.png"),
  supplement: [Obrázek],
  caption: [Hlavní stránka z pohledu administrátora skupiny],
)
