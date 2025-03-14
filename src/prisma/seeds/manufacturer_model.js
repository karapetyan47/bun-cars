const manufacturer_models = [
  {
    name: 'Toyota',
    models: [
      'Camry',
      'Corolla',
      'RAV4',
      'Highlander',
      'Tacoma',
      'Prius',
      'Sienna',
      '4Runner',
      'Avalon',
      'Land Cruiser',
    ],
  },
  {
    name: 'Honda',
    models: [
      'Civic',
      'Accord',
      'CR-V',
      'Pilot',
      'Odyssey',
      'Fit',
      'HR-V',
      'Ridgeline',
      'Passport',
      'Insight',
    ],
  },
  {
    name: 'Ford',
    models: [
      'F-150',
      'Mustang',
      'Explorer',
      'Escape',
      'Edge',
      'Bronco',
      'Ranger',
      'Expedition',
      'Maverick',
      'Mach-E',
    ],
  },
  {
    name: 'Chevrolet',
    models: [
      'Silverado',
      'Equinox',
      'Malibu',
      'Tahoe',
      'Camaro',
      'Suburban',
      'Traverse',
      'Colorado',
      'Blazer',
      'Corvette',
    ],
  },
  {
    name: 'BMW',
    models: [
      '3 Series',
      '5 Series',
      'X3',
      'X5',
      '7 Series',
      'X1',
      'X7',
      '4 Series',
      '8 Series',
      'i4',
    ],
  },
  {
    name: 'Mercedes-Benz',
    models: [
      'C-Class',
      'E-Class',
      'S-Class',
      'GLC',
      'GLE',
      'A-Class',
      'GLA',
      'GLB',
      'GLS',
      'EQS',
    ],
  },
  {
    name: 'Audi',
    models: ['A4', 'A6', 'Q5', 'Q7', 'A3', 'e-tron', 'Q3', 'A5', 'Q8', 'TT'],
  },
  {
    name: 'Volkswagen',
    models: [
      'Golf',
      'Jetta',
      'Tiguan',
      'Atlas',
      'Passat',
      'ID.4',
      'Taos',
      'Arteon',
      'Atlas Cross Sport',
      'GTI',
    ],
  },
  {
    name: 'Hyundai',
    models: [
      'Elantra',
      'Sonata',
      'Santa Fe',
      'Tucson',
      'Kona',
      'Palisade',
      'Venue',
      'Ioniq',
      'Accent',
      'Nexo',
    ],
  },
  {
    name: 'Kia',
    models: [
      'Sportage',
      'Sorento',
      'Telluride',
      'Forte',
      'K5',
      'Soul',
      'Seltos',
      'Carnival',
      'Niro',
      'EV6',
    ],
  },
  {
    name: 'Nissan',
    models: [
      'Altima',
      'Rogue',
      'Sentra',
      'Pathfinder',
      'Murano',
      'Kicks',
      'Armada',
      'Frontier',
      'Maxima',
      'Leaf',
    ],
  },
  {
    name: 'Subaru',
    models: [
      'Outback',
      'Forester',
      'Crosstrek',
      'Impreza',
      'Ascent',
      'Legacy',
      'WRX',
      'BRZ',
      'Solterra',
    ],
  },
  {
    name: 'Mazda',
    models: [
      'CX-5',
      'Mazda3',
      'CX-9',
      'CX-30',
      'MX-5 Miata',
      'Mazda6',
      'CX-50',
      'MX-30',
    ],
  },
  {
    name: 'Lexus',
    models: ['RX', 'ES', 'NX', 'GX', 'IS', 'UX', 'LX', 'LS', 'LC', 'RC'],
  },
  {
    name: 'Jeep',
    models: [
      'Wrangler',
      'Grand Cherokee',
      'Cherokee',
      'Compass',
      'Renegade',
      'Gladiator',
      'Wagoneer',
      'Grand Wagoneer',
    ],
  },
];

export default async function seedManufacturerModel(prismaClient) {
  for (const manufacturer of manufacturer_models) {
    const manufacturerRecord = await prismaClient.manufacturer.upsert({
      where: { name: manufacturer.name },
      update: { name: manufacturer.name },
      create: { name: manufacturer.name },
    });

    for (const model of manufacturer.models) {
      await prismaClient.model.upsert({
        where: {
          manufacturerId_name: {
            manufacturerId: manufacturerRecord.id,
            name: model,
          },
        },
        update: {},
        create: { name: model, manufacturerId: manufacturerRecord.id },
      });
    }
  }
}
