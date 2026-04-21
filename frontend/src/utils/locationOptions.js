export const fallbackStateDistrictMap = {
  Bihar: ["Purnia", "Muzaffarpur", "Bhagalpur", "Gaya"],
  Gujarat: ["Rajkot", "Surat", "Ahmedabad", "Vadodara"],
  Karnataka: ["Kolar", "Mysuru", "Belagavi", "Bengaluru Rural"],
  Maharashtra: ["Nashik", "Kolhapur", "Pune", "Nagpur"],
  Punjab: ["Ludhiana", "Amritsar", "Patiala", "Bathinda"],
  "Uttar Pradesh": ["Meerut", "Kanpur", "Varanasi", "Prayagraj"],
  "West Bengal": ["Hooghly", "Malda", "Murshidabad", "Howrah"]
};

export const fallbackLocationFilters = {
  states: Object.keys(fallbackStateDistrictMap).sort(),
  districts: [...new Set(Object.values(fallbackStateDistrictMap).flat())].sort(),
  categories: ["Cereal", "Vegetable", "Cash Crop", "Fiber", "Pulse"],
  seasons: ["Kharif", "Rabi", "Summer", "Annual", "Year-round"],
  stateDistrictMap: fallbackStateDistrictMap
};
