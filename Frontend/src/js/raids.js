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
    name: 'Omega+',
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
  50: {
    name: 'Tier 1 Summons',
    stars: 5,
    cost: 40,
    magfes: 20,
    times: 2,
    raids: {
      '300411/1/0/1313': {
          name: 'Twin Elem.',
          namejp: 'フラム',
          icon: 'whorlfire',
      },
      '300411/1/0/1111': {
          name: 'Twin Elem.',
          icon: 'reddragonscale',
      },
      '300381/1/0/1323': {
          name: 'Macula M.',
          namejp: 'マキュラ',
          icon: 'whorlwater',
      },
      '300381/1/0/1121': {
          name: 'Macula M.',
          icon: 'bluedragonscale',
      },
      '300391/1/0/1333': {
          name: 'Medusa',
          namejp: 'メドゥーサ',
          icon: 'whorlearth',
      },
      '300391/1/0/1131': {
          name: 'Medusa',
          icon: 'browndragonscale',
      },
      '300421/1/0/1343': {
          name: 'Nezha',
          namejp: 'ナタク',
          icon: 'whorlwind',
      },
      '300421/1/0/1141': {
          name: 'Nezha',
          icon: 'greendragonscale',
      },
      '300431/1/0/1353': {
          name: 'Apollo',
          namejp: 'アポロ',
          icon: 'whorllight',
      },
      '300431/1/0/1151': {
          name: 'Apollo',
          icon: 'whitedragonscale',
      },
      '300401/1/0/1363': {
          name: 'D.A.Olivia',
          namejp: 'オリヴィエ',
          icon: 'whorldark',
      },
      '300401/1/0/1161': {
          name: 'D.A.Olivia',
          icon: 'blackdragonscale',
      },
    }
  },
  60: {
    name: 'Tier 2 Summons',
    stars: 6,
    cost: 40,
    magfes: 20,
    times: 2,
    raids: {
      '301071/1/0/1313': {
          name: 'Athena',
          namejp: 'アテナ',
          icon: 'whorlfire',
      },
      '301071/1/0/1111': {
          name: 'Athena',
          icon: 'reddragonscale',
      },
      '300481/1/0/1323': {
          name: 'Grani',
          namejp: 'グラニ',
          icon: 'whorlwater',
      },
      '300481/1/0/1121': {
          name: 'Grani',
          icon: 'bluedragonscale',
      },
      '301371/1/0/1333': {
          name: 'Baal',
          namejp: 'バアル',
          icon: 'whorlearth',
      },
      '301371/1/0/1131': {
          name: 'Baal',
          icon: 'browndragonscale',
      },
      '301381/1/0/1343': {
          name: 'Garuda',
          namejp: 'ガルダ',
          icon: 'whorlwind',
      },
      '301381/1/0/1141': {
          name: 'Garuda',
          icon: 'greendragonscale',
      },
      '300461/1/0/1353': {
          name: 'Odin',
          namejp: 'オーディン',
          icon: 'whorllight',
      },
      '300461/1/0/1151': {
          name: 'Odin',
          icon: 'whitedragonscale',
      },
      '300551/1/0/1363': {
          name: 'Lich',
          namejp: 'リッチ',
          icon: 'whorldark',
      },
      '300551/1/0/1161': {
          name: 'Lich',
          icon: 'blackdragonscale',
      },
    }
  },
  70: {
    name: '',
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
  1020: {
    name: 'Tier 1 Summons',
    tier: 'impossible',
    stars: 2,
    cost: 50,
    magfes: 25,
    times: 1,
    raids: {
      '300501/1/0/41': {
        name: 'Twin Elements',
        namejp: 'フラムＨＬ'
      },
      '300521/1/0/42': {
        name: 'Macula Marius',
        namejp: 'マキュラＨＬ'
      },
      '300541/1/0/43': {
        name: 'Medusa',
        namejp: 'メドゥーサＨＬ'
      },
      '300451/1/0/44': {
        name: 'Nezha',
        namejp: 'ナタクＨＬ'
      },
      '300571/1/0/45': {
        name: 'Apollo',
        namejp: 'アポロＨＬ'
      },
      '300591/1/0/46': {
        name: 'D.A.Olivia',
        namejp: 'オリヴィエＨＬ'
      },
      '300471/1/0/1204': {
        name: 'Rose Queen',
        namejp: 'ＪＫ'
      },
    }
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
      '305371/1/0/46': {
        name: 'Osiris',
        namejp: 'オシリス'
      },
    }
  },
  1040: {
    name: 'Epic Summons',
    tier: 'impossible',
    stars: 4,
    cost: 50,
    magfes: 25,
    times: 1,
    raids: {
      '302751/1/0/41': {
        name: 'Prometheus',
        namejp: 'プロメテウス'
      },
      '303041/1/0/42': {
        name: 'Ca Ong',
        namejp: 'カーオン'
      },
      '302711/1/0/43': {
        name: 'Gilgamesh',
        namejp: 'ギルガメッシュ'
      },
      '303051/1/0/44': {
        name: 'Morrigna',
        namejp: 'バイヴカハ'
      },
      '303061/1/0/45': {
        name: 'Hector',
        namejp: 'ヘクトル'
      },
      '303071/1/0/46': {
        name: 'Anubis',
        namejp: 'アヌビス'
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
    }
  },
  1050: {
    name: '',
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
    name: '',
    tier: 'impossible',
    stars: 7,    
    times: 1,
    raids: {
      '301061/1/0/59': {
        name: 'Proto Bahamut',
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
    name: '',
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
  1090: {
    name: '',
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
  2600: {
    name: 'Miscellaneous',
    stars: 1,
    cost: 200,
    magfes: 100,
    times: 1,
    raids: {
      '305301/28': {
        name: 'Angel Halo Pro'
      },
    }
  }
};

export default {
  CAT_STANDARD,
  CAT_IMPOSSIBLE,
  CAT_SOLO
}