// Standard raids
const CAT_STANDARD = {
  20: {
    name: 'Normal',
    stars: 1,
    cost: 10,
    magfes: 0,
    times: 3,
    raids: {
      '300031/1': {
        name: 'Tiamat',
      },
      '300081/1': {
        name: 'Colossus',
      },
      '300141/1': {
        name: 'Leviathan',
      },
      '300181/1': {
        name: 'Yggdrasil',
      },
      '300211/1': {
        name: 'Luminiera',
      },
      '300241/1': {
        name: 'Celeste',
      },
    }
  },
  30: {
    name: 'Hard',
    stars: 3,
    cost: 15,
    magfes: 0,
    times: 3,
    raids: {
      '300041/1': {
        name: 'Tiamat',
      },
      '300091/1': {
        name: 'Colossus',
      },
      '300151/1': {
        name: 'Leviathan',
      },
      '300191/1': {
        name: 'Yggdrasil',
      },
      '300221/1': {
        name: 'Luminiera',
      },
      '300251/1': {
        name: 'Celeste',
      },
    }
  },
  31: {
    name: 'Hard +',
    stars: 3,
    cost: 45,
    magfes: 0,
    times: 1,
    raids: {
      '305011/1': {
        name: 'Tiamat',       
      },
      '305021/1': {
        name: 'Colossus',       
      },
      '305031/1': {
        name: 'Leviathan',       
      },
      '305041/1': {
        name: 'Yggdrasil',       
      },
      '305051/1': {
        name: 'Luminiera',       
      },
      '305061/1': {
        name: 'Celeste',       
      },
    },
  },
  32: {
    name: 'Hard + Pro',
    stars: 3,
    cost: 270,
    magfes: 0,
    times: 1,
    raids: {
      '305261/28': {
        name: 'All Hard +',       
      },
    },
  },
  40: {
    name: 'Omega',
    stars: 4,
    cost: 30,
    magfes: 15,
    times: 3,
    raids: {
      '300051/1/0/18': {
        name: 'Tiamat',
        namejp: 'ティアマグ'
      },
      '300101/1/0/19': {
        name: 'Colossus',
        namejp: 'コロマグ'
      },
      '300161/1/0/20': {
        name: 'Leviathan',
        namejp: 'リヴァマグ'
      },
      '300261/1/0/21': {
        name: 'Yggdrasil',
        namejp: 'ユグマグ'
      },
      '300271/1/0/26': {
        name: 'Luminiera',
        namejp: 'シュヴァマグ'
      },
      '300281/1/0/31': {
        name: 'Celeste',
        namejp: 'セレマグ'
      },
    }
  },
  41: {
    name: 'Omega +',
    stars: 4,
    cost: 90,
    magfes: 45,
    times: 1,
    raids: {
      '305081/1/0/18': {
        name: 'Tiamat',        
      },
      '305091/1/0/19': {
        name: 'Colossus',        
      },
      '305101/1/0/20': {
        name: 'Leviathan',
      },
      '305111/1/0/21': {
        name: 'Yggdrasil',        
      },
      '305121/1/0/26': {
        name: 'Luminiera',        
      },
      '305131/1/0/31': {
        name: 'Celeste',        
      },
    }
  },
  42: {
    name: 'Omega + Pro',
    stars: 4,
    cost: 540,
    magfes: 270,
    times: 1,
    raids: {
      '305441/28': {
        name: 'All Omega +',       
      },
    },
  },
  60: {
    name: 'Tier 2 Summons',
    stars: 6,
    cost: 40,
    magfes: 20,
    times: 2,
    raids: {
      '301071/1/0/47': {
          name: 'Athena',
          namejp: 'アテナ',
      },
      '300481/1/0/48': {
          name: 'Grani',
          namejp: 'グラニ',
      },
      '301371/1/0/49': {
          name: 'Baal',
          namejp: 'バアル',
      },
      '301381/1/0/32': {
          name: 'Garuda',
          namejp: 'ガルダ',
      },
      '300461/1/0/50': {
          name: 'Odin',
          namejp: 'オーディン',
      },
      '300551/1/0/51': {
          name: 'Lich',
          namejp: 'リッチ',
      },
    }
  },
  61: {
    name: 'Primal Legends Pro',
    stars: 5,
    cost: 480,
    magfes: 240,
    times: 1,
    raids: {
      '305471/28': {
        name: 'All Tier 2 Summons',       
      },
    },
  },
  70: {
    name: 'Nightmare',
    stars: 7,
    raids: {
      '300291/1/0/58': {
          name: 'Proto Bahamut',
          namejp: 'よわバハ',
          cost: 80,
          magfes: 40,
          times: 3,
      },
      '301051/1/0/82': {
          name: 'Grand Order',
          namejp: 'グランデ',
          cost: 80,
          magfes: 40,
          times: 2,
      },
      '301671/1/0/6005': {
          name: 'Huanglong',
          namejp: '黄龍',
          cost: 80,
          magfes: 80,
          times: 1,
      },
      '301681/1/0/6005': {
          name: 'Qilin',
          namejp: '黒麒麟',
          cost: 80,
          magfes: 80,
          times: 1,
      },
    }
  },
  80: {
    name: 'Primarchs',
    stars: 8,
    cost: 50,
    magfes: 25,
    times: 1,
    raids: {
      '303101/1/0/5311': {
        name: 'Michael',
        namejp: 'ミカエル',
      },
      '303091/1/0/5321': {
        name: 'Gabriel',
        namejp: 'ガブリエル',
      },
      '303111/1/0/5331': {
        name: 'Uriel',
        namejp: 'ウリエル',
      },
      '303081/1/0/5341': {
        name: 'Raphael',
        namejp: 'ラファエル',
      },
    }
  },
  90: {
    name: 'Ultimate',
    stars: 9,
    cost: 80,
    magfes: 40,
    times: 1,
    raids: {
      '303131/1/0/133': {
        name: 'Ultimate Bahamut',
        namejp: 'アルバハ'
      },
    },
  },
};

// Impossible raids
const CAT_IMPOSSIBLE = {
  1010: {
    name: 'Omega HL',
    tier: 'impossible',
    stars: 1,
    cost: 50,
    magfes: 25,
    times: 2,
    raids: {
      '300441/1/0/32': {
        name: 'Tiamat',
        namejp: 'ティアＨＬ'
      },
      '300491/1/0/47': {
        name: 'Colossus',
        namejp: 'コロＨＬ'
      },
      '300511/1/0/48': {
        name: 'Leviathan',
        namejp: 'リヴァＨＬ'
      },
      '300531/1/0/49': {
        name: 'Yggdrasil',
        namejp: 'ユグＨＬ'
      },
      '300561/1/0/50': {
        name: 'Luminiera',
        namejp: 'シュヴァＨＬ'
      },
      '300581/1/0/51': {
        name: 'Celeste',
        namejp: 'セレＨＬ'
      },
    }
  },
  1011: {
    name: 'Omega HL Pro',
    tier: 'impossible',
    stars: 1,
    cost: 600,
    magfes: 300,
    times: 1,
    raids: {
      '305461/28': {
        name: 'All Omega HL',       
      },
    },
  },
  1030: {
    name: 'Regalia',
    tier: 'impossible',
    stars: 3,
    cost: 60,
    magfes: 30,
    times: 2,
    raids: {
      '303151/1/0/522': {
        name: 'Shiva',
        namejp: 'シヴァ'
      },
      '303161/1/0/523': {
        name: 'Europa',
        namejp: 'エウロペ'
      },
      '303171/1/0/524': {
        name: 'Alexiel',
        namejp: 'ブローディア'
      },
      '303181/1/0/525': {
        name: 'Grimnir',
        namejp: 'グリームニル'
      },
      '303191/1/0/526': {
        name: 'Metatron',
        namejp: 'メタトロン'
      },
      '303221/1/0/527': {
        name: 'Avatar',
        namejp: 'アバタ'
      },
    }
  },
  1031: {
    name: 'Ennead',
    tier: 'impossible',
    stars: 3,
    cost: 60,
    magfes: 60,
    times: 2,
    raids: {
      '305321/1/0/41': {
        name: 'Atum',
        namejp: 'アトゥム'
      },
      '305331/1/0/42': {
        name: 'Tefnut',
        namejp: 'テフヌト'
      },
      '305341/1/0/43': {
        name: 'Bennu',
        namejp: 'ベンヌ'
      },
      '305351/1/0/44': {
        name: 'Ra',
        namejp: 'ラー'
      },
      '305361/1/0/45': {
        name: 'Horus',
        namejp: 'ホルス'
      },
      '305371/1/0/46': {
        name: 'Osiris',
        namejp: 'オシリス'
      },
    }
  },
  1041: {
    name: 'Malice',
    tier: 'impossible',
    stars: 5,
    cost: 80,
    magfes: 40,
    times: 1,
    raids: {
      '303241/1/0/104': {
        name: 'Tiamat Malice',
        namejp: 'ティアマト・マリス',
        icon: 'galbinuscentrum',
      },
      '303241/1/0/106': {
        name: 'Tiamat Malice',
        icon: 'atercentrum',
      },
      '305151/1/0/101': {
        name: 'Leviathan Malice',
        namejp: 'リヴァイアサン・マリス',
        icon: 'rubeuscentrum',
      },
      '305151/1/0/102': {
        name: 'Leviathan Malice',
        icon: 'indicuscentrum',
      },
      '305271/1/0/105': {
        name: 'Luminiera Malice',
        namejp: 'シュヴァ・マリス',
        icon: 'niveuscentrum',
      },
      '305271/1/0/102': {
        name: 'Luminiera Malice',
        icon: 'indicuscentrum',
      },
      '305291/1/0/106': {
        name: 'Anima-Animus Core',
        namejp: 'アニマ・アニムス・コア',
        icon: 'atercentrum',
      },
      '305291/1/0/103': {
        name: 'Anima-Animus Core',
        icon: 'luteuscentrum',
      },
      '305251/1/0/103': {
        name: 'Phronesis',
        namejp: 'フロネシス',
        icon: 'luteuscentrum',
      },
      '305251/1/0/102': {
        name: 'Phronesis',
        icon: 'indicuscentrum',
      },
      '305481/1/0/101': {
        name: 'Legion Void',
        namejp: 'レギオン・ヴォイド',
        icon: 'rubeuscentrum',
      },
      '305481/1/0/104': {
        name: 'Legion Void',
        icon: 'galbinuscentrum',
      },
    }
  },
  1050: {
    name: '6 Stars',
    tier: 'impossible',
    stars: 6,
    raids: {
      '303231/1/0/6005': {
        name: 'Huanglong & Qilin',
        namejp: '黄龍・黒麒麟ＨＬ',
        cost: 80,
        magfes: 80,
        times: 1,
      },
      '303271/1/0/506': {
        name: 'Lucilius',
        namejp: 'ルシファー',
        cost: 80,
        magfes: 40,
        times: 1,
      },
      '303291/1/0/5311': {
        name: 'The Four Primarchs',
        namejp: '四大天司ＨＬ',
        cost: 80,
        magfes: 40,
        times: 1,
      },
      '305171/1/0/535': {
        name: 'Lindwurm',
        namejp: 'リンドヴルム',
        cost: 80,
        magfes: 40,
        times: 2
      }
    }
  },
  1060: {
    name: 'Six-Dragons',
    tier: 'impossible',
    stars: 7,    
    cost: 50,
    magfes: 25,
    times: 1,
    raids: {
      '305191/1/0/41': {
        name: 'Wilnas (Fire)',
        namejp: '火竜',
      },
      '305201/1/0/42': {
        name: 'Wamdus (Water)',
        namejp: '水竜',
      },
      '305211/1/0/43': {
        name: 'Galleon (Earth)',
        namejp: '土竜',
      },
      '305221/1/0/44': {
        name: 'Ewiyar (Wind)',
        namejp: '風竜',
      },
      '305231/1/0/45': {
        name: 'Lu Woh (Light)',
        namejp: '光竜',
      },
      '305241/1/0/46': {
        name: 'Fediel (Dark)',
        namejp: '闇竜',
      },
    }
  },
  1070: {
    name: 'Nightmare',
    tier: 'impossible',
    stars: 7,    
    times: 1,
    raids: {
      '301061/1/0/59': {
        name: 'Proto Bahamut (Hard)',
        namejp: '強いバハ',
        cost: 90,
        magfes: 45,
      },
      '303251/1/0/533': {
        name: 'Akasha',
        namejp: 'アーカーシャ',
        cost: 90,
        magfes: 45,
      },
      '305161/1/0/83': {
        name: 'Grand Order',
        namejp: 'グランデＨＬ',
        cost: 90,
        magfes: 45,
      },
      '303141/1/0/136': {
        name: 'Ultimate Bahamut',
        namejp: 'アルバハＨＬ',
        cost: 100,
        magfes: 50,
      },
    }
  },
  1080: {
    name: 'Astral',
    tier: 'impossible',
    stars: 9,
    cost: 100,
    magfes: 50,
    times: 1,
    raids: {
      '303281/1/0/537': {
        name: 'Lucilius (Hard)',
        namejp: 'ルシファーＨＬ',
      },
      '305181/1/0/533': {
        name: 'Beelzebub',
        namejp: 'ベルゼバブ',
      },
      '305281/1/0/533': {
        name: 'Belial',
        namejp: 'ベリアル',
      },
    }
  },
  1085: {
    name: 'Automagod',
    tier: 'impossible',
    stars: 10,
    cost: 100,
    magfes: 50,
    times: 1,
    raids: {
      '305381/1/0/549': {
        name: 'Mugen',
        namejp: 'ムゲン',
      },
      '305391/1/0/550': {
        name: 'Diaspora',
        namejp: 'ディアスポラ',
      },
      '305401/1/0/551': {
        name: 'Siegfried',
        namejp: 'ジークフリート',
      },
      '305411/1/0/552': {
        name: 'Seofon',
        namejp: 'シエテ',
      },
      '305421/1/0/553': {
        name: 'Cosmos',
        namejp: '',
      },
      '305431/1/0/554': {
        name: 'Agastia',
        namejp: 'アガスティア',
      },
    }
  },
  1090: {
    name: 'Super Ultimate',
    tier: 'impossible',
    stars: 10,
    cost: 100,
    magfes: 50,
    times: 1,
    raids: {
      '305311/1/0/138': {
        name: 'Rage of Super Ultimate Bahamut',
        namejp: 'スーパーアルティメットバハムート',
      },
      '305491/1/0/549': {
        name: 'Hexachromatic Hierarch',
        namejp: '天元たる六色の理',
      }
    }
  },
};

// Solo Content
const CAT_SOLO = {
  2500: {
    name: 'Six-Dragon Advent',
    stars: 1,
    cost: 80,
    magfes: 40,
    times: 2,
    raids: {
      '103441/3': {
        name: 'Vermillion'
      },
      '103471/3': {
        name: 'Emerald',
      },
      '103451/3': {
        name: 'Azure',
      },
      '103461/3': {
        name: 'Gold',
      },
      '103481/3': {
        name: 'White',
      },
      '103491/3': {
        name: 'Black',
      },
    }
  },
  2550: {
    name: 'Tier 1 Showdowns',
    stars: 2,
    times: 1,
    cost: 50,
    magfes: 25,
    raids: {
      '103791/3': {
          name: 'Twin Elem.',
          namejp: 'フラム',
      },
      '103801/3': {
          name: 'Macula M.',
          namejp: 'マキュラ',
      },
      '103811/3': {
          name: 'Medusa',
          namejp: 'メドゥーサ',
      },
      '103821/3': {
          name: 'Nezha',
          namejp: 'ナタク',
      },
      '103831/3': {
          name: 'Apollo',
          namejp: 'アポロ',
      },
      '103841/3': {
          name: 'D.A.Olivia',
          namejp: 'オリヴィエ',
      },
    }
  },
  2570: {
    name: 'Epic Showdowns',
    stars: 3,
    cost: 50,
    magfes: 25,
    times: 1,
    raids: {
      '103851/3': {
        name: 'Prometheus',
        namejp: 'プロメテウス'
      },
      '103861/3': {
        name: 'Ca Ong',
        namejp: 'カーオン'
      },
      '103871/3': {
        name: 'Gilgamesh',
        namejp: 'ギルガメッシュ'
      },
      '103881/3': {
        name: 'Morrigna',
        namejp: 'バイヴカハ'
      },
      '103891/3': {
        name: 'Hector',
        namejp: 'ヘクトル'
      },
      '103901/3': {
        name: 'Anubis',
        namejp: 'アヌビス'
      },
    }
  },
  2600: {
    name: 'Miscellaneous',
    stars: 1,
    times: 1,
    raids: {
      '305301/28': {
        name: 'Angel Halo Pro',
        cost: 200,
        magfes: 100,
      },
      '103951/28': {
        name: 'Showdown Pro',
        cost: 300,
        magfes: 150,
      },
      '103991/28': {
        name: 'Clash Pro',
        cost: 600,
        magfes: 300,
      }
    }
  }
};

// Solo Content
const CAT_COOP = {
  3000: {
    name: 'Tier 5',
    stars: 1,
    cost: 0,
    magfes: 0,
    times: 1,
    raids: {
      '1': {
        name: 'EX 5-3',
        namejp: '死翼の刻 （ＥＸ５－３）',
      },
      '2': {
        name: 'EX 5-4',
        namejp: '災揮と絶斧の刻 （ＥＸ５－４）',
      },
    }
  },
  3100: {
    name: 'Final Tier',
    stars: 1,
    cost: 0,
    magfes: 0,
    times: 1,
    raids: {
      '1': {
        name: 'EX 6-1',
        namejp: '黒紫獣の刻 （ＥＸ６－１）',
      },
      '2': {
        name: 'EX 6-2',
        namejp: '終焉の刻 （ＥＸ６－２）',
      },
    }
  }
};

export default {
  CAT_STANDARD,
  CAT_IMPOSSIBLE,
  CAT_SOLO,
  CAT_COOP
}