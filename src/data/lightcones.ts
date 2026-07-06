export interface LightCone {
  slug: string;
  name: string;
  rarity?: 3 | 4 | 5;
  file?: string;    // override local filename when it doesn't follow {slug}_card.webp
  iconUrl?: string; // full URL override (used when portrait isn't on the CDN yet)
}

// ─── How to add a custom / collab light cone ────────────────────────────────
//
//  All official LCs below load images from the CDN automatically (numeric slug).
//
//  For custom/collab LCs not in the list:
//    1. Drop your image into:  a:\Codes\icons\lc\<slug>_card.webp
//    2. Add one line at the bottom of LIGHT_CONES:
//         { slug: "your-text-slug", name: "Display Name" },
//
//  lcIconUrl() detects numeric slugs → CDN, text slugs → local file.
// ────────────────────────────────────────────────────────────────────────────

export const LIGHT_CONES: LightCone[] = [

  // ── 5★ Light Cones ──────────────────────────────────────────────────────
  { slug: "23000", name: "Night on the Milky Way",                      rarity: 5 },
  { slug: "23001", name: "In the Night",                                 rarity: 5 },
  { slug: "23002", name: "Something Irreplaceable",                      rarity: 5 },
  { slug: "23003", name: "But the Battle Isn't Over",                    rarity: 5 },
  { slug: "23004", name: "In the Name of the World",                     rarity: 5 },
  { slug: "23005", name: "Moment of Victory",                            rarity: 5 },
  { slug: "23006", name: "Patience Is All You Need",                     rarity: 5 },
  { slug: "23007", name: "Incessant Rain",                               rarity: 5 },
  { slug: "23008", name: "Echoes of the Coffin",                         rarity: 5 },
  { slug: "23009", name: "The Unreachable Side",                         rarity: 5 },
  { slug: "23010", name: "Before Dawn",                                   rarity: 5 },
  { slug: "23011", name: "She Already Shut Her Eyes",                    rarity: 5 },
  { slug: "23012", name: "Sleep Like the Dead",                          rarity: 5 },
  { slug: "23013", name: "Time Waits for No One",                        rarity: 5 },
  { slug: "23014", name: "I Shall Be My Own Sword",                      rarity: 5 },
  { slug: "23015", name: "Brighter Than the Sun",                        rarity: 5 },
  { slug: "23016", name: "Worrisome, Blissful",                          rarity: 5 },
  { slug: "23017", name: "Night of Fright",                              rarity: 5 },
  { slug: "23018", name: "An Instant Before A Gaze",                     rarity: 5 },
  { slug: "23019", name: "Past Self in Mirror",                          rarity: 5 },
  { slug: "23020", name: "Baptism of Pure Thought",                      rarity: 5 },
  { slug: "23021", name: "Earthly Escapade",                             rarity: 5 },
  { slug: "23022", name: "Reforged Remembrance",                         rarity: 5 },
  { slug: "23023", name: "Inherently Unjust Destiny",                    rarity: 5 },
  { slug: "23024", name: "Along the Passing Shore",                      rarity: 5 },
  { slug: "23025", name: "Whereabouts Should Dreams Rest",               rarity: 5 },
  { slug: "23026", name: "Flowing Nightglow",                            rarity: 5 },
  { slug: "23027", name: "Sailing Towards a Second Life",                rarity: 5 },
  { slug: "23028", name: "Yet Hope Is Priceless",                        rarity: 5 },
  { slug: "23029", name: "Those Many Springs",                           rarity: 5 },
  { slug: "23030", name: "Dance at Sunset",                              rarity: 5 },
  { slug: "23031", name: "I Venture Forth to Hunt",                      rarity: 5 },
  { slug: "23032", name: "Scent Alone Stays True",                       rarity: 5 },
  { slug: "23033", name: "Ninjutsu Inscription: Dazzling Evilbreaker",   rarity: 5 },
  { slug: "23034", name: "A Grounded Ascent",                            rarity: 5 },
  { slug: "23035", name: "Long Road Leads Home",                         rarity: 5 },
  { slug: "23036", name: "Time Woven Into Gold",                         rarity: 5 },
  { slug: "23037", name: "Into the Unreachable Veil",                    rarity: 5 },
  { slug: "23038", name: "If Time Were a Flower",                        rarity: 5 },
  { slug: "23039", name: "Flame of Blood, Blaze My Path",                rarity: 5 },
  { slug: "23040", name: "Make Farewells More Beautiful",                 rarity: 5 },
  { slug: "23041", name: "Life Should Be Cast to Flames",                 rarity: 5 },
  { slug: "23042", name: "Long May Rainbows Adorn the Sky",               rarity: 5 },
  { slug: "23043", name: "Lies Dance on the Breeze",                      rarity: 5 },
  { slug: "23044", name: "Thus Burns the Dawn",                           rarity: 5 },
  { slug: "23045", name: "A Thankless Coronation",                        rarity: 5 },
  { slug: "23046", name: "The Hell Where Ideals Burn",                    rarity: 5 },
  { slug: "23047", name: "Why Does the Ocean Sing",                       rarity: 5 },
  { slug: "23048", name: "Epoch Etched in Golden Blood",                  rarity: 5 },
  { slug: "23049", name: "To Evernight's Stars",                          rarity: 5 },
  { slug: "23050", name: "Never Forget Her Flame",                        rarity: 5 },
  { slug: "23051", name: "Though Worlds Apart",                           rarity: 5 },
  { slug: "23052", name: "This Love, Forever",                            rarity: 5 },
  { slug: "23053", name: "Dazzled by a Flowery World",                    rarity: 5 },
  { slug: "23054", name: "When She Decided to See",                       rarity: 5 },
  { slug: "23056", name: "The Finale of a Lie",                           rarity: 5 },
  { slug: "23057", name: "Welcome to the Cosmic City",                    rarity: 5 },
  { slug: "23058", name: "Until the Flowers Bloom Again",                 rarity: 5 },
  { slug: "23059", name: "Reforged in Hellfire",                          rarity: 5 },

  // ── 4★ Special / Battle Pass Light Cones (22xxx) ────────────────────────
  { slug: "22000", name: "Before the Tutorial Mission Starts",           rarity: 4 },
  { slug: "22001", name: "Hey, Over Here",                               rarity: 4 },
  { slug: "22002", name: "For Tomorrow's Journey",                       rarity: 4 },
  { slug: "22003", name: "Ninja Record: Sound Hunt",                     rarity: 4 },
  { slug: "22004", name: "The Great Cosmic Enterprise",                  rarity: 4 },
  { slug: "22005", name: "The Forever Victual",                          rarity: 4 },
  { slug: "22006", name: "Fly Into a Pink Tomorrow",                     rarity: 4 },
  { slug: "22007", name: "Tomorrow, Together",                           rarity: 4 },

  // ── 4★ Light Cones (21xxx) ───────────────────────────────────────────────
  { slug: "21000", name: "Post-Op Conversation",                         rarity: 4 },
  { slug: "21001", name: "Good Night and Sleep Well",                    rarity: 4 },
  { slug: "21002", name: "Day One of My New Life",                       rarity: 4 },
  { slug: "21003", name: "Only Silence Remains",                         rarity: 4 },
  { slug: "21004", name: "Memories of the Past",                         rarity: 4 },
  { slug: "21005", name: "The Moles Welcome You",                        rarity: 4 },
  { slug: "21006", name: "The Birth of the Self",                        rarity: 4 },
  { slug: "21007", name: "Shared Feeling",                               rarity: 4 },
  { slug: "21008", name: "Eyes of the Prey",                             rarity: 4 },
  { slug: "21009", name: "Landau's Choice",                              rarity: 4 },
  { slug: "21010", name: "Swordplay",                                    rarity: 4 },
  { slug: "21011", name: "Planetary Rendezvous",                         rarity: 4 },
  { slug: "21012", name: "A Secret Vow",                                 rarity: 4 },
  { slug: "21013", name: "Make the World Clamor",                        rarity: 4 },
  { slug: "21014", name: "Perfect Timing",                               rarity: 4 },
  { slug: "21015", name: "Resolution Shines As Pearls of Sweat",        rarity: 4 },
  { slug: "21016", name: "Trend of the Universal Market",                rarity: 4 },
  { slug: "21017", name: "Subscribe for More!",                          rarity: 4 },
  { slug: "21018", name: "Dance! Dance! Dance!",                         rarity: 4 },
  { slug: "21019", name: "Under the Blue Sky",                           rarity: 4 },
  { slug: "21020", name: "Geniuses' Repose",                             rarity: 4 },
  { slug: "21021", name: "Quid Pro Quo",                                 rarity: 4 },
  { slug: "21022", name: "Fermata",                                      rarity: 4 },
  { slug: "21023", name: "We Are Wildfire",                              rarity: 4 },
  { slug: "21024", name: "River Flows in Spring",                        rarity: 4 },
  { slug: "21025", name: "Past and Future",                              rarity: 4 },
  { slug: "21026", name: "Woof! Walk Time!",                             rarity: 4 },
  { slug: "21027", name: "The Seriousness of Breakfast",                 rarity: 4 },
  { slug: "21028", name: "Warmth Shortens Cold Nights",                  rarity: 4 },
  { slug: "21029", name: "We Will Meet Again",                           rarity: 4 },
  { slug: "21030", name: "This Is Me!",                                  rarity: 4 },
  { slug: "21031", name: "Return to Darkness",                           rarity: 4 },
  { slug: "21032", name: "Carve the Moon, Weave the Clouds",             rarity: 4 },
  { slug: "21033", name: "Nowhere to Run",                               rarity: 4 },
  { slug: "21034", name: "Today Is Another Peaceful Day",                rarity: 4 },
  { slug: "21035", name: "What Is Real?",                                rarity: 4 },
  { slug: "21036", name: "Dreamville Adventure",                         rarity: 4 },
  { slug: "21037", name: "Final Victor",                                 rarity: 4 },
  { slug: "21038", name: "Flames Afar",                                  rarity: 4 },
  { slug: "21039", name: "Destiny's Threads Forewoven",                  rarity: 4 },
  { slug: "21040", name: "The Day The Cosmos Fell",                      rarity: 4 },
  { slug: "21041", name: "It's Showtime",                                rarity: 4 },
  { slug: "21042", name: "Indelible Promise",                            rarity: 4 },
  { slug: "21043", name: "Concert for Two",                              rarity: 4 },
  { slug: "21044", name: "Boundless Choreo",                             rarity: 4 },
  { slug: "21045", name: "After the Charmony Fall",                      rarity: 4 },
  { slug: "21046", name: "Poised to Bloom",                              rarity: 4 },
  { slug: "21047", name: "Shadowed by Night",                            rarity: 4 },
  { slug: "21048", name: "Dream's Montage",                              rarity: 4 },
  { slug: "21050", name: "Victory In a Blink",                           rarity: 4 },
  { slug: "21051", name: "Geniuses' Greetings",                          rarity: 4 },
  { slug: "21052", name: "Sweat Now, Cry Less",                          rarity: 4 },
  { slug: "21053", name: "Journey, Forever Peaceful",                    rarity: 4 },
  { slug: "21054", name: "The Story's Next Page",                        rarity: 4 },
  { slug: "21055", name: "Unto Tomorrow's Morrow",                       rarity: 4 },
  { slug: "21056", name: "In Pursuit of the Wind",                       rarity: 4 },
  { slug: "21057", name: "The Flower Remembers",                         rarity: 4 },
  { slug: "21058", name: "A Trail of Bygone Blood",                      rarity: 4 },
  { slug: "21060", name: "A Dream Scented in Wheat",                     rarity: 4 },
  { slug: "21061", name: "Holiday Thermae Escapade",                     rarity: 4 },
  { slug: "21062", name: "See You at the End",                           rarity: 4 },
  { slug: "21064", name: "Mushy Shroomy's Adventures",                   rarity: 4 },
  { slug: "21065", name: "Today's Good Luck",                            rarity: 4 },

  // ── 3★ Light Cones (20xxx) ───────────────────────────────────────────────
  { slug: "20000", name: "Arrows",                                       rarity: 3 },
  { slug: "20001", name: "Cornucopia",                                   rarity: 3 },
  { slug: "20002", name: "Collapsing Sky",                               rarity: 3 },
  { slug: "20003", name: "Amber",                                        rarity: 3 },
  { slug: "20004", name: "Void",                                         rarity: 3 },
  { slug: "20005", name: "Chorus",                                       rarity: 3 },
  { slug: "20006", name: "Data Bank",                                    rarity: 3 },
  { slug: "20007", name: "Darting Arrow",                                rarity: 3 },
  { slug: "20008", name: "Fine Fruit",                                   rarity: 3 },
  { slug: "20009", name: "Shattered Home",                               rarity: 3 },
  { slug: "20010", name: "Defense",                                      rarity: 3 },
  { slug: "20011", name: "Loop",                                         rarity: 3 },
  { slug: "20012", name: "Meshing Cogs",                                 rarity: 3 },
  { slug: "20013", name: "Passkey",                                      rarity: 3 },
  { slug: "20014", name: "Adversarial",                                  rarity: 3 },
  { slug: "20015", name: "Multiplication",                               rarity: 3 },
  { slug: "20016", name: "Mutual Demise",                                rarity: 3 },
  { slug: "20017", name: "Pioneering",                                   rarity: 3 },
  { slug: "20018", name: "Hidden Shadow",                                rarity: 3 },
  { slug: "20019", name: "Mediation",                                    rarity: 3 },
  { slug: "20020", name: "Sagacity",                                     rarity: 3 },
  { slug: "20021", name: "Shadowburn",                                   rarity: 3 },
  { slug: "20022", name: "Reminiscence",                                 rarity: 3 },
  { slug: "20023", name: "Sneering",                                     rarity: 3 },
  { slug: "20024", name: "Lingering Tear",                               rarity: 3 },

  // ── Custom / collab LCs — add yours below, image goes in a:\Codes\icons\lc\ ──
  { slug: "flickering-stars",             name: "Flickering Stars" },
  { slug: "a-star-that-lights-the-night", name: "A Star That Lights the Night", file: "A Star That Lights the Night.webp" },
];

export function lcSlugToName(slug: string): string {
  return LIGHT_CONES.find((lc) => lc.slug === slug)?.name ?? slug;
}

export function lcRarity(slug: string): 3 | 4 | 5 {
  return LIGHT_CONES.find((lc) => lc.slug === slug)?.rarity ?? 5;
}

// Pinned to a specific commit so jsDelivr caches indefinitely (no @master freshness check).
const STAR_RAIL_RES = "7b349e39ee0f6f3bf814567995829b99c95e7a93";

export function lcIconUrl(slug: string): string {
  const lc = LIGHT_CONES.find((l) => l.slug === slug);
  if (lc?.iconUrl) return lc.iconUrl;
  if (/^\d+$/.test(slug)) {
    return `https://cdn.jsdelivr.net/gh/Mar-7th/StarRailRes@${STAR_RAIL_RES}/image/light_cone_portrait/${slug}.png`;
  }
  if (lc?.file) return `/icons/lc/${lc.file}`;
  return `/icons/lc/${slug}_card.webp`;
}
