import { v2 as cloudinary } from 'cloudinary';

// cloudinary config
cloudinary.config({
	cloud_name: 'dshtbs5hm',
	api_key: '276433938214212',
	api_secret: 'qTBUdYf6JKGjC4K0yIOR78M0-rI',
});

/* Here is the explanation for the code above:
1. The POST function is asynchronous, and accepts an event object
2. The event object has a request property, which contains the request data
3. The request data is parsed into a JSON object
4. The JSON object contains an image property, which is the base64 string of the image
5. The image is uploaded to Cloudinary with the following options:
	a. Gravity is set to face, so that the image is cropped around the face
	b. The folder is set to avatar/, which means that the image is uploaded to the avatar folder in your Cloudinary account
	c. The width and height are set to 100, which means that the image is resized to 100x100 pixels
	d. The quality is set to 100, which means that the image is uploaded without any compression
	e. The crop is set to fill, which means that the image is cropped to the exact 100x100 pixels
6. The response is sent back to the client, as a JSON object with the secure URL property */
export async function POST(event) {
	const data = await event.request.json();
	const file = data['image'];
	const origin = event.request.headers.get('Origin');

	const allowedOrigins = ['http://localhost:5173', 'https://solware.vercel.app/', 'http://solware.vercel.app/'];
	console.log(origin);
	if (!allowedOrigins.includes(origin)) {
		return new Response(JSON.stringify({ error: "Origin refused" }), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}


	if (!file) {
		return new Response(JSON.stringify({ error: "No image provided." }));
	}

	try {
		let res = await cloudinary.uploader.upload(file, {
			folder: "avatar/",
			transformation: [
				{ quality: 100, width: 100, height: 100, gravity: "face", crop: "fill" },
				{ overlay: "overlay_gi26k0", width: 90, crop: "scale", gravity: "south_west" }
			],
			html_width: 100,
			html_height: 100
		});
		return new Response(JSON.stringify({ secure_url: res.secure_url }));
	} catch (err) {
		return new Response(JSON.stringify({ error: err }));
	}
}
