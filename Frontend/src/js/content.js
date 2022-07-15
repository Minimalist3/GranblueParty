import Raids from '@/js/raids'

function filterContent(content) {
  return Object.values(content).flatMap(cat => {
    const content = Object.entries(cat.raids).flatMap(raid => {
      if (raid[1].namejp) {
        return {
          id: raid[0].split('/')[0],
          name: raid[1].name
        }
      }
      return [];            
    });

    if (content.length > 0) {
      return {
        name: cat.name,
        content: content
      };
    }
    return [];        
  });
}

export default [
  {
    name: 'Miscellaneous',
    content: [
      { name: 'Uncategorized', id: null, private: true },
      //{ name: 'Full Auto', id: 1 },
      { name: 'Campaign-Exclusive Quest', id: 50 },
    ]
  },
  {
    name: 'Unite and Fight',
    content: [
      { name: 'Extreme+', id: 101 },
      { name: 'NM 90', id: 102 },
      { name: 'NM 95', id: 103 },
      { name: 'NM 100', id: 104 },
      { name: 'NM 150', id: 105 },
      { name: 'NM 200', id: 106 },
    ]
  },
  {
    name: 'Pride of the Ascendant',
    content: [
      { name: 'Echidna', id: 121 },
      { name: 'Gilbert', id: 122 },
      { name: 'Golden Knight', id: 123 },
      { name: 'Nalhe Great Wall', id: 124 },
      { name: 'Violet Knight', id: 125 },
      { name: 'White Knight', id: 126 },
      { name: 'Cherub', id: 127 },
    ]
  },
  {
    name: 'Co-op',
    content: [
      { name: 'Ex 5-3: Throes of Wings', id: 151 },
      { name: 'Ex 5-4: Throes of Calamity', id: 152 },
      { name: 'Ex 6-1: Throes of Dark Steel', id: 153 },
      { name: 'Ex 6-2: Throes of Death', id: 154 },
    ]
  },
  {
    name: 'Replicard Sandbox',
    content: [
      { name: 'Zone Eletio', id: 201 },
      { name: 'Zone Faym', id: 202 },
      { name: 'Zone Goliath', id: 203 },
      { name: 'Zone Harbinger', id: 204 },
      { name: 'Zone Invidia', id: 205 },
      { name: 'Zone Joculator', id: 206 },
      { name: 'Zone Kalendae', id: 207 },
      { name: 'Zone Liber', id: 208 },
    ]
  },
  ... filterContent(Raids.CAT_STANDARD),
  ... filterContent(Raids.CAT_IMPOSSIBLE),
];