
export interface IDDSILevel {
  level: number;
  name: string;
  color: string;
  type: 'drink' | 'food' | 'both';
  desc: string;
  testing: string;
  examples: string;
  handout: string;
  image: string;
}

export const IDDSI_LEVELS: IDDSILevel[] = [
  { 
    level: 0, 
    name: 'Thin', 
    color: 'bg-white border-slate-200 text-slate-900', 
    type: 'drink', 
    desc: 'Flows like water. Fast flow. Can be drunk through any teat/nipple, cup or straw as appropriate for age and skills.',
    testing: 'IDDSI Flow Test: <1ml remains in syringe after 10 seconds.',
    examples: 'Water, Tea, Coffee, Soda, Juice, Milk',
    handout: 'https://iddsi.org/framework/drink-levels/thin/',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=800'
  },
  { 
    level: 1, 
    name: 'Slightly Thick', 
    color: 'bg-slate-100 text-slate-900', 
    type: 'drink', 
    desc: 'Thicker than water. Requires a little more effort to drink than thin liquids. Flows through a straw, syringe, teat/nipple.',
    testing: 'IDDSI Flow Test: 1-4ml remains in syringe after 10 seconds.',
    examples: 'Anti-regurgitation formula, Pediatric special needs milk',
    handout: 'https://iddsi.org/framework/drink-levels/slightly-thick/',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=800'
  },
  { 
    level: 2, 
    name: 'Mildly Thick', 
    color: 'bg-pink-100 text-pink-900', 
    type: 'drink', 
    desc: 'Flows off a spoon. Sippable, pours quickly from a spoon, but slower than thin drinks. Mild effort to drink through standard straw.',
    testing: 'IDDSI Flow Test: 4-8ml remains in syringe after 10 seconds.',
    examples: 'Nectar-thick fluids, Cream soup (strained)',
    handout: 'https://iddsi.org/framework/drink-levels/mildly-thick/',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=800'
  },
  { 
    level: 3, 
    name: 'Moderately Thick / Liquidized', 
    color: 'bg-yellow-100 text-yellow-900', 
    type: 'both', 
    desc: 'Drips slowly in dollops through the prongs of a fork. No flow test required for Liquidized food.',
    testing: 'IDDSI Flow Test: >8ml remains in syringe after 10 seconds. Fork Drip Test: Drips slowly in dollops.',
    examples: 'Honey-thick fluids, Smooth yogurt, Pureed fruit (runny)',
    handout: 'https://iddsi.org/framework/food-levels/liquidised/',
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&q=80&w=800'
  },
  { 
    level: 4, 
    name: 'Extremely Thick / Pureed', 
    color: 'bg-green-100 text-green-900', 
    type: 'both', 
    desc: 'Holds shape on spoon. Falls off spoon in a single spoonful when tilted. No chewing required.',
    testing: 'Fork Pressure Test: Prongs make a clear pattern. Spoon Tilt Test: Slides off easily with little residue.',
    examples: 'Pudding, Mashed potato (smooth), Greek yogurt',
    handout: 'https://iddsi.org/framework/food-levels/pureed/',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=800'
  },
  { 
    level: 5, 
    name: 'Minced & Moist', 
    color: 'bg-orange-100 text-orange-900', 
    type: 'food', 
    desc: 'Soft & moist with no separate thin liquid. Small lumps visible within the food. Paediatric, 2mm lump size; Adult, 4mm lump size.',
    testing: 'Fork Pressure Test: Particles easily squashed. Particle size: 4mm (adult) / 2mm (pediatric).',
    examples: 'Minced meat (with sauce), Mashed fruit (lumpy)',
    handout: 'https://iddsi.org/framework/food-levels/minced-moist/',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800'
  },
  { 
    level: 6, 
    name: 'Soft & Bite-Sized', 
    color: 'bg-blue-100 text-blue-900', 
    type: 'food', 
    desc: 'Soft & moist with no separate thin liquid. Bite-sized pieces. Chewing is required. Adult, 15mm lump size.',
    testing: 'Fork Pressure Test: Pieces squash and do not return to original shape. Size: 15mm (adult) / 8mm (pediatric).',
    examples: 'Steamed veggies, Tender meat (cubed), Casseroles',
    handout: 'https://iddsi.org/framework/food-levels/soft-bite-sized/',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800'
  },
  { 
    level: 7, 
    name: 'Regular / Easy to Chew', 
    color: 'bg-slate-900 text-white', 
    type: 'food', 
    desc: 'Normal, everyday foods of various textures that are developmentally and age appropriate.',
    testing: 'No specific IDDSI testing required, but should be easy to chew and swallow safely.',
    examples: 'Regular texture foods, Bread, Steak, Raw veggies',
    handout: 'https://iddsi.org/framework/food-levels/regular/',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800'
  },
];

export const IDDSI_FAQ = [
  { q: "Why use the IDDSI Flow Test?", a: "It provides a standardized, objective measurement of liquid thickness using a 10mL syringe, reducing clinician variability." },
  { q: "What is the 'Spoon Tilt Test'?", a: "Used for Levels 4 and 5 to ensure the food is cohesive enough to hold its shape but moist enough to slide off the spoon easily." },
  { q: "Can I use a straw for Level 3?", a: "Level 3 can be drunk from a cup or a wide-bore straw, but requires significant effort through a standard straw." }
];

export const GOURMET_EXAMPLES = [
  {
    level: '4',
    name: 'Pureed / Extremely Thick',
    title: 'Gourmet Molded Puree: Roasted Vegetable Terrine',
    description: 'A vibrant, nutrient-dense terrine made from roasted carrots, bell peppers, and spinach, pureed to a smooth consistency and set with agar-agar in elegant molds.',
    tips: 'Use silicone molds for professional presentation. Enhance flavor with fresh herbs and high-quality olive oil.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'
  },
  {
    level: '5',
    name: 'Minced & Moist',
    title: 'Deconstructed Shepherd\'s Pie',
    description: 'Slow-cooked, tender minced lamb with finely diced carrots and peas, served with a smooth, velvety potato puree. All components are moist and easy to swallow.',
    tips: 'Ensure meat is minced to 4mm pieces. Use a rich gravy to keep the mixture moist and cohesive.',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=800'
  },
  {
    level: '6',
    name: 'Soft & Bite-Sized',
    title: 'Steamed White Fish with Lemon Butter',
    description: 'Flaky, tender white fish steamed to perfection, served with soft-cooked, bite-sized asparagus tips and a delicate lemon butter sauce.',
    tips: 'Fish should be easily flaked with a fork. Avoid fibrous vegetables; steam until very soft.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800'
  }
];

export function filterIDDSILevels(query: string): IDDSILevel[] {
  if (!query) return IDDSI_LEVELS;
  const lowerQuery = query.toLowerCase();
  return IDDSI_LEVELS.filter(lvl => 
    lvl.name.toLowerCase().includes(lowerQuery) ||
    lvl.desc.toLowerCase().includes(lowerQuery) ||
    lvl.level.toString().includes(lowerQuery)
  );
}
