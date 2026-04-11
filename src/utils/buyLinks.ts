/**
 * Configuration for Indian pharmacy platforms.
 */
export const PLATFORM_CONFIG: Record<string, { name: string; color: string; label: string; urlTemplate: (name: string) => string }> = {
  "1mg": {
    name: "Tata 1mg",
    color: "#E40000",
    label: "1mg",
    urlTemplate: (name: string) => `https://www.1mg.com/search/all?name=${name}`
  },
  "pharmeasy": {
    name: "PharmEasy",
    color: "#1A8A00",
    label: "PharmEasy",
    urlTemplate: (name: string) => `https://pharmeasy.in/search/all?name=${name}`
  },
  "netmeds": {
    name: "Netmeds",
    color: "#FF6B00",
    label: "Netmeds",
    urlTemplate: (name: string) => `https://www.netmeds.com/catalogsearch/result/${name}/all`
  },
  "apollo": {
    name: "Apollo Pharmacy",
    color: "#0057A8",
    label: "Apollo",
    urlTemplate: (name: string) => `https://www.apollopharmacy.in/search-medicines/${name}`
  }
};

/**
 * Generates purchase links for a medicine across specified platforms.
 * 
 * @param medicineName - The name of the medicine to search for.
 * @param platforms - An array of platform keys (e.g., ["1mg", "pharmeasy"]).
 * @returns An array of platform objects with their respective search URLs.
 */
export function generateBuyLinks(medicineName: string, platforms?: string[]) {
  const encodedName = encodeURIComponent(medicineName.trim().replace(/\s+/g, '+'));
  
  // Use all platforms as fallback if none specified or empty array provided
  const targetPlatforms = (platforms && platforms.length > 0) 
    ? platforms 
    : Object.keys(PLATFORM_CONFIG);

  return targetPlatforms
    .filter(key => PLATFORM_CONFIG[key]) // Ensure the platform key exists in our config
    .map(key => {
      const config = PLATFORM_CONFIG[key];
      return {
        key,
        name: config.name,
        color: config.color,
        label: config.label,
        url: config.urlTemplate(encodedName)
      };
    });
}
