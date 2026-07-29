import { db } from '@/lib/db/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const product = await db
            .select()
            .from(products)
            .where(eq(products.id, Number(id)))
            .limit(1);

        if (!product.length) {
            return Response.json({ message: 'Product not found.' }, { status: 400 });
        }

        return Response.json(product[0]);
    } catch (err) {
        return Response.json(
            {
                message: 'Failed to fetch a product',
                error: err instanceof Error ? err.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}