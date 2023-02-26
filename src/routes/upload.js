import { writeFileSync } from 'fs';
import { v2 as cloudinary } from 'cloudinary';
// cloudinary config

cloudinary.config({
	cloud_name: 'dshtbs5hm',
	api_key: '276433938214212',
	api_secret: 'qTBUdYf6JKGjC4K0yIOR78M0-rI',
});

export async function post({ request }) {
	const data = JSON.parse((await request.body.read()).toString());
	const file = data['image'];
	let res = await	cloudinary.uploader.upload(file, {
			folder: "avatar/",
			width: 100,
			height: 100,
			quality: 100,
			crop: "fill",
		}
	);
	return {
		statusCode: 200,
		body: {
			url: res.secure_url,
		},
	};
}
