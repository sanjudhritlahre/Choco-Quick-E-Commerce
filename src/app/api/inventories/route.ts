import { db } from "@/lib/db/db";
import { inventories } from "@/lib/db/schema";
import { inventorySchema } from "@/lib/validators/inventorySchema";

export async function POST(request: Request) {
    const requestData = await request.json();

    let validatedData;

    try {
        validatedData = await inventorySchema.parse(requestData);
    } catch(err) {
        return Response.json({ message: err }, { status: 400 });
    }

    try {
        console.log('validated data', validatedData);
        await db.insert(inventories).values(validatedData);

        return Response.json({ message: 'OK' }, { status: 201 });
    } catch (err) {
        // TODO: Check database status code, and if it is duplicate value code then send the message to the client.
        return Response.json(
            { 
                message: 'Failed to store the inventory into the database',
                error: err instanceof Error ? err.message : String(err),
            },
            { status: 500 },
        );
    }
}