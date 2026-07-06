export type Element = "Fire" | "Ice" | "Wind" | "Lightning" | "Quantum" | "Imaginary" | "Physical";
export type Path = "The Hunt" | "Destruction" | "Erudition" | "Harmony" | "Nihility" | "Preservation" | "Abundance" | "Remembrance" | "Elation";

export interface Character {
  slug: string;
  name: string;
  element: Element;
  path: Path;
}

export const ELEMENTS: Element[] = ["Fire", "Ice", "Wind", "Lightning", "Quantum", "Imaginary", "Physical"];
export const PATHS: Path[] = ["The Hunt", "Destruction", "Erudition", "Harmony", "Nihility", "Preservation", "Abundance", "Remembrance", "Elation"];

export const ELEMENT_COLOR: Record<Element, string> = {
  Fire:       "#ff7043",
  Ice:        "#63d4f5",
  Wind:       "#5ecb8a",
  Lightning:  "#c97ef7",
  Quantum:    "#7b7ef5",
  Imaginary:  "#f5d657",
  Physical:   "#c0c0cc",
};

export const PATH_COLOR: Record<Path, string> = {
  "The Hunt":    "#f5a623",
  Destruction:   "#e05252",
  Erudition:     "#5ba8f5",
  Harmony:       "#d47de8",
  Nihility:      "#7b8cad",
  Preservation:  "#4fc38a",
  Abundance:     "#52c4a8",
  Remembrance:   "#a78bfa",
  Elation:       "#f472b6",
};

export const CHARACTERS: Character[] = [
  // A
  { slug: "acheron",                    name: "Acheron",                    element: "Lightning", path: "Nihility"     },
  { slug: "aglaea",                     name: "Aglaea",                     element: "Lightning", path: "Remembrance"  },
  { slug: "anaxa",                      name: "Anaxa",                      element: "Wind",      path: "Erudition"    },
  { slug: "archer",                     name: "Archer",                     element: "Quantum",   path: "The Hunt"     },
  { slug: "argenti",                    name: "Argenti",                    element: "Physical",  path: "Erudition"    },
  { slug: "arlan",                      name: "Arlan",                      element: "Lightning", path: "Destruction"  },
  { slug: "ashveil",                    name: "Ashveil",                    element: "Lightning", path: "The Hunt"     },
  { slug: "asta",                       name: "Asta",                       element: "Fire",      path: "Harmony"      },
  { slug: "aventurine",                 name: "Aventurine",                 element: "Imaginary", path: "Preservation" },
  { slug: "aventurine-waveflair",       name: "Aventurine (Waveflair)",     element: "Quantum",   path: "Elation"      },
  // B
  { slug: "bailu",                      name: "Bailu",                      element: "Lightning", path: "Abundance"    },
  { slug: "black-swan",                 name: "Black Swan",                 element: "Wind",      path: "Nihility"     },
  { slug: "blade",                      name: "Blade",                      element: "Wind",      path: "Destruction"  },
  { slug: "blade-mortenax",             name: "Blade · Mortenax",           element: "Fire",      path: "Nihility"     },
  { slug: "boothill",                   name: "Boothill",                   element: "Fire",      path: "The Hunt"     },
  { slug: "bronya",                     name: "Bronya",                     element: "Wind",      path: "Harmony"      },
  // C
  { slug: "castorice",                  name: "Castorice",                  element: "Quantum",   path: "Remembrance"  },
  { slug: "cerydra",                    name: "Cerydra",                    element: "Wind",      path: "Harmony"      },
  { slug: "cipher",                     name: "Cipher",                     element: "Quantum",   path: "Nihility"     },
  { slug: "clara",                      name: "Clara",                      element: "Physical",  path: "Destruction"  },
  { slug: "cyrene",                     name: "Cyrene",                     element: "Ice",       path: "Remembrance"  },
  // D
  { slug: "dan-heng",                   name: "Dan Heng",                   element: "Wind",      path: "The Hunt"     },
  { slug: "dan-heng-imbibitor-lunae",   name: "Dan Heng: Imbibitor Lunae",  element: "Imaginary", path: "Destruction"  },
  { slug: "dan-heng-permansor-terrae",  name: "Dan Heng: Permansor Terrae", element: "Physical",  path: "Preservation" },
  { slug: "dr-ratio",                   name: "Dr. Ratio",                  element: "Imaginary", path: "The Hunt"     },
  // E
  { slug: "evanescia",                  name: "Evanescia",                  element: "Physical",  path: "Elation"      },
  // F
  { slug: "feixiao",                    name: "Feixiao",                    element: "Wind",      path: "The Hunt"     },
  { slug: "firefly",                    name: "Firefly",                    element: "Fire",      path: "Destruction"  },
  { slug: "fu-xuan",                    name: "Fu Xuan",                    element: "Quantum",   path: "Preservation" },
  // G
  { slug: "gallagher",                  name: "Gallagher",                  element: "Fire",      path: "Abundance"    },
  { slug: "gepard",                     name: "Gepard",                     element: "Ice",       path: "Preservation" },
  { slug: "gilgamesh",                  name: "Gilgamesh",                  element: "Lightning", path: "Destruction"  },
  { slug: "guinaifen",                  name: "Guinaifen",                  element: "Fire",      path: "Nihility"     },
  // H
  { slug: "hanya",                      name: "Hanya",                      element: "Physical",  path: "The Hunt"     },
  { slug: "herta",                      name: "Herta",                      element: "Ice",       path: "Erudition"    },
  { slug: "himeko",                     name: "Himeko",                     element: "Fire",      path: "Erudition"    },
  { slug: "himeko-nova",                name: "Himeko · Nova",              element: "Fire",      path: "Erudition"    },
  { slug: "hook",                       name: "Hook",                       element: "Fire",      path: "Destruction"  },
  { slug: "huohuo",                     name: "Huohuo",                     element: "Wind",      path: "Abundance"    },
  { slug: "hyacine",                    name: "Hyacine",                    element: "Wind",      path: "Remembrance"  },
  { slug: "hysilens",                   name: "Hysilens",                   element: "Physical",  path: "Nihility"  },
  // J
  { slug: "jade",                       name: "Jade",                       element: "Quantum",   path: "Erudition"    },
  { slug: "jiaoqiu",                    name: "Jiaoqiu",                    element: "Fire",      path: "Nihility"     },
  { slug: "jing-yuan",                  name: "Jing Yuan",                  element: "Lightning", path: "Erudition"    },
  { slug: "jingliu",                    name: "Jingliu",                    element: "Ice",       path: "Destruction"  },
  // K
  { slug: "kafka",                      name: "Kafka",                      element: "Lightning", path: "Nihility"     },
  // L
  { slug: "lingsha",                    name: "Lingsha",                    element: "Wind",      path: "Abundance"    },
  { slug: "luka",                       name: "Luka",                       element: "Physical",  path: "Nihility"     },
  { slug: "luocha",                     name: "Luocha",                     element: "Imaginary", path: "Abundance"    },
  { slug: "lynx",                       name: "Lynx",                       element: "Quantum",   path: "Abundance"    },
  // M
  { slug: "march-7th",                  name: "March 7th",                  element: "Ice",       path: "Preservation" },
  { slug: "march-7th-the-hunt",         name: "March 7th (The Hunt)",       element: "Imaginary", path: "The Hunt"     },
  { slug: "march-7th-evernight",        name: "March 7th · Evernight",      element: "Ice",       path: "Remembrance"  },
  { slug: "misha",                      name: "Misha",                      element: "Ice",       path: "Destruction"  },
  { slug: "moze",                       name: "Moze",                       element: "Lightning", path: "The Hunt"     },
  { slug: "mydei",                      name: "Mydei",                      element: "Fire",      path: "Destruction"  },
  // N
  { slug: "natasha",                    name: "Natasha",                    element: "Physical",  path: "Abundance"    },
  // P
  { slug: "pela",                       name: "Pela",                       element: "Ice",       path: "Nihility"     },
  { slug: "phainon",                    name: "Phainon",                    element: "Physical",  path: "Destruction"  },
  // Q
  { slug: "qingque",                    name: "Qingque",                    element: "Quantum",   path: "Erudition"    },
  // R
  { slug: "rappa",                      name: "Rappa",                      element: "Imaginary", path: "Erudition"    },
  { slug: "rin-tohsaka",                name: "Rin Tohsaka",                element: "Quantum",   path: "Erudition"    },
  { slug: "robin",                      name: "Robin",                      element: "Physical",  path: "Harmony"      },
  { slug: "robin-summeretto",           name: "Robin (Summeretto)",         element: "Wind",      path: "Remembrance"  },
  { slug: "ruan-mei",                   name: "Ruan Mei",                   element: "Ice",       path: "Harmony"      },
  // S
  { slug: "saber",                      name: "Saber",                      element: "Wind",      path: "Destruction"  },
  { slug: "sampo",                      name: "Sampo",                      element: "Wind",      path: "Nihility"     },
  { slug: "seele",                      name: "Seele",                      element: "Quantum",   path: "The Hunt"     },
  { slug: "serval",                     name: "Serval",                     element: "Lightning", path: "Erudition"    },
  { slug: "silver-wolf",                name: "Silver Wolf",                element: "Quantum",   path: "Nihility"     },
  { slug: "silver-wolf-lv-999",         name: "Silver Wolf (Lv.999)",       element: "Imaginary", path: "Elation"      },
  { slug: "sparkle",                    name: "Sparkle",                    element: "Quantum",   path: "Harmony"      },
  { slug: "sparxie",                    name: "Sparxie",                    element: "Fire",      path: "Elation"      },
  { slug: "sunday",                     name: "Sunday",                     element: "Imaginary", path: "Harmony"      },
  { slug: "sushang",                    name: "Sushang",                    element: "Physical",  path: "The Hunt"     },
  // T
  { slug: "the-dahlia",                 name: "The Dahlia",                 element: "Fire",      path: "Nihility"     },
  { slug: "the-herta",                  name: "The Herta",                  element: "Ice",       path: "Erudition"    },
  { slug: "tingyun",                    name: "Tingyun",                    element: "Lightning", path: "Harmony"      },
  { slug: "tingyun-fugue",              name: "Tingyun (Fugue)",            element: "Fire",      path: "Nihility"     },
  { slug: "topaz",                      name: "Topaz",                      element: "Fire",      path: "The Hunt"     },
  { slug: "trailblazer-destruction",    name: "Trailblazer: Destruction",   element: "Fire",      path: "Destruction"  },
  { slug: "trailblazer-elation",        name: "Trailblazer: Elation",       element: "Lightning", path: "Elation"      },
  { slug: "trailblazer-harmony",        name: "Trailblazer: Harmony",       element: "Imaginary", path: "Harmony"      },
  { slug: "trailblazer-remembrance",    name: "Trailblazer: Remembrance",   element: "Ice",       path: "Remembrance"  },
  { slug: "tribbie",                    name: "Tribbie",                    element: "Quantum",   path: "Harmony"      },
  // W
  { slug: "welt",                       name: "Welt",                       element: "Imaginary", path: "Nihility"     },
  // X
  { slug: "xueyi",                      name: "Xueyi",                      element: "Quantum",   path: "Destruction"  },
  // Y
  { slug: "yanqing",                    name: "Yanqing",                    element: "Ice",       path: "The Hunt"     },
  { slug: "yao-guang",                  name: "Yao Guang",                  element: "Ice",       path: "Elation"      },
  { slug: "yukong",                     name: "Yukong",                     element: "Imaginary", path: "Harmony"      },
  { slug: "yunli",                      name: "Yunli",                      element: "Physical",  path: "Destruction"  },
];

export function slugToName(slug: string): string {
  return CHARACTERS.find((c) => c.slug === slug)?.name ?? slug;
}

const FOUR_STAR_SLUGS = new Set([
  "arlan", "asta", "dan-heng", "gallagher", "guinaifen", "hanya", "herta",
  "hook", "luka", "lynx", "march-7th", "march-7th-the-hunt", "misha", "moze",
  "natasha", "pela", "qingque", "sampo", "serval", "sushang", "tingyun",
  "xueyi", "yukong",
]);

export function charRarity(slug: string): 4 | 5 {
  return FOUR_STAR_SLUGS.has(slug) ? 4 : 5;
}

export function iconUrl(slug: string): string {
  return `/icons/characters/${slug}_card.webp`;
}

const CDN = "https://cdn.jsdelivr.net/gh/Mar-7th/StarRailRes@7b349e39ee0f6f3bf814567995829b99c95e7a93";

const CHAR_CDN_ID: Record<string, number> = {
  "aglaea":                    1402,
  "anaxa":                     1405,
  "archer":                    1015,
  "argenti":                   1302,
  "arlan":                     1008,
  "ashveil":                   1504,
  "asta":                      1009,
  "aventurine":                1304,
  "bailu":                     1211,
  "black-swan":                1307,
  "blade":                     1205,
  "blade-mortenax":            1507,
  "boothill":                  1315,
  "bronya":                    1101,
  "castorice":                 1407,
  "cerydra":                   1412,
  "cipher":                    1406,
  "clara":                     1107,
  "cyrene":                    1415,
  "dan-heng":                  1002,
  "dan-heng-imbibitor-lunae":  1213,
  "dan-heng-permansor-terrae": 1414,
  "dr-ratio":                  1305,
  "evanescia":                 1505,
  "feixiao":                   1220,
  "firefly":                   1310,
  "fu-xuan":                   1208,
  "gallagher":                 1301,
  "gepard":                    1104,
  "guinaifen":                 1210,
  "hanya":                     1215,
  "herta":                     1013,
  "himeko":                    1003,
  "hook":                      1109,
  "huohuo":                    1217,
  "hyacine":                   1409,
  "hysilens":                  1410,
  "jade":                      1314,
  "jiaoqiu":                   1218,
  "jing-yuan":                 1204,
  "jingliu":                   1212,
  "kafka":                     1005,
  "lingsha":                   1222,
  "luka":                      1111,
  "luocha":                    1203,
  "lynx":                      1110,
  "march-7th":                 1001,
  "march-7th-the-hunt":        1224,
  "march-7th-evernight":       1413,
  "misha":                     1312,
  "moze":                      1223,
  "mydei":                     1404,
  "natasha":                   1105,
  "pela":                      1106,
  "phainon":                   1408,
  "qingque":                   1201,
  "rappa":                     1317,
  "robin":                     1309,
  "ruan-mei":                  1303,
  "saber":                     1014,
  "sampo":                     1108,
  "seele":                     1102,
  "serval":                    1103,
  "silver-wolf":               1006,
  "silver-wolf-lv-999":        1506,
  "sparkle":                   1306,
  "sparxie":                   1501,
  "sunday":                    1313,
  "sushang":                   1206,
  "the-dahlia":                1321,
  "the-herta":                 1401,
  "tingyun":                   1202,
  "tingyun-fugue":             1225,
  "topaz":                     1112,
  "tribbie":                   1403,
  "welt":                      1004,
  "xueyi":                     1214,
  "yanqing":                   1209,
  "yao-guang":                 1502,
  "yukong":                    1207,
  "yunli":                     1221,
};

export function portraitUrl(slug: string): string {
  const id = CHAR_CDN_ID[slug];
  if (id) return `${CDN}/image/character_portrait/${id}.png`;
  return iconUrl(slug);
}

export function elementIconUrl(element: Element): string {
  return `/icons/element/Type_${element}.webp`;
}

export function pathIconUrl(path: Path): string {
  return `/icons/path/Path_${path.replace(/ /g, "_")}.webp`;
}
