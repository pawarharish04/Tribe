import prisma from './prisma';

export const findUsersWithinRadius = async (lat: number, lng: number, radiusMs: number, currentUserId: string) => {
    // Using PostGIS to find users within radius (in meters)
    // Assumes users have valid latitude and longitude
    // Exclude current user

    // Note: For PostGIS, ST_DWithin is efficient if indexed.
    const users = await prisma.$queryRaw`
    SELECT id, username, latitude, longitude
    FROM "User"
    WHERE id != ${currentUserId}
      AND latitude IS NOT NULL 
      AND longitude IS NOT NULL
      AND ST_DWithin(
        ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
        ${radiusMs}
      )
  `;

    return users as { id: string; username: string; latitude: number; longitude: number; distance?: number }[];
};
