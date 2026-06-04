import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../utils/auth";
import path from "node:path";
import fs from "node:fs/promises";

export async function POST(request: Request) {
  // Only logged-in admins can upload images
  if (!(await isLoggedIn())) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  // Get the uploaded file from the request
  const formData = await request.formData();
  const file = formData.get("file");

  // Make sure a file was actually uploaded
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  // Only allow image files
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "File must be an image" }, { status: 400 });
  }

  // Create a unique filename using the current timestamp
  // For example: 1717500000000-photo.jpg
  const timestamp = Date.now();
  const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-"); // remove special characters
  const fileName = `${timestamp}-${originalName}`;

  // Save the file to the web app's public/uploads folder
  // This way the image can be accessed at http://localhost:3001/uploads/filename.jpg
  const uploadsDir = path.resolve(process.cwd(), "../web/public/uploads");

  // Make sure the uploads folder exists
  await fs.mkdir(uploadsDir, { recursive: true });

  // Read the file data and save it
  const fileData = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(uploadsDir, fileName);
  await fs.writeFile(filePath, fileData);

  // Return the URL where the image can be accessed
  // The web app serves files from public/ at the root URL
  const imageUrl = `http://localhost:3001/uploads/${fileName}`;

  return NextResponse.json({ url: imageUrl }, { status: 200 });
}
