import { v2 as cloudinary } from "cloudinary";
import { CLOUD_NAME, API_KEY, API_SECRET } from "$env/static/private";
// cloudinary config
cloudinary.config({
	cloud_name: CLOUD_NAME,
	api_key: API_KEY,
	api_secret: API_SECRET,
});

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const socialMediaAssets = {
			youtube: "a6f3f4c5def7be461ea840f7751bb1b6", // Replace with your actual asset ID
			facebook: "4f4454f3f1f8d09bde687699afc443e6", // Replace with your actual asset ID
			twitter: "e7d7fa4de65bc3a7ebbf9673188cd5bd", // Replace with your actual asset ID
			linkedin: "3e23b0500e384ab8459408b154074adb", // Replace with your actual asset ID
		};

    try {
        const socialMediaUrls = await Promise.all(
            Object.entries(socialMediaAssets).map(async ([platform, assetId]) => {
                const { secure_url } = await cloudinary.api.resource_by_asset_id(assetId);
                return [platform, secure_url];
            })
        );

        return {
            socialMedia: Object.fromEntries(socialMediaUrls)
        };
    } catch (error) {
        console.error('Error fetching social media icons:', error);
        throw error;
    }
}