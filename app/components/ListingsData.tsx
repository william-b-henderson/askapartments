// This is a server component that fetches the listings data
import { promises as fs } from 'fs';
import path from 'path';

export async function getListings() {
  // Read the JSON file
  const filePath = path.join(process.cwd(), 'app/listings.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  
  // Parse and return the data
  return JSON.parse(fileContents);
} 