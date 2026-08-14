export type Waveform = "sine" | "triangle" | "sawtooth" | "square";

export type TrackSeed = {
  rootMidi: number;
  progression: number; // index into PROGRESSIONS
  tempoMs: number;
  waveform: Waveform;
  brightness: number; // lowpass cutoff Hz
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds
  hue: number; // thumbnail gradient hue
  seed: TrackSeed;
  /** Verified official YouTube video ID — real audio via the YouTube IFrame
   * Player API. Undefined tracks fall back to the synthesized placeholder. */
  youtubeId?: string;
};

export type Playlist = {
  slug: string;
  path: string;
  name: string;
  shortLabel: string;
  tagline: string;
  tracks: Track[];
};

// deterministic string hash -> [0, 1)
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

function seedFor(
  id: string,
  waveform: Waveform,
  tempoRange: [number, number],
  brightnessRange: [number, number]
): TrackSeed {
  const a = hash(id);
  const b = hash(id + "b");
  const c = hash(id + "c");
  return {
    rootMidi: 45 + Math.floor(a * 14), // A2 .. ~G3
    progression: Math.floor(b * PROGRESSIONS.length),
    tempoMs: Math.round(tempoRange[0] + b * (tempoRange[1] - tempoRange[0])),
    waveform,
    brightness: Math.round(
      brightnessRange[0] + c * (brightnessRange[1] - brightnessRange[0])
    ),
  };
}

function durationFor(id: string, min: number, max: number): number {
  return Math.round(min + hash(id + "dur") * (max - min));
}

function hueFor(id: string, base: number, spread: number): number {
  return Math.round((base + hash(id + "hue") * spread) % 360);
}

// chord tone offsets (semitones from root), lounge/jazz voicings
export const PROGRESSIONS: number[][][] = [
  [[0, 3, 7, 10], [5, 9, 12, 14], [0, 4, 7, 11], [9, 12, 15, 19]], // ii-V-I-vi (minor start)
  [[0, 4, 7, 11], [9, 12, 16, 19], [5, 9, 12, 16], [7, 11, 14, 17]], // I-vi-IV-V
  [[0, 3, 7, 10], [0, 4, 7, 10], [5, 9, 12, 16], [7, 10, 14, 17]], // min7-dom-IVmaj-Vdom
  [[0, 2, 7, 9], [0, 4, 7, 11], [9, 12, 16, 19], [5, 8, 12, 15]], // sus2-maj7-vi-iv
  [[0, 4, 7, 9], [5, 9, 12, 14], [2, 5, 9, 12], [7, 11, 14, 16]], // maj6 wander
];

let n = 0;
function id(prefix: string) {
  n += 1;
  return `${prefix}-${n}`;
}

// Track metadata (title / singer / film & year) reproduces publicly known,
// factual song information only — no lyrics or audio are included anywhere
// in this project. Most tracks play a synthesized placeholder; a handful
// carry a verified `youtubeId` for real audio via the YouTube IFrame API.
type RawTrack = { title: string; artist: string; youtubeId?: string };

function bollywood(
  prefix: string,
  raw: RawTrack[]
): Omit<Track, "seed">[] {
  return raw.map(({ title, artist, youtubeId }) => ({
    id: id(prefix),
    title,
    artist,
    duration: 0,
    hue: 0,
    youtubeId,
  }));
}

const elevatorRaw: RawTrack[] = [
  { title: "Zara Sa", artist: "KK · Jannat (2008)", youtubeId: "5IY4BNj0-10" },
  { title: "Khuda Jaane", artist: "KK, Shilpa Rao · Bachna Ae Haseeno (2008)", youtubeId: "cmMiyZaSELo" },
  { title: "Awarapan Banjarapan", artist: "KK · Jism (2003)", youtubeId: "2sYPXnFoBog" },
  { title: "Alvida", artist: "KK · Life in a Metro (2007)", youtubeId: "dlBX5YKuanI" },
  { title: "Beete Lamhe", artist: "KK · The Train (2007)", youtubeId: "CwAW6ga3xPQ" },
  { title: "Kya Mujhe Pyaar Hai", artist: "KK · Woh Lamhe (2006)", youtubeId: "lrAM_H7v8wM" },
  { title: "Woh Lamhe", artist: "Atif Aslam · Zeher (2005)", youtubeId: "Sut_KOIbwn0" },
  { title: "Jashn-E-Bahaara", artist: "Javed Ali · Jodhaa Akbar (2008)", youtubeId: "4h1WFyOQv0Y" },
  { title: "Kal Ho Naa Ho", artist: "Sonu Nigam · Kal Ho Naa Ho (2003)", youtubeId: "g0eO74UmRBs" },
  { title: "Abhi Mujh Mein Kahin", artist: "Sonu Nigam · Agneepath (2012)", youtubeId: "AdY_KpBmi6k" },
  { title: "Sun Raha Hai Na Tu", artist: "Shreya Ghoshal · Aashiqui 2 (2013)", youtubeId: "inEu2qQuGZ8" },
  { title: "Barso Re", artist: "Shreya Ghoshal · Guru (2007)", youtubeId: "asw-wTDzGUQ" },
  { title: "Jadu Hai Nasha Hai", artist: "Shreya Ghoshal · Jism (2003)", youtubeId: "cs4BiYVnq2s" },
  { title: "Deewani Mastani", artist: "Shreya Ghoshal · Bajirao Mastani (2015)", youtubeId: "zRtPUIumXcY" },
  { title: "Bahara", artist: "Shreya Ghoshal, Sona Mohapatra · I Hate Luv Storys (2010)", youtubeId: "7N74i_rAfFE" },
  { title: "Tanha Dil", artist: "Shaan · non-film single (2000)", youtubeId: "1Wm3NB6lYjs" },
  { title: "Chand Sifarish", artist: "Shaan, Kailash Kher · Fanaa (2006)", youtubeId: "zWEOx7TSM6I" },
  { title: "Tera Suroor", artist: "Himesh Reshammiya · Aap Kaa Surroor (2007)", youtubeId: "LoXSy9Y7L4c" },
  { title: "Aashiq Banaya Aapne", artist: "Himesh Reshammiya, Shreya Ghoshal · Aashiq Banaya Aapne (2005)", youtubeId: "0bAVd9jJE2Q" },
  { title: "Mann Ki Lagan", artist: "Rahat Fateh Ali Khan · Paap (2003)", youtubeId: "jUDP6LmgcCE" },
];

const meetingRaw: RawTrack[] = [
  { title: "Aap Ki Kashish", artist: "Himesh Reshammiya, Krishna, Ahir · Aashiq Banaya Aapne (2005)", youtubeId: "2drBOxrFl4s" },
  { title: "Teri Ore", artist: "Shreya Ghoshal, Rahat Fateh Ali Khan · Singh Is Kinng (2008)", youtubeId: "GLEx6bhPu7s" },
  { title: "Manwa Laage", artist: "Shreya Ghoshal, Arijit Singh · Happy New Year (2014)", youtubeId: "d8IT-16kA8M" },
  { title: "Main Agar Kahoon", artist: "Sonu Nigam, Shreya Ghoshal · Om Shanti Om (2007)", youtubeId: "o-Gmhk90JOE" },
  { title: "Aankhon Mein Teri", artist: "KK · Om Shanti Om (2007)", youtubeId: "Ha4BUOcLQE4" },
  { title: "O Meri Zohra Jabeen", artist: "Himesh Reshammiya · Phir Hera Pheri (2006)", youtubeId: "EH9yR6T4ePI" },
  { title: "Mujhko Yaad Sataye Teri", artist: "Himesh Reshammiya · Phir Hera Pheri (2006)", youtubeId: "nb0y9zx8yRE" },
  { title: "Right Here Right Now", artist: "Abhishek Bachchan, Sunidhi Chauhan · Bluffmaster! (2005)", youtubeId: "yxmby8L7HE8" },
  { title: "Bhaage Re Mann", artist: "Sunidhi Chauhan · Chameli (2004)", youtubeId: "pkV4VbjIcCo" },
  { title: "Ye Ishq Hai", artist: "Shreya Ghoshal · Jab We Met (2007)", youtubeId: "dXpG0kavjUo" },
  { title: "Ishq Sufiyana", artist: "Sunidhi Chauhan · The Dirty Picture (2011)", youtubeId: "lQi7Kzy964g" },
  { title: "Just Chill", artist: "Sonu Nigam, Jayesh Gandhi, Amrita Kak · Maine Pyaar Kyun Kiya (2005)", youtubeId: "w5iA5LIwF2A" },
  { title: "Saathiya", artist: "Sonu Nigam, A.R. Rahman · Saathiya (2002)", youtubeId: "eMA6GHTQ4WA" },
  { title: "Dus Bahane", artist: "KK, Shaan · Dus (2005)", youtubeId: "qE3DfF66DNA" },
  { title: "Bahon Ke Darmiyan", artist: "Alka Yagnik, Hariharan · Khamoshi: The Musical (1996)", youtubeId: "yx3pXbo1aBM" },
  { title: "Salaam-E-Ishq", artist: "Sonu Nigam, Shreya Ghoshal, Kunal Ganjawala, Sadhana Sargam · Salaam-E-Ishq (2007)", youtubeId: "Oi8YUtO8Ogg" },
  { title: "Jhalak Dikhlaja", artist: "Himesh Reshammiya · Aksar (2006)", youtubeId: "6hQ7yZIh9K4" },
  { title: "Suno Na", artist: "Shaan · Jhankaar Beats (2003)", youtubeId: "E0i-6b1vpUs" },
  { title: "Haule Haule", artist: "Sukhwinder Singh · Rab Ne Bana Di Jodi (2008)", youtubeId: "XgdY_s1LsZc" },
  { title: "Piyu Bole", artist: "Sonu Nigam, Shreya Ghoshal · Parineeta (2005)", youtubeId: "ZAkr0KFFLLs" },
];

const holdRaw: RawTrack[] = [
  { title: "Sheila Ki Jawani", artist: "Sunidhi Chauhan, Vishal Dadlani · Tees Maar Khan (2010)", youtubeId: "wNGZXBd2NhY" },
  { title: "Munni Badnaam Hui", artist: "Mamta Sharma, Aishwarya Nigam · Dabangg (2010)", youtubeId: "vJV_WSPlK6Q" },
  { title: "Fevicol Se", artist: "Mamta Sharma, Wajid · Dabangg 2 (2012)", youtubeId: "zE7Pwgl6sLA" },
  { title: "Chikni Chameli", artist: "Shreya Ghoshal · Agneepath (2012)", youtubeId: "MQM7CNoAsBI" },
  { title: "Ooh La La", artist: "Shreya Ghoshal, Bappi Lahiri · The Dirty Picture (2011)", youtubeId: "Yg-qlKb4X7U" },
  { title: "Halkat Jawani", artist: "Sunidhi Chauhan · Heroine (2012)", youtubeId: "U84UPFVRivc" },
  { title: "Character Dheela", artist: "Neeraj Shridhar, Amrita Kak · Ready (2011)", youtubeId: "ruEQPQX90fI" },
  { title: "Laila Main Laila", artist: "Pawni Pandey · Raees (2017)", youtubeId: "wjk7lV4PwAo" },
  { title: "Baby Doll", artist: "Kanika Kapoor · Ragini MMS 2 (2014)", youtubeId: "yP9KiFTyBks" },
  { title: "Jumme Ki Raat", artist: "Mika Singh, Palak Muchhal · Kick (2014)", youtubeId: "dv_Qjzca56k" },
  { title: "Anarkali Disco Chali", artist: "Mamta Sharma, Sukhwinder Singh · Housefull 2 (2012)", youtubeId: "TDNh7V2OI8c" },
  { title: "Ghagra", artist: "Rekha Bhardwaj, Vishal Dadlani · Yeh Jawaani Hai Deewani (2013)", youtubeId: "caoGNx1LF2Q" },
  { title: "Marjaani Marjaani", artist: "Sukhwinder Singh, Sunidhi Chauhan · Billu (2009)", youtubeId: "VnkoADZxVqg" },
  { title: "Babli Badmaash", artist: "Sunidhi Chauhan, Anu Malik · Shootout at Wadala (2013)", youtubeId: "_jFIHVKeVec" },
  { title: "Chiggy Wiggy", artist: "Kylie Minogue, Sonu Nigam, Suzanne D'Mello · Blue (2009)", youtubeId: "9wgS-ZIvHlY" },
  { title: "Lovely", artist: "Kanika Kapoor, Ravindra Upadhyay, Miraya Varma, Fateh · Happy New Year (2014)", youtubeId: "HT7g_9eNnYk" },
  { title: "Nagada Sang Dhol", artist: "Shreya Ghoshal, Osman Mir · Goliyon Ki Raasleela Ram-Leela (2013)", youtubeId: "vK5E_aeBGYA" },
  { title: "Radha", artist: "Shreya Ghoshal, Udit Narayan, Vishal Dadlani · Student of the Year (2012)", youtubeId: "kZqH9Kfv6BI" },
  { title: "Crazy Kiya Re", artist: "Sunidhi Chauhan · Dhoom 2 (2006)", youtubeId: "J2Bh68GTUOU" },
  { title: "Beedi", artist: "Sunidhi Chauhan, Sukhwinder Singh · Omkara (2006)", youtubeId: "XLJCtZK0x5M" },
];

const mondayRaw: RawTrack[] = [
  { title: "Deewangi Deewangi", artist: "Shaan, Udit Narayan, Shreya Ghoshal, Sunidhi Chauhan · Om Shanti Om (2007)", youtubeId: "VzLG6OqOcn8" },
  { title: "Dhoom Taana", artist: "Shreya Ghoshal, Abhijeet Bhattacharya, Vishal Dadlani · Om Shanti Om (2007)", youtubeId: "TjUXr560Gu0" },
  { title: "Ta Ra Rum Pum", artist: "Shaan, Mahalakshmi Iyer · Ta Ra Rum Pum (2007)", youtubeId: "SgFsAX2qulY" },
  { title: "Kiya Kiya", artist: "Anand Raaj Anand, Shweta Pandit · Welcome (2007)", youtubeId: "qEsAp_rLwa0" },
  { title: "Ainvayi Ainvayi", artist: "Sunidhi Chauhan, Salim Merchant · Band Baaja Baaraat (2010)", youtubeId: "-Rnfls0OqtE" },
  { title: "Sajna Ji Vaari Vaari", artist: "Sunidhi Chauhan, Shekhar Ravjiani · Honeymoon Travels Pvt. Ltd (2007)", youtubeId: "tfVIpS3rwlM" },
  { title: "Kaal Dhamaal", artist: "Kunal Ganjawala, Salim-Sulaiman, Caralisa Monteiro · Kaal (2005)", youtubeId: "J5MGaHLPfeI" },
  { title: "Bebo", artist: "Alisha Chinai · Kambakkht Ishq (2009)", youtubeId: "r3ODNiwVYJo" },
  { title: "Tinku Jiya", artist: "Mamta Sharma, Javed Ali · Yamla Pagla Deewana (2011)", youtubeId: "94A9SNq6sBA" },
  { title: "Ucha Lamba Kad", artist: "Anand Raaj Anand, Kalpana Patowary · Welcome (2007)", youtubeId: "WZ_U_nDi-Zs" },
  { title: "Dance Pe Chance", artist: "Sunidhi Chauhan, Labh Janjua · Rab Ne Bana Di Jodi (2008)", youtubeId: "0Mi2W3uXTPQ" },
  { title: "Balam Pichkari", artist: "Shalmali Kholgade, Vishal Dadlani · Yeh Jawaani Hai Deewani (2013)", youtubeId: "0WtRNGubWGA" },
  { title: "Gallan Goodiyaan", artist: "Shankar Mahadevan, Yashita Sharma, Manish Kumar Tipu, Farhan Akhtar, Sukhwinder Singh · Dil Dhadakne Do (2015)", youtubeId: "jCEdTq3j-0U" },
  { title: "London Thumakda", artist: "Labh Janjua, Sonu Kakkar, Neha Kakkar · Queen (2014)", youtubeId: "udra3Mfw2oo" },
  { title: "Malhari", artist: "Vishal Dadlani · Bajirao Mastani (2015)", youtubeId: "YUH9jD__qHY" },
  { title: "Second Hand Jawani", artist: "Miss Pooja, Neha Kakkar, Nakash Aziz · Cocktail (2012)", youtubeId: "mDlmtKWqkVI" },
  { title: "Daaru Desi", artist: "Benny Dayal, Shalmali Kholgade · Cocktail (2012)", youtubeId: "3nA1hmKCRpE" },
  { title: "Twist", artist: "Neeraj Shridhar · Love Aaj Kal (2009)", youtubeId: "KgmeL_xuB0I" },
  { title: "Subha Hone Na De", artist: "Mika Singh, Shefali Alvares · Desi Boyz (2011)", youtubeId: "3SLXNc41-Uc" },
  { title: "Chittiyaan Kalaiyaan", artist: "Meet Bros Anjjan, Kanika Kapoor · Roy (2015)", youtubeId: "zpsVpnvFfZQ" },
];

const fridayRaw: RawTrack[] = [
  { title: "Dhoom Machale", artist: "Sunidhi Chauhan · Dhoom (2004)", youtubeId: "PN4_aNSA1hg" },
  { title: "Dhoom Again", artist: "Vishal Dadlani, Dominique Cerejo · Dhoom 2 (2006)", youtubeId: "WGXmDsOwW4k" },
  { title: "Dhoom Machale Dhoom", artist: "Aditi Singh Sharma · Dhoom 3 (2013)", youtubeId: "GUBa1wRxQko" },
  { title: "Kamli", artist: "Sunidhi Chauhan · Dhoom 3 (2013)", youtubeId: "YrrDrx5Rd_I" },
  { title: "Chammak Challo", artist: "Akon, Hamsika Iyer · Ra.One (2011)", youtubeId: "AMQIK_vlJXU" },
  { title: "Desi Girl", artist: "Shankar Mahadevan, Sunidhi Chauhan, Vishal Dadlani · Dostana (2008)", youtubeId: "wDIrpvH8MzE" },
  { title: "Lungi Dance", artist: "Yo Yo Honey Singh · Chennai Express (2013)", youtubeId: "HVFb5-MrP4A" },
  { title: "Kar Gayi Chull", artist: "Badshah, Fazilpuria, Sukriti Kakar, Neha Kakkar · Kapoor & Sons (2016)", youtubeId: "NTHz9ephYTw" },
  { title: "Party All Night", artist: "Yo Yo Honey Singh · Boss (2013)", youtubeId: "fMZ7GotVUDY" },
  { title: "Tune Maari Entriyaan", artist: "Vishal Dadlani, KK, Neeti Mohan, Bappi Lahiri · Gunday (2014)", youtubeId: "2I3NgxDAiqE" },
  { title: "Abhi Toh Party Shuru Hui Hai", artist: "Badshah, Aastha Gill · Khoobsurat (2014)", youtubeId: "D8I2D6VLQQc" },
  { title: "Ishq Shava", artist: "Shilpa Rao, Raghav Mathur · Jab Tak Hai Jaan (2012)", youtubeId: "iEJPDYrLtsI" },
  { title: "Saturday Saturday", artist: "Sharib Toshi, Badshah, Indeep Bakshi, Akriti Kakar · Humpty Sharma Ki Dulhania (2014)", youtubeId: "PfuL6eJNqZY" },
  { title: "Move Your Lakk", artist: "Diljit Dosanjh, Badshah, Sonakshi Sinha · Noor (2017)", youtubeId: "kMRRIMmICmM" },
  { title: "Angreji Beat", artist: "Yo Yo Honey Singh, Gippy Grewal · International Villager (2011)", youtubeId: "ZTgvgmhC1gQ" },
  { title: "High Heels Te Nachche", artist: "Meet Bros, Jaz Dhami, Yo Yo Honey Singh, Aditi Singh Sharma · Ki & Ka (2016)", youtubeId: "7tqjQcfkQ9c" },
  { title: "Nachde Ne Saare", artist: "Jasleen Royal, Harshdeep Kaur, Siddharth Mahadevan · Baar Baar Dekho (2016)", youtubeId: "HgIW7P4dsXU" },
  { title: "Kamariya", artist: "Aastha Gill, Divya Kumar · Stree (2018)", youtubeId: "9LtJYw1eY30" },
  { title: "Sadi Gali", artist: "Lehmber Hussainpuri · Tanu Weds Manu (2011)", youtubeId: "FFa9SYQbWnY" },
  { title: "Fashion Khatam Mujhpe", artist: "Mamta Sharma, Shabab Sabri, Wajid · Dolly Ki Doli (2015)", youtubeId: "PKhjmDgy_iI" },
];

function withSeeds(
  tracks: Omit<Track, "seed">[],
  waveform: Waveform,
  tempoRange: [number, number],
  brightnessRange: [number, number],
  durationRange: [number, number],
  hueBase: number,
  hueSpread: number
): Track[] {
  return tracks.map((t) => ({
    ...t,
    duration: durationFor(t.id, durationRange[0], durationRange[1]),
    hue: hueFor(t.id, hueBase, hueSpread),
    seed: seedFor(t.id, waveform, tempoRange, brightnessRange),
  }));
}

const elevator = withSeeds(
  bollywood("elevator", elevatorRaw),
  "triangle",
  [2600, 3400],
  [1400, 2200],
  [235, 320],
  32,
  22
);
const meeting = withSeeds(
  bollywood("meeting", meetingRaw),
  "sine",
  [2800, 3600],
  [1000, 1700],
  [230, 310],
  220,
  40
);
const holdMusic = withSeeds(
  bollywood("hold", holdRaw),
  "sawtooth",
  [1900, 2500],
  [2400, 3600],
  [200, 260],
  330,
  30
);
const monday = withSeeds(
  bollywood("monday", mondayRaw),
  "sawtooth",
  [1800, 2400],
  [2600, 3800],
  [205, 270],
  4,
  20
);
const friday = withSeeds(
  bollywood("friday", fridayRaw),
  "square",
  [1700, 2200],
  [2800, 4000],
  [195, 255],
  285,
  35
);

export const PLAYLISTS: Playlist[] = [
  {
    slug: "all-hands",
    path: "/",
    name: "All Hands",
    shortLabel: "All Hands",
    tagline: "Every mood, every floor, one non-stop mix.",
    tracks: [...elevator, ...meeting, ...holdMusic, ...monday, ...friday],
  },
  {
    slug: "elevator",
    path: "/elevator",
    name: "Elevator",
    shortLabel: "Elevator",
    tagline: "Soft and romantic, stuck between floors.",
    tracks: elevator,
  },
  {
    slug: "hold-music",
    path: "/hold-music",
    name: "Hold Music",
    shortLabel: "Hold Music",
    tagline: "Your call is important. Please enjoy this item number.",
    tracks: holdMusic,
  },
  {
    slug: "monday-motivation",
    path: "/monday-motivation",
    name: "Monday Motivation",
    shortLabel: "Monday Motivation",
    tagline: "High-energy hits to survive the 9am standup.",
    tracks: monday,
  },
  {
    slug: "friday-4pm",
    path: "/friday-4pm",
    name: "Friday 4PM",
    shortLabel: "Friday 4PM",
    tagline: "Dance floor energy for the last hour of the week.",
    tracks: friday,
  },
  {
    slug: "meeting-email",
    path: "/meeting-email",
    name: "Meeting That Should've Been an Email",
    shortLabel: "Could've Been an Email",
    tagline: "Slow jams for a meeting with zero action items.",
    tracks: meeting,
  },
];

export function getPlaylistBySlug(slug: string): Playlist | undefined {
  return PLAYLISTS.find((p) => p.slug === slug);
}

export function getPlaylistByPath(path: string): Playlist {
  return PLAYLISTS.find((p) => p.path === path) ?? PLAYLISTS[0];
}

export const TOTAL_TRACK_COUNT =
  elevator.length +
  meeting.length +
  holdMusic.length +
  monday.length +
  friday.length;

export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// Official YouTube thumbnail for a track's video — hotlinked from YouTube's
// own CDN (the same image any YouTube embed or share preview shows), not
// downloaded or re-hosted. Falls back to a gradient tile when a track has
// no youtubeId.
export function youtubeThumbnail(track: Track): string | null {
  if (!track.youtubeId) return null;
  return `https://i.ytimg.com/vi/${track.youtubeId}/hqdefault.jpg`;
}

export function shareUrlFor(playlist: Playlist, track: Track): string {
  const params = new URLSearchParams({
    playlist: playlist.slug,
    track: track.id,
  });
  return `/?${params.toString()}`;
}
