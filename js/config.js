/* =====================================================================
   EDIT THIS FILE TO MAKE THE SITE YOURS.
   Every piece of text, every link and every project lives here.
   Nothing else needs touching to change content.

   Anything marked TODO is a placeholder waiting for your real info.
   Empty strings ('') are skipped, so an empty link or image simply
   doesn't show.
   ===================================================================== */
window.SITE = {

  /* ---------- you ---------- */
  first: 'Daviccino',            // first line of the giant name
  last: '',                      // second line (leave '' for a one-line name)
  initials: 'D',                 // shown in the round logo
  city: 'India',                 // shown top left next to the live clock
  tz: 'Asia/Kolkata',            // any IANA time zone, drives the live clock
  email: 'davlovescode@gmail.com',
  siteTitle: 'Daviccino',        // browser tab title. '' = "<first> <last> Portfolio"

  /* words that scramble in the hero, one after another */
  roles: ['Roblox scripter', 'Bot builder', 'Game maker', 'Web developer'],
  lede: 'I am Daviccino. I build bots, games and scripts. Scroll to see everything I have made so far, and what is coming next.',

  /* words in the two crossing bands under the hero */
  marquee: ['Roblox scripts', 'Discord bots', 'Call bots', 'Game dev', 'Web dev', 'Automation'],

  /* the big scroll-lit statement. {total} {shipped} {bots} {games} are filled in from your project list */
  manifesto: 'I build things that talk back. Bots that answer calls, run my devices and live in Discord. Games with strange ideas. Websites that move. {shipped} projects built, one more on the way, and one rule for all of them: make it feel alive.',

  /* ---------- sound ----------
     The built-in disco loop plays if no track is found.
     To use your own music, drop a file at assets/audio/track.mp3 (or change the path).
     The toys then dance to your track: beats are detected from the audio itself.
     Optional sound effects: put a file path in any slot, or leave '' to use the built-in blips. */
  bpm: 118,                      // only used for the built-in loop and the silent idle beat
  audio: {
    track: 'assets/audio/track.mp3',
    volume: 0.7,                 // 0 to 1
    sfx: { hover: '', click: '', whoosh: '', copy: '' }
  },

  /* ---------- projects ----------
     Order here = order on the page.
     type:   script | web | bot | game | soon   (drives the counters and the "What I build" cards)
     theme:  a key from js/themes.js. The page and the 3D toys switch to it while the chapter is on screen.
     image:  picture shown in the chapter frame. Until the file exists, the built-in artwork shows instead.
     video:  optional looping clip (mp4/webm) that plays on top of the image.
     gallery: optional extra images that crossfade in the frame.
     links:  buttons under the description. Leave [] for none. */
  projects: [
    {
      id: 'roblox-scripts', title: 'Roblox Scripts', type: 'script', kind: 'Roblox scripts',
      year: '', status: '',
      short: 'The scripts I have written for Roblox.',
      desc: 'My Roblox scripts, all in one place. Chapter one of everything else on this page.',
      tags: ['Roblox', 'Luau', 'Scripting'],
      links: [],
      image: 'assets/images/roblox-scripts.jpg', video: '', gallery: [],
      theme: 'brick'
    },
    {
      id: 'first-portfolio', title: 'My First Portfolio', type: 'web', kind: 'Website',
      year: '', status: '',
      short: 'My very first portfolio website.',
      desc: 'The first portfolio website I ever made. A snapshot of where I started.',
      tags: ['Website', 'Portfolio'],
      links: [],                 // TODO  still missing: add [{label:'Visit the site', href:'https://...'}] with the link to the first portfolio
      image: 'assets/images/first-portfolio.jpg', video: '', gallery: [],
      theme: 'sky'
    },
    {
      id: 'ultron', title: 'Ultron', type: 'bot', kind: 'Discord bot',
      year: '', status: '',
      short: 'A Discord bot with a mind of its own.',
      desc: 'Ultron is my Discord bot. Same name as the Marvel AI, and hopefully better behaved.',
      tags: ['Discord', 'Bot'],
      links: [],
      image: 'assets/images/ultron.jpg', video: '', gallery: [],
      theme: 'violet'
    },
    {
      id: 'friday', title: 'Friday', type: 'bot', kind: 'Device control bot',
      year: '', status: '',
      short: 'A bot that controls my devices.',
      desc: 'Friday is the bot I built to control my devices. Tell it what to do and it does it.',
      tags: ['Bot', 'Automation', 'Devices'],
      links: [],
      image: 'assets/images/friday.jpg', video: '', gallery: [],
      theme: 'mint'
    },
    {
      id: 'jarvis', title: 'J.A.R.V.I.S', type: 'bot', kind: 'Call handling bot',
      year: '', status: '',
      short: 'A bot that handles my calls.',
      desc: 'J.A.R.V.I.S is my call handling bot. It deals with the calls so I do not have to.',
      tags: ['Bot', 'Voice', 'Calls'],
      links: [],
      image: 'assets/images/jarvis.jpg', video: '', gallery: [],
      theme: 'signal'
    },
    {
      id: 'indian-brainrot', title: 'Indian Brainrot', type: 'game', kind: 'Game',
      year: '', status: 'Live · v2.0',
      short: 'Bhaag Brainrot: outrun the floating faces.',
      desc: 'Bhaag Brainrot is my Indian brainrot game, a Daviccino production that runs right in the browser. Vibe in the lobby, then outrun the floating faces and do not get touched. Make a room and play with friends, and share your death card when they catch you.',
      tags: ['Game', 'Multiplayer', 'Browser'],
      links: [{ label: 'Play it', href: 'https://indianbrainrot.vercel.app' }],
      image: 'assets/images/indian-brainrot.jpg', video: '', gallery: [],
      theme: 'chaos'
    },
    {
      id: 'hollowpoint', title: 'Hollowpoint', type: 'game', kind: 'Game',
      year: '', status: 'Live',
      short: 'Hollow Point: gunshot localization system.',
      desc: 'Hollow Point is my gunshot localization system. Set the wind speed and direction, pick a bunker, a wall or a vehicle, and it predicts where the shot came from, then shows the error against the real location.',
      tags: ['Game', 'Simulation', 'Browser'],
      links: [{ label: 'Open it', href: 'https://hollowpoint.vercel.app' }],
      image: 'assets/images/hollowpoint.jpg', video: '', gallery: [],
      theme: 'ember'
    },
    {
      id: 'this-website', title: 'This Website', type: 'web', kind: 'Website',
      year: '', status: 'You are here',
      host: 'here',                // text shown in the little browser bar ('here' = this site's own address)
      short: 'The site you are on right now.',
      desc: 'The site you are on right now. 3D toys that dance to a beat, and far too many scroll effects.',
      tags: ['Website', 'WebGL', 'Motion'],
      links: [],
      image: 'assets/images/this-website.jpg', video: '', gallery: [],
      theme: 'cobalt'
    },
    {
      id: 'coming-soon', title: 'Coming Soon', type: 'soon', kind: 'Coming soon',
      year: '', status: 'In the works',
      short: 'Something new. Not telling yet.',
      desc: 'Something new is loading. I am not telling yet.',
      tags: ['Secret'],
      links: [],
      releaseAt: '',             // optional, e.g. '2027-01-15T18:00:00+05:30' shows a live countdown
      image: '', video: '', gallery: [],
      theme: 'void'
    }
  ],

  /* ---------- about ---------- */
  about: 'I am Daviccino. I make things that feel alive: Roblox scripts, Discord bots, assistants that run my devices and answer my calls, and browser games with strange ideas. Always one more project on the way.',
  toolbox: ['Roblox Studio', 'Luau', 'Discord bots', 'Voice and call bots', 'Browser games', 'Vercel'],   // TODO  adjust to what you really use
  now: [                         // small "right now" list
    ['Shipping', 'Bhaag Brainrot v2.0'],
    ['Building', 'Something new, see chapter 09'],
    ['Based in', 'India']
  ],
  socials: [                     // empty links are skipped
    ['Instagram', 'https://www.instagram.com/daviccinoo/'],
    ['Discord', ''],             // TODO  add a Discord invite or profile link
    ['YouTube', '']
  ]
};
