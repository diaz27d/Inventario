import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class DasboardsController {

    async dashboard({ response }: HttpContext) {

    const productos =
        await db
        .from('productos')
        .count(
            '* as total'
        )
        .first()

    const categorias =
        await db
        .from('categorias')
        .count(
            '* as total'
        )
        .first()

    const inventario =
        await db
        .from('productos')
        .sum(
            'cantidad_producto as total'
        )
        .first()

    const ventasHoy =
        await db
        .from(
            'valor_total_movimiento'
        )
        .whereRaw(
            "date(fecha_movimiento) = date('now','localtime')"
        )
        .sum(
            'valor_pagado as total'
        )
        .first()

    const ultimasVentas =
        await db
        .from(
            'valor_total_movimiento as v'
        )
        .leftJoin(
            'clientes as c',
            'c.id_cliente',
            'v.id_cliente'
        )
        .select(
            'v.id_valor_total',
            'c.nombre_cliente',
            'v.valor_pagado'
        )
        .orderBy(
            'v.id_valor_total',
            'desc'
        )
        .limit(3)

    const menorStock =
        await db
        .from(
            'productos'
        )
        .select(
            'id_producto',
            'nombre_producto',
            'cantidad_producto'
        )
        .orderBy(
            'cantidad_producto',
            'asc'
        )
        .limit(3)

    return response.ok({

        productos:
        Number(
            productos?.total || 0
        ),

        categorias:
        Number(
            categorias?.total || 0
        ),

        inventario:
        Number(
            inventario?.total || 0
        ),

        ventasHoy:
        Number(
            ventasHoy?.total || 0
        ),

        ultimasVentas,

        menorStock

    })

    }

    async notificacionesStock({ response }: HttpContext) {
    
    const cantidadAlerta = await db
        .from('parametros')
        .select(
        'valor'
        )
        .where(
        'id_parametro', 1
        )

    const productos = await db
        .from('productos')
        .select(
        'id_producto',
        'nombre_producto',
        'cantidad_producto'
        )
        .where(
        'cantidad_producto',
        '<=',
        Number(cantidadAlerta[0].valor)
        )
        .orderBy(
        'cantidad_producto',
        'asc'
        )

    return response.ok({
        total: productos.length,
        productos
    })

    }
}