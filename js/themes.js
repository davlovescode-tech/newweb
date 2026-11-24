/* ---------------------------------------------------------------------
   COLOUR THEMES
   The four "base" themes are what the C key / colour button cycles through.
   Every project chapter switches the whole page (and the 3D toys) to the
   theme named in its `theme` field in config.js.

   bg / ink / a1 / a2 / on1  = page colours
     bg   background          ink  main text
     a1   accent (buttons, highlights)       on1  text that sits on top of a1
     a2   second accent (confetti, dots)
   toy[8]  = colours of the 3D objects, in this order:
     0 handheld  1 big ball  2 big pill  3 donut  4 record label  5 cube  6 small ball  7 small pill
   dark = record + screen body, scr = handheld screen glow,
   spot = moving light colour, bounce = colour bounced up from below
   --------------------------------------------------------------------- */
window.BASE_THEMES = ['cobalt', 'bubblegum', 'lemon', 'night'];

window.THEMES = {
  cobalt:    {name:'Cobalt',    bg:'#2A3CFF', ink:'#F7F4FF', a1:'#FFD23F', a2:'#FF4FA3', on1:'#12102A',
              toy:['#FF4FA3','#F6F2FF','#FFD23F','#2EE6B0','#FFD23F','#FF7A3D','#FF4FA3','#FFFFFF'], dark:'#12102A', scr:'#8CFFE0', spot:'#FFD23F', bounce:'#FF4FA3'},
  bubblegum: {name:'Bubblegum', bg:'#FF86C8', ink:'#1B0E33', a1:'#2A3CFF', a2:'#FFFFFF', on1:'#FFFFFF',
              toy:['#2A3CFF','#FFFFFF','#FFE14A','#1B0E33','#2A3CFF','#2FE0A8','#2A3CFF','#FFFFFF'], dark:'#1B0E33', scr:'#FFFFFF', spot:'#FFFFFF', bounce:'#2A3CFF'},
  lemon:     {name:'Lemon',     bg:'#FFD84A', ink:'#15152B', a1:'#FF4B2B', a2:'#2A3CFF', on1:'#15152B',
              toy:['#FF4B2B','#2A3CFF','#FF5CB2','#FFFFFF','#2A3CFF','#15152B','#FFFFFF','#2A3CFF'], dark:'#15152B', scr:'#FFF3B0', spot:'#FFFFFF', bounce:'#FF4B2B'},
  night:     {name:'Night',     bg:'#0B0817', ink:'#F6F2FF', a1:'#3DF2E0', a2:'#FF4FA3', on1:'#0B0817',
              toy:['#FF4FA3','#7C6BFF','#3DF2E0','#FFD23F','#FF4FA3','#7C6BFF','#3DF2E0','#FFFFFF'], dark:'#1A1530', scr:'#3DF2E0', spot:'#3DF2E0', bounce:'#7C6BFF'},

  /* project themes */
  brick:     {name:'Brick',     bg:'#FF5A36', ink:'#14121F', a1:'#FFFFFF', a2:'#FFE14A', on1:'#14121F',
              toy:['#FFE14A','#FFFFFF','#14121F','#2A3CFF','#FFE14A','#FFFFFF','#14121F','#FFE14A'], dark:'#14121F', scr:'#FFF3B0', spot:'#FFFFFF', bounce:'#FFE14A'},
  sky:       {name:'Sky',       bg:'#A8E6FF', ink:'#0A1F44', a1:'#E4007C', a2:'#0A1F44', on1:'#FFFFFF',
              toy:['#E4007C','#FFFFFF','#FFD23F','#0A1F44','#E4007C','#2A3CFF','#E4007C','#FFFFFF'], dark:'#0A1F44', scr:'#FFFFFF', spot:'#FFFFFF', bounce:'#2A3CFF'},
  violet:    {name:'Violet',    bg:'#6A3DF0', ink:'#F6F1FF', a1:'#7CFFB2', a2:'#FF4F8B', on1:'#0F0A2A',
              toy:['#7CFFB2','#FFFFFF','#FF4F8B','#FFD23F','#7CFFB2','#2A3CFF','#FF4F8B','#FFFFFF'], dark:'#0F0A2A', scr:'#7CFFB2', spot:'#7CFFB2', bounce:'#FF4F8B'},
  mint:      {name:'Mint',      bg:'#0A9E86', ink:'#03211C', a1:'#FFFFFF', a2:'#FFEA5C', on1:'#03211C',
              toy:['#FFEA5C','#FFFFFF','#FF5C93','#03211C','#FFEA5C','#2A3CFF','#FF5C93','#FFFFFF'], dark:'#03211C', scr:'#FFFFFF', spot:'#FFFFFF', bounce:'#FFEA5C'},
  signal:    {name:'Signal',    bg:'#0A1230', ink:'#EAF2FF', a1:'#3DB8FF', a2:'#FFB347', on1:'#05102A',
              toy:['#3DB8FF','#FFFFFF','#FFB347','#7C93FF','#3DB8FF','#FFB347','#FFFFFF','#3DB8FF'], dark:'#18224A', scr:'#3DB8FF', spot:'#3DB8FF', bounce:'#FFB347'},
  chaos:     {name:'Chaos',     bg:'#FF8A1F', ink:'#1A0B2E', a1:'#1A0B2E', a2:'#22D36B', on1:'#FFFFFF',
              toy:['#22D36B','#FFFFFF','#FF2E93','#2A3CFF','#22D36B','#FFE14A','#FF2E93','#FFFFFF'], dark:'#1A0B2E', scr:'#B6FFCF', spot:'#FFFFFF', bounce:'#FF2E93'},
  ember:     {name:'Ember',     bg:'#17100E', ink:'#F4E9E4', a1:'#FF4A3D', a2:'#FFB000', on1:'#17100E',
              toy:['#FF4A3D','#E6E0DC','#FFB000','#5A4B46','#FF4A3D','#FFB000','#E6E0DC','#FF4A3D'], dark:'#2A1F1C', scr:'#FFB000', spot:'#FF4A3D', bounce:'#FF4A3D'},
  void:      {name:'Void',      bg:'#101018', ink:'#F5F5FA', a1:'#FF4FA3', a2:'#3DF2E0', on1:'#101018',
              toy:['#3A3A4A','#F5F5FA','#FF4FA3','#2B2B38','#FF4FA3','#3DF2E0','#F5F5FA','#FF4FA3'], dark:'#1B1B26', scr:'#FF4FA3', spot:'#FF4FA3', bounce:'#3DF2E0'}
};
