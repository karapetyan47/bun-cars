const carTypes = [
  'Sedan',
  'SUV',
  'Crossover',
  'Hatchback',
  'Coupe',
  'Convertible',
  'Wagon',
  'Minivan',
  'Pickup Truck',
  'Sports Car',
  'Muscle Car',
  'Compact Car',
  'Luxury Car',
  'Electric Vehicle',
  'Hybrid',
];

export default async function seedCarTypes(prismaClient) {
  for (const type of carTypes) {
    await prismaClient.type.upsert({
      where: { name: type },
      update: {},
      create: { name: type },
    });
  }
}
