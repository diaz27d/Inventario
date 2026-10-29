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
    
    const notificaciones: any[] = []

    const cantidadAlerta = await db
        .from('parametros')
        .select(
        'valor'
        )
        .where(
        'id_parametro', 1
        )

        // STOCK BAJO

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

        productos.forEach((producto) => {

            notificaciones.push({

            tipo: 'stock',

            titulo: 'Stock Bajo',

            mensaje: `${producto.nombre_producto} tiene ${producto.cantidad_producto} unidades disponibles`

            })

        })

         // LICENCIA

        const licencia = await db
            .from('parametros')
            .select('valor')
            .where(
            'id_parametro',
            3
            )
            .first()

        const cantidadNumeroDias = await db
            .from('parametros')
            .select(
            'valor'
            )
            .where(
            'id_parametro', 4
            )

        if (licencia?.valor) {

            const hoy = new Date()

            const fechaLicencia = new Date(licencia.valor)

            const diferenciaDias =
            Math.ceil(
                (
                fechaLicencia.getTime() -
                hoy.getTime()
                ) /
                (1000 * 60 * 60 * 24)
            )

            if ( diferenciaDias <= Number(cantidadNumeroDias[0].valor) && diferenciaDias >= 0) {
                
                if(diferenciaDias > 0){
                    notificaciones.push({
                        tipo: 'licencia',
                        titulo: 'Licencia próxima a vencer',
                        mensaje:
                        `La licencia vence en ${diferenciaDias} día(s) comunicarse con el administrador.`,
                        fecha:
                        licencia.valor

                    })
                }else{
                    notificaciones.push({
                        tipo: 'licencia',
                        titulo: 'Licencia vencida',
                        mensaje:
                        `La licencia vencio el ${licencia?.valor}  comunicarse con el administrador.`,
                        fecha:
                        licencia.valor

                    })
                }
            

            }else{
                notificaciones.push({
                        tipo: 'licencia',
                        titulo: 'Licencia vencida',
                        mensaje:
                        `La licencia vencio el ${licencia?.valor}  comunicarse con el administrador.`,
                        fecha:
                        licencia.valor

                })
            }

        }

    return response.ok({
            total:
            notificaciones.length,

            notificaciones
        })

    }

    async validarLicencia({ response }: HttpContext) {

        const licencia = await db
            .from('parametros')
            .select('valor')
            .where(
            'id_parametro',
            3
            )
            .first()


        const hoy = new Date()

        const fechaLicencia = new Date(licencia.valor)

        const vencida = fechaLicencia <= hoy

        return response.ok({

            disabled: vencida,

            fechaLicencia:
            licencia.valor,

            mensaje: vencida
            ? 'La licencia ha vencido'
            : 'Licencia activa'

        })

    }
}