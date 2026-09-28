(() => {
  const nav = document.querySelector('.main-nav');

  if (nav) {
    document.querySelectorAll('.nav-button').forEach((button) => {
      const text = button.textContent.trim();
      if (text.startsWith('Vårt folk')) {
        const chevron = button.querySelector('.chevron');
        button.childNodes[0].nodeValue = 'Toastteamet ';
        if (chevron) chevron.textContent = '⌄';
      }
    });

    if (!nav.querySelector('a[href="onskelista.html"]')) {
      const wishlist = document.createElement('a');
      wishlist.href = 'onskelista.html';
      wishlist.className = 'nav-link';
      wishlist.textContent = 'Önskelista';
      if (location.pathname.endsWith('/onskelista.html') || location.pathname.endsWith('onskelista.html')) {
        wishlist.classList.add('active');
      }
      const faq = nav.querySelector('a[href="faq.html"]');
      nav.insertBefore(wishlist, faq || nav.querySelector('.nav-osa'));
    }
  }

  const dropdownItems = document.querySelectorAll('.has-dropdown');

  dropdownItems.forEach((item) => {
    const button = item.querySelector('.nav-button');
    if (!button) return;

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const willOpen = !item.classList.contains('open');

      dropdownItems.forEach((other) => {
        other.classList.remove('open');
        const otherButton = other.querySelector('.nav-button');
        if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
      });

      if (willOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });

    item.querySelectorAll('.dropdown a').forEach((link) => {
      link.addEventListener('click', () => {
        item.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
      });
    });
  });

  document.addEventListener('click', () => {
    dropdownItems.forEach((item) => {
      item.classList.remove('open');
      const button = item.querySelector('.nav-button');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    dropdownItems.forEach((item) => {
      item.classList.remove('open');
      const button = item.querySelector('.nav-button');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  });

  const countdown = document.querySelector('[data-countdown]');
  if (countdown) {
    const target = new Date(countdown.dataset.countdown).getTime();
    const daysEl = countdown.querySelector('[data-days]');
    const hoursEl = countdown.querySelector('[data-hours]');
    const minutesEl = countdown.querySelector('[data-minutes]');
    const secondsEl = countdown.querySelector('[data-seconds]');

    const updateCountdown = () => {
      const diff = Math.max(0, target - Date.now());
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (daysEl) daysEl.textContent = String(days);
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('visible'));
  }
})();

/* BILINGUAL_SITE */
(() => {
  const SV_EN = {
  "Einar & Lovisa | 21 augusti 2027": "Einar & Lovisa | 21 August 2027",
  "Om oss | Einar & Lovisa": "Our story | Einar & Lovisa",
  "Bröllopet | Einar & Lovisa": "Wedding | Einar & Lovisa",
  "Praktiskt | Einar & Lovisa": "Practical information | Einar & Lovisa",
  "Klädkod | Einar & Lovisa": "Dress code | Einar & Lovisa",
  "Toastteamet | Einar & Lovisa": "Toast team | Einar & Lovisa",
  "Tal och spex | Einar & Lovisa": "Speeches and performances | Einar & Lovisa",
  "Önskelista | Einar & Lovisa": "Gift list | Einar & Lovisa",
  "FAQ | Einar & Lovisa": "FAQ | Einar & Lovisa",
  "OSA | Einar & Lovisa": "RSVP | Einar & Lovisa",
  "Hoppa till innehållet": "Skip to content",
  "Hem": "Home",
  "Om oss": "Our story",
  "Bröllopet": "Wedding",
  "Bröllopsdagen": "Wedding day",
  "Vigseln": "Ceremony",
  "Vigsel": "Ceremony",
  "Middag och fest": "Dinner and party",
  "Toastteamet": "Toast team",
  "Tal och spex": "Speeches and performances",
  "Praktiskt": "Practical",
  "Transport": "Transport",
  "Boende": "Accommodation",
  "Parkering": "Parking",
  "Resa hit": "Getting here",
  "Klädkod": "Dress code",
  "Önskelista": "Gift list",
  "OSA": "RSVP",
  "Till startsidan": "Back to home",
  "Einar och Lovisa, startsida": "Einar and Lovisa, home page",
  "Huvudmeny": "Main navigation",
  "Fortsätt nedåt": "Continue down",
  "Nedräkning till bröllopet": "Countdown to the wedding",
  "21 augusti 2027": "21 August 2027",
  "Vi gifter oss": "We're getting married",
  "Planerad vigsel 13.00": "Ceremony planned for 13:00",
  "Läs mer": "Read more",
  "dagar kvar": "days to go",
  "Efter vigseln fortsätter firandet här.": "After the ceremony, the celebration continues here.",
  "Läs om festen": "Read about the party",
  "Välkomna": "Welcome",
  "Här finns information om bröllopsdagen, resan dit, boende, klädkod och OSA.": "Here you can find information about the wedding day, getting here, accommodation, dress code and RSVP.",
  "Vår historia": "Our story",
  "Från orkester och konfirmation till Lundgrensgatan, Kusttorget och ett frieri på Brattåsberget.": "From orchestra and confirmation classes to Lundgrensgatan, Kusttorget and a proposal at Brattåsberget.",
  "Hitta rätt": "Find your way",
  "Information inför dagen": "Information for the day",
  "Vigsel, dagens upplägg och festen på Strömsfors Bruk.": "The ceremony, the schedule and the party at Strömsfors Bruk.",
  "Transport, parkering, boende och resa till området.": "Transport, parking, accommodation and getting to the area.",
  "Praktisk information": "Practical information",
  "Johannes, Savannah och Alfred håller ihop tal och spex.": "Johannes, Savannah and Alfred coordinate the speeches and performances.",
  "Vi hoppas att ni kan komma": "We hope you can join us",
  "Använd den personliga kod som står på inbjudan.": "Use the personal code on your invitation.",
  "Till OSA": "RSVP here",
  "Den börjar tidigare än någon av oss först hade tänkt.": "It starts earlier than either of us first thought.",
  "Vi träffades cirka 2003, då brudgummen och hans storebror spelade i samma orkester som bruden och hennes storasyster. Uppenbarligen gjorde bruden ett starkare intryck på brudgummen, då endast han minns detta.": "We first met around 2003, when the groom and his older brother played in the same orchestra as the bride and her older sister. Apparently, the bride made a stronger impression on the groom, since he is the only one who remembers it.",
  "Det vi officiellt får gå efter är att de träffades igen under konfirmationen 2011 och umgicks under denna tid fram tills brudgummen fick för sig att flytta till USA 2012.": "What we can officially go by is that they met again during confirmation classes in 2011 and spent time together until the groom decided it was a good idea to move to the United States in 2012.",
  "De höll kontakt men förblev vänner fram till hösten 2019. Då hade brudgummen redan anpassat sig till distans, och så förblev det även där, dock endast på nationell nivå. Det tog fram till våren 2023, efter pårop från brudens vän Mathilda Gunnarsson Rathsman, innan bruden skickade ett meddelande till brudgummen. Då visade det sig äntligen att de båda var i samma stad igen.": "They stayed in touch but remained friends until autumn 2019. By then, the groom had already become used to distance, and distance it remained, although at least only within Sweden. It took until spring 2023, after encouragement from the bride's friend Mathilda Gunnarsson Rathsman, for the bride to send the groom a message. It finally turned out that they were both in the same city again.",
  "Det blev en träff på Storan kort därefter. Träffarna blev fler och höll i sig under sommaren innan de blev ett par den 1 september 2023.": "They met at Storan soon afterwards. One meeting became several, and it continued throughout the summer before they became a couple on 1 September 2023.",
  "Brudgummen började hälsa på lite oftare på Lundgrensgatan men bodde fortfarande hos sina föräldrar ute i Kållered. Det blev lite för mycket för den relativt nyexaminerade juristen att behöva förhålla sig till att han, såsom han minns att hon sa, \"bröt mot lagen\". Detta gällde var brudgummens huvudsakliga nattvila var.": "The groom started visiting Lundgrensgatan a little more often, but still lived with his parents in Kållered. For the relatively newly qualified lawyer, it became a bit much to deal with him, as he remembers her putting it, \"breaking the law\". The issue was where the groom's principal place of nightly rest actually was.",
  "Det resulterade i att de flyttade ihop på Lundgrensgatan men insåg snabbt att de behövde söka sig till något större. Det första gemensamma boendet blev på Kusttorget.": "The result was that they moved in together on Lundgrensgatan, but quickly realised they needed something bigger. Their first home together became Kusttorget.",
  "Tidslinje": "Timeline",
  "Några hållpunkter": "A few milestones",
  "Cirka 2003": "Around 2003",
  "Orkestern": "The orchestra",
  "Brudgummen och hans storebror spelar i samma orkester som bruden och hennes storasyster.": "The groom and his older brother play in the same orchestra as the bride and her older sister.",
  "Konfirmationen": "Confirmation classes",
  "De träffas igen och umgås under konfirmationstiden.": "They meet again and spend time together during confirmation classes.",
  "Brudgummen flyttar till USA.": "The groom moves to the United States.",
  "Hösten 2019": "Autumn 2019",
  "Fortfarande på distans": "Still at a distance",
  "Kontakten finns kvar, men avståndet är nu åtminstone bara nationellt.": "They stay in touch, and the distance is now at least only within Sweden.",
  "Våren 2023": "Spring 2023",
  "Samma stad igen": "In the same city again",
  "Ett meddelande efter pårop från Mathilda leder till en träff på Storan.": "A message after some encouragement from Mathilda leads to a meeting at Storan.",
  "1 september 2023": "1 September 2023",
  "Ett par": "A couple",
  "Efter en sommar med allt fler träffar blir det officiellt.": "After a summer of seeing more and more of each other, it becomes official.",
  "2023 och 2024": "2023 and 2024",
  "Lundgrensgatan och Kusttorget": "Lundgrensgatan and Kusttorget",
  "Först samboliv på Lundgrensgatan och därefter det första gemensamma boendet på Kusttorget.": "First living together on Lundgrensgatan, followed by their first shared home at Kusttorget.",
  "6 februari 2026": "6 February 2026",
  "Förlovning": "Engagement",
  "Frieriet sker på Brattåsberget i Kållered efter månader av ledtrådar.": "The proposal takes place at Brattåsberget in Kållered after months of clues.",
  "Bröllop": "Wedding",
  "Vi gifter oss.": "We get married.",
  "Förlovningsresan 2026": "Engagement trip 2026",
  "Taxichauffören hade en kompis som skulle ta våra väskor den sista biten till riaden eftersom bilar inte kan köra i gamla stan. Han gick snabbt framför oss genom gränd efter gränd medan ett mindre följe började bildas bakom oss. När ytterligare en man kallades ut från en dörr och pekade mot ännu en mycket smal gränd började vi fundera på om vi skulle få se resten av resan. Vi kom fram. Väskorna också.": "The taxi driver had a friend who was going to carry our bags the final stretch to the riad because cars cannot drive through the old town. He walked quickly ahead of us through alley after alley while a small entourage started forming behind us. When another man was called out through a doorway and pointed towards yet another very narrow alley, we started wondering whether we would get to see the rest of the trip. We made it. So did the bags.",
  "Här finns dagens upplägg, information om vigseln och festen på Strömsfors Bruk.": "Here you can find the schedule for the day, information about the ceremony and the party at Strömsfors Bruk.",
  "Lördagen den 21 augusti": "Saturday 21 August",
  "Senast 12.30": "Please arrive by 12:30",
  "Samling vid kyrkan": "Gathering at the church",
  "Vi vill gärna att alla är på plats ungefär 30 minuter före vigseln. Kyrkan meddelas när den är bestämd.": "Please be at the church about 30 minutes before the ceremony. We will share the church once it has been decided.",
  "Planerad tid 13.00": "Planned time 13:00",
  "Vi planerar en kortare vigsel på ungefär 20 till 30 minuter.": "We are planning a shorter ceremony of around 20 to 30 minutes.",
  "Efter vigseln": "After the ceremony",
  "Transport till Strömsfors": "Transport to Strömsfors",
  "Gemensamma bussar tar de gäster som har bokat plats från vigseln till Strömsfors Bruk.": "Shared buses will take guests who have booked a seat from the ceremony to Strömsfors Bruk.",
  "Eftermiddag": "Afternoon",
  "Mingel": "Mingling",
  "Efter ankomst till bruket blir det mingel innan middagen börjar.": "After arriving at the venue, there will be time to mingle before dinner.",
  "Kväll": "Evening",
  "Middag och tal följs av bar, musik och dans.": "Dinner and speeches will be followed by the bar, music and dancing.",
  "Efter vigseln fortsätter firandet på Strömsfors Bruk.": "After the ceremony, the celebration continues at Strömsfors Bruk.",
  "Information om bussar, parkering, boende och resan dit finns samlad under Praktiskt.": "Information about buses, parking, accommodation and getting there is gathered under Practical information.",
  "Bra att veta": "Good to know",
  "Transport, boende, parkering och resa till området.": "Transport, accommodation, parking and getting to the area.",
  "Ta er dit och hem": "Getting there and back",
  "Till vigseln": "To the ceremony",
  "Kyrkan är inte bestämd ännu. När den är bokad lägger vi in namn, adress och den information som behövs här.": "The church has not been decided yet. Once it is booked, we will add the name, address and anything else you need to know here.",
  "Vigsel till fest": "Ceremony to reception",
  "Vi ordnar kostnadsfri buss från vigseln till Strömsfors Bruk. I OSA anger varje gäst om en plats på bussen behövs.": "We are arranging a free bus from the ceremony to Strömsfors Bruk. In the RSVP, each guest can indicate whether they need a seat.",
  "Efter festen": "After the party",
  "Vi planerar nattbussar mot Tranemo, Svenljunga och Göteborg. Bussarna går till bestämda hållplatser och inte till enskilda boenden.": "We are planning night buses towards Tranemo, Svenljunga and Gothenburg. The buses will stop at set locations rather than individual accommodation.",
  "I OSA frågar vi hur varje gäst tänker ta sig från festen och var personen planerar att sova. Det hjälper oss att planera bussarna och de slutliga hållplatserna.": "In the RSVP we ask how each guest plans to get home from the party and where they plan to stay. That helps us plan the buses and final stops.",
  "För den som stannar över natten": "For those staying overnight",
  "Vi reserverar inga rum eller hotell. Gäster bokar själva och vi rekommenderar i första hand att titta i och omkring Tranemo, Svenljunga eller nära Strömsfors.": "We are not reserving rooms or hotels. Guests book their own accommodation. We recommend looking in and around Tranemo, Svenljunga or close to Strömsfors.",
  "Nära Strömsfors": "Near Strömsfors",
  "För den som hittar ett boende nära festplatsen. Detta är inte en planerad nattbusshållplats.": "For anyone who finds accommodation close to the venue. This is not a planned night bus stop.",
  "Ett av de områden som är relevanta för den som vill bo i närheten av Strömsfors.": "One of the areas worth considering if you want to stay near Strömsfors.",
  "Boka gärna boende i god tid. Vi lägger in ungefärliga körtider till Strömsfors när vi har dubbelkontrollerat dem.": "Please book accommodation in good time. We will add approximate driving times to Strömsfors once we have checked them.",
  "Bil till Strömsfors": "By car to Strömsfors",
  "Parkering finns": "Parking is available",
  "Det finns parkering vid Strömsfors Bruk.": "There is parking at Strömsfors Bruk.",
  "Avlämning nära entrén": "Drop off near the entrance",
  "Det går att släppa av gäster nära entrén om någon har svårt att gå längre sträckor.": "Guests can be dropped off near the entrance if walking longer distances is difficult.",
  "Över natten": "Overnight",
  "Vi kontrollerar fortfarande om bilar får stå kvar över natten och när de i så fall behöver hämtas på söndagen.": "We are still checking whether cars may remain overnight and, if so, when they need to be collected on Sunday.",
  "För långväga gäster": "For guests travelling from further away",
  "Resvägen beror delvis på vilken kyrka det blir. Vi fyller på denna del när vigselplatsen är bestämd.": "The best route depends partly on which church we choose. We will update this section once the ceremony location has been decided.",
  "Från Göteborg": "From Gothenburg",
  "Bil är i nuläget det enklaste alternativet till området.": "For now, driving is the simplest option to the area.",
  "Med tåg eller flyg": "By train or plane",
  "Vi kompletterar med den enklaste vidare resan när kyrkan är bokad.": "We will add the easiest onward journey once the church is booked.",
  "Taxi": "Taxi",
  "Taxi kan vara ett komplement till bussarna. Vi lägger in mer information när transportupplägget är färdigt.": "Taxi can be used alongside the buses. We will add more information once the transport plan is final.",
  "Övrig information": "Other information",
  "Vuxenbröllop": "Adults only wedding",
  "Bröllopet är planerat som ett vuxenbröllop. Inbjudan gäller de personer vars namn står på inbjudan.": "The wedding is planned as an adults only celebration. The invitation applies to the people whose names appear on it.",
  "Mat": "Food",
  "I OSA väljer varje person kostpreferens och anger allergier separat.": "In the RSVP, each person chooses their food preference and lists allergies separately.",
  "Bilder": "Photos",
  "Gäster får gärna ta och dela bilder. Vi planerar också ett gemensamt fotoalbum.": "Guests are welcome to take and share photos. We are also planning a shared photo album.",
  "På bröllopsdagen": "On the wedding day",
  "Praktiska frågor under dagen går i första hand till toastteamet.": "Practical questions during the day should primarily go to the toast team.",
  "Klädsel": "Attire",
  "Vi har inte bestämt den slutliga klädkoden ännu. När vi har gjort det kommer den att stå tydligt här och på inbjudan.": "We have not decided the final dress code yet. Once we do, it will be clearly stated here and on the invitation.",
  "Just nu": "At the moment",
  "Inte spikat ännu": "Not decided yet",
  "Beslut kommer senare": "Decision to come",
  "Vi vill att det ska kännas högtidligt, snyggt och somrigt utan att gästerna behöver gissa vad vi menar.": "We want it to feel formal, elegant and summery without making guests guess what we mean.",
  "Vi väger fortfarande mellan mer klassisk formell klädsel och ett något friare upplägg. När vi bestämt oss skriver vi exakt vad som gäller och ger några konkreta exempel.": "We are still deciding between a more classic formal dress code and something a little more relaxed. Once we have decided, we will say exactly what applies and give a few concrete examples.",
  "Middagen och kvällen": "Dinner and evening",
  "De håller ihop tal, spex och middagens program.": "They coordinate the speeches, performances and dinner programme.",
  "Brudens toastmaster": "Bride's toastmaster",
  "En av två toastmasters och brudens representant i teamet.": "One of two toastmasters and the bride's representative in the team.",
  "Bild kommer": "Photo coming",
  "Preliminär gemensam toastmadame": "Preliminary joint toastmadame",
  "Tanken är att Savannah blir teamets gemensamma toastmadame.": "Our plan is for Savannah to be the team's joint toastmadame.",
  "Brudgummens toastmaster": "Groom's toastmaster",
  "En av två toastmasters och brudgummens representant i teamet.": "One of two toastmasters and the groom's representative in the team.",
  "Anmäl tal eller spex": "Submit a speech or performance",
  "Till toastteamet": "For the toast team",
  "Tal, spex och överraskningar": "Speeches, performances and surprises",
  "Vill du hålla tal, göra ett spex, spela musik eller planera en överraskning? Anmäl det här.": "Would you like to give a speech, put on a performance, play music or plan a surprise? Let the toast team know here.",
  "Brudens toastmaster är Johannes Wiedel. Savannah Gillblad är preliminär gemensam toastmadame och brudgummens toastmaster är Alfred Pålsson Höök.": "The bride's toastmaster is Johannes Wiedel. Savannah Gillblad is the preliminary joint toastmadame and the groom's toastmaster is Alfred Pålsson Höök.",
  "Sista dag är 31 maj 2027.": "The deadline is 31 May 2027.",
  "Om något ska vara hemligt för oss kan du markera det i formuläret.": "If something should be kept secret from us, you can mark it in the form.",
  "Namn": "Name",
  "Mejladress": "Email address",
  "Vad vill du göra?": "What would you like to do?",
  "Välj": "Select",
  "Tal": "Speech",
  "Spex": "Performance",
  "Sång eller musik": "Song or music",
  "Film": "Video",
  "Överraskning": "Surprise",
  "Annat": "Other",
  "Ungefärlig längd": "Approximate length",
  "Beskriv kort vad du planerar": "Briefly describe what you are planning",
  "Vilka deltar?": "Who is involved?",
  "Behöver du något tekniskt?": "Do you need any technical equipment?",
  "Mikrofon": "Microphone",
  "Ljuduppspelning": "Audio playback",
  "Projektor eller skärm": "Projector or screen",
  "Övriga tekniska behov": "Other technical needs",
  "Ska detta hållas hemligt för brudparet?": "Should this be kept secret from the bride and groom?",
  "Ja": "Yes",
  "Nej": "No",
  "Övrig information till toastteamet": "Other information for the toast team",
  "Skicka till toastteamet": "Send to the toast team",
  "Förnamn och efternamn": "First and last name",
  "namn@exempel.se": "name@example.com",
  "Exempel: 4 minuter": "For example: 4 minutes",
  "Namn eller grupp": "Name or group",
  "Formulär för tal och spex": "Form for speeches and performances",
  "Formuläret är förberett men den tekniska kopplingen är ännu inte aktiverad.": "The form is ready, but the technical connection is not active yet.",
  "Anmälan kunde inte sparas.": "The submission could not be saved.",
  "Tack.": "Thank you.",
  "Anmälan är sparad och toastteamet har fått den.": "Your submission has been saved and the toast team has received it.",
  "Anmälan är sparad. Mejlaviseringen till toastteamet aktiveras när alla kontaktuppgifter är klara.": "Your submission has been saved. Email notifications to the toast team will be activated once all contact details are ready.",
  "Något gick fel när anmälan skulle skickas.": "Something went wrong while sending the submission.",
  "Presenter": "Gifts",
  "Vi har inte bestämt exakt hur vi gör ännu.": "We have not decided exactly what we are doing yet.",
  "Mer information kommer": "More information to come",
  "Vi återkommer här": "We'll update this page",
  "När vi har bestämt vad vi önskar oss lägger vi in informationen på den här sidan.": "Once we have decided what we would like, we will add the details here.",
  "Frågor och svar": "Questions and answers",
  "Här samlar vi sådant som inte redan har en egen plats på hemsidan.": "Here we collect things that do not already have their own place on the website.",
  "När är sista dag för OSA?": "When is the RSVP deadline?",
  "Sista svarsdag är 31 mars 2027.": "The deadline is 31 March 2027.",
  "Hur fungerar OSA?": "How does RSVP work?",
  "Varje inbjudan får en personlig kod. När koden skrivs in visas de namngivna personer som hör till just den inbjudan och varje person svarar individuellt.": "Each invitation has a personal code. When you enter the code, the named people included on that invitation are shown and each person responds individually.",
  "Kan jag ändra mitt svar senare?": "Can I change my response later?",
  "Ja. Samma personliga kod kan användas igen fram till 31 mars 2027. Efter det kontaktar ni oss om något har förändrats.": "Yes. You can use the same personal code again until 31 March 2027. After that, please contact us if anything changes.",
  "Kan jag ta med någon som inte står på inbjudan?": "Can I bring someone who is not named on the invitation?",
  "Nej. Inbjudan gäller de personer vars namn står på inbjudan.": "No. The invitation applies to the people whose names appear on it.",
  "Är barn välkomna?": "Are children welcome?",
  "Bröllopet är planerat som ett vuxenbröllop. Om ett barn är inbjudet står barnets namn på inbjudan.": "The wedding is planned as an adults only celebration. If a child is invited, the child's name will appear on the invitation.",
  "Får vi ta bilder och lägga ut dem?": "Can we take photos and post them?",
  "Ja. Vi har inga särskilda regler för sociala medier i nuläget. Vi planerar också ett gemensamt fotoalbum för gästerna.": "Yes. We do not currently have any special rules for social media. We are also planning a shared photo album for guests.",
  "Måste man kunna dansa?": "Do I need to know how to dance?",
  "Nej. Rimligt självförtroende räcker långt.": "No. A reasonable amount of confidence goes a long way.",
  "Öppet": "Open",
  "Skriv in koden som står på er inbjudan. Då visas alla personer som hör till just den inbjudan.": "Enter the code on your invitation. Everyone included on that invitation will then appear.",
  "Personlig inbjudningskod": "Personal invitation code",
  "Fortsätt": "Continue",
  "Kontakt": "Contact",
  "Mejladress för inbjudan": "Email address for the invitation",
  "Spara svar": "Save responses",
  "Byt kod": "Change code",
  "Om era uppgifter:": "About your information:",
  "Uppgifterna används för planering och genomförande av bröllopet. Relevant information kan vid behov delas med till exempel kök och transportleverantörer.": "The information is used to plan and run the wedding. Relevant information may, where needed, be shared with suppliers such as the catering team and transport providers.",
  "Ange kod": "Enter code",
  "Kommer du på bröllopet?": "Are you coming to the wedding?",
  "Kostpreferens": "Dietary preference",
  "Äter allt": "No dietary preference",
  "Vegetariskt": "Vegetarian",
  "Veganskt": "Vegan",
  "Pescetariskt": "Pescatarian",
  "Buss från vigseln till Strömsfors?": "Bus from the ceremony to Strömsfors?",
  "Allergier eller intoleranser": "Allergies or intolerances",
  "Gluten eller celiaki": "Gluten or coeliac disease",
  "Laktos": "Lactose",
  "Mjölkprotein": "Milk protein",
  "Nötter": "Tree nuts",
  "Jordnötter": "Peanuts",
  "Ägg": "Eggs",
  "Fisk": "Fish",
  "Skaldjur": "Shellfish",
  "Annan allergi eller intolerans": "Other allergy or intolerance",
  "Lämna tomt om inget annat finns": "Leave blank if there is nothing else",
  "Hur tänker du ta dig från festen?": "How do you plan to get home from the party?",
  "Nattbuss": "Night bus",
  "Egen bil": "Own car",
  "Skjuts": "Lift",
  "Annat eller vet inte ännu": "Other or not sure yet",
  "Var planerar du att bo eller sova?": "Where do you plan to stay?",
  "Göteborg": "Gothenburg",
  "Annan ort": "Other town",
  "Vet inte ännu": "Not sure yet",
  "Skriv ort": "Enter town",
  "Deltar du på fredagen?": "Are you joining us on Friday?",
  "Deltar du på söndagen?": "Are you joining us on Sunday?",
  "Låtönskemål, om du har något": "Song request, if you have one",
  "Artist och låt": "Artist and song",
  "Vem tror du gråter först?": "Who do you think will cry first?",
  "Välj om du vill": "Choose if you like",
  "Båda samtidigt": "Both at the same time",
  "Någon i toastteamet": "Someone in the toast team",
  "Vet inte": "No idea",
  "Något annat vi bör känna till?": "Anything else we should know?",
  "Er inbjudan": "Your invitation",
  "Tack, svaret är sparat.": "Thank you, your response has been saved.",
  "Svaret kunde inte sparas.": "The response could not be saved.",
  "Koden kunde inte hittas.": "The code could not be found.",
  "Inbjudan saknar registrerade gäster.": "No registered guests were found for this invitation.",
  "Inga gästsvar skickades in.": "No guest responses were submitted.",
  "Ett gästsvar hör inte till denna inbjudan.": "One of the guest responses does not belong to this invitation.",
  "Samma gäst skickades in flera gånger.": "The same guest was submitted more than once.",
  "Ogiltigt kodformat.": "Invalid code format.",
  "Ogiltig mejladress.": "Invalid email address.",
  "Ett svar innehöll ett ogiltigt val.": "One response contained an invalid selection.",
  "Något gick fel.": "Something went wrong."
};
  const EN_SV = Object.fromEntries(Object.entries(SV_EN).map(([sv, en]) => [en, sv]));
  const STORAGE_KEY = 'einar-lovisa-language';

  function dynamicText(core, language) {
    if (language === 'en') {
      let match = core.match(/^(\d+) personer finns på koden\.$/);
      if (match) return `${match[1]} people are included on this invitation.`;
      match = core.match(/^1 person finns på koden\.$/);
      if (match) return '1 person is included on this invitation.';
    } else {
      let match = core.match(/^(\d+) people are included on this invitation\.$/);
      if (match) return `${match[1]} personer finns på koden.`;
      if (core === '1 person is included on this invitation.') return '1 person finns på koden.';
    }
    return null;
  }

  function translatedCore(core, language) {
    if (!core) return core;
    const direct = language === 'en' ? SV_EN[core] : EN_SV[core];
    return direct || dynamicText(core, language) || core;
  }

  function translateString(value, language) {
    if (typeof value !== 'string') return value;
    const leading = value.match(/^\s*/)?.[0] || '';
    const trailing = value.match(/\s*$/)?.[0] || '';
    const core = value.trim();
    const translated = translatedCore(core, language);
    return leading + translated + trailing;
  }

  function shouldSkipTextNode(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    return ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName);
  }

  function translateTree(root, language) {
    if (!root) return;

    if (root.nodeType === Node.TEXT_NODE) {
      if (!shouldSkipTextNode(root)) {
        const next = translateString(root.nodeValue, language);
        if (next !== root.nodeValue) root.nodeValue = next;
      }
      return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      if (!shouldSkipTextNode(walker.currentNode)) nodes.push(walker.currentNode);
    }
    nodes.forEach(node => {
      const next = translateString(node.nodeValue, language);
      if (next !== node.nodeValue) node.nodeValue = next;
    });

    const elements = [];
    if (root.nodeType === Node.ELEMENT_NODE) elements.push(root);
    if (root.querySelectorAll) elements.push(...root.querySelectorAll('[placeholder],[aria-label],[title],[alt]'));
    elements.forEach(el => {
      ['placeholder', 'aria-label', 'title', 'alt'].forEach(attr => {
        if (!el.hasAttribute?.(attr)) return;
        const current = el.getAttribute(attr);
        const next = translateString(current, language);
        if (next !== current) el.setAttribute(attr, next);
      });
    });
  }

  function languageFromUrl() {
    const value = new URLSearchParams(window.location.search).get('lang');
    return value === 'en' || value === 'sv' ? value : null;
  }

  function savedLanguage() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === 'en' || value === 'sv' ? value : null;
    } catch (_) {
      return null;
    }
  }

  function saveLanguage(language) {
    try { localStorage.setItem(STORAGE_KEY, language); } catch (_) {}
  }

  function updateUrl(language) {
    const url = new URL(window.location.href);
    if (language === 'en') url.searchParams.set('lang', 'en');
    else url.searchParams.delete('lang');
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  }

  function injectSwitch() {
    const nav = document.querySelector('.main-nav');
    if (!nav || nav.querySelector('.language-switch')) return;

    const wrap = document.createElement('div');
    wrap.className = 'language-switch';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Language');
    wrap.innerHTML = `
      <button type="button" data-language="sv" aria-label="Svenska">SV</button>
      <span aria-hidden="true">/</span>
      <button type="button" data-language="en" aria-label="English">EN</button>
    `;

    const osa = nav.querySelector('.nav-osa');
    if (osa) nav.insertBefore(wrap, osa);
    else nav.appendChild(wrap);

    wrap.querySelectorAll('[data-language]').forEach(button => {
      button.addEventListener('click', () => setLanguage(button.dataset.language));
    });
  }

  function updateSwitch(language) {
    document.querySelectorAll('.language-switch [data-language]').forEach(button => {
      const active = button.dataset.language === language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  let currentLanguage = 'sv';
  let observer;

  function setLanguage(language, options = {}) {
    language = language === 'en' ? 'en' : 'sv';
    currentLanguage = language;
    document.documentElement.lang = language;
    document.body?.setAttribute('data-language', language);

    if (document.title) document.title = translatedCore(document.title, language);
    translateTree(document.body, language);
    updateSwitch(language);

    if (!options.skipSave) saveLanguage(language);
    if (!options.skipUrl) updateUrl(language);
  }

  injectSwitch();
  const initialLanguage = languageFromUrl() || savedLanguage() || 'sv';
  setLanguage(initialLanguage, { skipUrl: !languageFromUrl() });

  observer = new MutationObserver(mutations => {
    if (currentLanguage !== 'en') return;
    mutations.forEach(mutation => {
      if (mutation.type === 'characterData') {
        translateTree(mutation.target, currentLanguage);
      } else {
        mutation.addedNodes.forEach(node => translateTree(node, currentLanguage));
      }
    });
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
})();
