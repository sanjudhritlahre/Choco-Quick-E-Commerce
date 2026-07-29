import { db } from "@/lib/db/db";
import { products } from "@/lib/db/schema";
import { productSchema } from "@/lib/validators/productSchema";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export async function POST(request: Request) {
    const data = await request.formData();

    let validateData;

    try {
        validateData = productSchema.parse({
            name: data.get("name"),
            image: data.get("image"),
            description: data.get("description"),
            price: Number(data.get("price")),
        });
    } catch (err) {
        return Response.json({ message: err }, { status: 400 });
    }

    const filename = `${Date.now()}.${validateData.image.name.split(".").slice(-1)}`;

    try {
        const buffer = Buffer.from(await validateData.image.arrayBuffer());
        await writeFile(path.join(process.cwd(), "public/assets", filename), buffer);
    } catch (err) {
        return Response.json({ message: "Failed to save the file to fs.", error: err }, { status: 500 });
    }

    try {
        await db.insert(products).values({ ...validateData, image: filename });
    } catch (err) {
        // TODO: Remove stored image from fs
        return Response.json({ message: "Failed to store product into the Database.", error: err }, { status: 500 });
    }

    return Response.json({ message: "Ok" }, { status: 201 });
}