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
  first: 'Your',                 // TODO  first line of the giant name
  last: 'Name',                  // TODO  second line (leave '' for a one-line name)
  initials: 'YN',                // TODO  shown in the round logo
  city: 'Your City',             // TODO
  tz: 'Asia/Kolkata',            // any IANA time zone, drives the live clock
  email: 'hello@yourdomain.com', // TODO
  siteTitle: '',                 // browser tab title. '' = "<first> <last> Portfolio"

  /* words that scramble in the hero, one after another */
  roles: ['Roblox scripter', 'Bot builder', 'Game maker', 'Web developer'],
  lede: 'I build bots, games and scripts. Scroll to see everything I have made so far, and what is coming next.',

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
      year: '', status: '',      // TODO  year, e.g. '2023'. status, e.g. 'Live'
      short: 'Luau systems and tools for Roblox.',
      desc: 'A collection of the Luau scripts I have written for Roblox: game systems, tools and mechanics.',
      tags: ['Roblox', 'Luau', 'Scripting'],
      links: [],                 // TODO  e.g. [{label:'See the scripts', href:'https://github.com/...'}]
      image: 'assets/images/roblox-scripts.jpg', video: '', gallery: [],
      theme: 'brick'
    },
    {
      id: 'first-portfolio', title: 'My First Portfolio', type: 'web', kind: 'Website',
      year: '', status: '',
      short: 'My very first portfolio website.',
      desc: 'The very first portfolio website I ever made. Rough in places, and exactly where I started. It is still online, so go and have a look.',
      tags: ['Website', 'Portfolio'],
      links: [],                 // TODO (IMPORTANT)  paste the link to your first portfolio: [{label:'Visit the site', href:'https://...'}]
      image: 'assets/images/first-portfolio.jpg', video: '', gallery: [],
      theme: 'sky'
    },
    {
      id: 'ultron', title: 'Ultron', type: 'bot', kind: 'Discord bot',
      year: '', status: '',
      short: 'A Discord bot with a mind of its own.',
      desc: 'Ultron is my Discord bot. It lives in servers, answers commands and keeps things running.',
      tags: ['Discord', 'Bot'],
      links: [],
      image: 'assets/images/ultron.jpg', video: '', gallery: [],
      theme: 'violet'
    },
    {
      id: 'friday', title: 'Friday', type: 'bot', kind: 'Device control bot',
      year: '', status: '',
      short: 'A bot that controls my devices.',
      desc: 'Friday is a bot that controls my devices. Tell it what to do and it gets it done.',
      tags: ['Bot', 'Automation', 'Devices'],
      links: [],
      image: 'assets/images/friday.jpg', video: '', gallery: [],
      theme: 'mint'
    },
    {
      id: 'jarvis', title: 'J.A.R.V.I.S', type: 'bot', kind: 'Call handling bot',
      year: '', status: '',
      short: 'A bot that handles my calls.',
      desc: 'J.A.R.V.I.S is a call handling bot. It picks up the phone so I do not have to.',
      tags: ['Bot', 'Voice', 'Calls'],
      links: [],
      image: 'assets/images/jarvis.jpg', video: '', gallery: [],
      theme: 'signal'
    },
    {
      id: 'indian-brainrot', title: 'Indian Brainrot', type: 'game', kind: 'Game',
      year: '', status: '',
      short: 'A game built on Indian brainrot humour.',
      desc: 'A game built around Indian brainrot humour, as loud and chaotic as it sounds.',
      tags: ['Game', 'Comedy'],
      links: [],                 // TODO  e.g. [{label:'Play it', href:'https://...'}]
      image: 'assets/images/indian-brainrot.jpg', video: '', gallery: [],
      theme: 'chaos'
    },
    {
      id: 'hollowpoint', title: 'Hollowpoint', type: 'game', kind: 'Game',
      year: '', status: '',
      short: 'A game I designed and built.',
      desc: 'Hollowpoint is a game I designed and built myself.',
      tags: ['Game'],
      links: [],
      image: 'assets/images/hollowpoint.jpg', video: '', gallery: [],
      theme: 'ember'
    },
    {
      id: 'this-website', title: 'This Website', type: 'web', kind: 'Website',
      year: '', status: 'You are here',
      short: 'The site you are on right now.',
      desc: 'The site you are on right now. 3D toys, a beat to dance to, and far too many scroll effects.',
      tags: ['Website', 'WebGL', 'Motion'],
      links: [{ label: 'See the code', href: 'https://github.com/davlovescode-tech/newweb' }],
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
  about: 'I am a self-taught developer who likes building things that feel alive. I started with Roblox scripts, kept going with bots and games, and never stopped adding details nobody asked for.',  // TODO  tell your own story
  toolbox: ['Luau', 'Roblox Studio', 'Discord API', 'HTML + CSS', 'JavaScript', 'Git + GitHub'],   // TODO  edit to match what you really use
  now: [                         // TODO  small "right now" list
    ['Building', 'The next project, see chapter 09'],
    ['Playing', 'Your current game'],
    ['Listening', 'Your current track']
  ],
  socials: [                     // empty links are skipped
    ['GitHub', 'https://github.com/davlovescode-tech'],
    ['Discord', ''],             // TODO
    ['YouTube', ''],
    ['Instagram', ''],
    ['X / Twitter', '']
  ]
};
