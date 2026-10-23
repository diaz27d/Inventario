import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class InventariosController {

    async registrarInventario({request, response}: HttpContext) {

    const {
        observacion,
        productos, 
        usuario,
        totalMovimiento,
        id_cliente,
        valor_pagado,
        cuenta_por_cobrar
        } = request.only([
        'observacion',
        'productos',
        'usuario',
        'totalMovimiento',
        'id_cliente',
        'valor_pagado',
        'cuenta_por_cobrar'
        ])

    if (!productos || productos.length === 0) {

      return response.badRequest({
        success: false,
        message:
          'Debe agregar al menos un producto'
      })
    }


    const trx = await db.transaction()

    try {

        const fecha = new Date()
            .toLocaleString('sv-SE', {
                timeZone: 'America/Bogota',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })
            .replace(' ', ' ')

        const [id] = await trx
            .table('valor_total_movimiento')
            .insert({
                valor_total: totalMovimiento,
                usuario: usuario,
                fecha_movimiento: fecha,
                id_cliente: id_cliente,
                valor_pagado: valor_pagado,
                cuenta_por_cobrar: cuenta_por_cobrar
        })

      for (const producto of productos) {

        if (
          !producto.id_producto ||
          !producto.cantidad ||
          producto.cantidad <= 0
        ) {

          await trx.rollback()

          return response.badRequest({
            success: false,
            message:
              'Hay productos con cantidades inválidas'
          })
        }

        const productoActual = await trx
            .from('productos')
            .where(
                'id_producto',
                producto.id_producto
            )
            .select(
                'nombre_producto',
                'cantidad_producto'
            )
            .first()

        if (!productoActual) {

        await trx.rollback()

        return response.badRequest({
            success: false,
            message: `No existe el producto ${producto.id_producto}`
        })
        }

        const stockDisponible =
        Number(productoActual.cantidad_producto)

        const cantidadSolicitada =
        Number(producto.cantidad)

        if (stockDisponible - cantidadSolicitada < 0) {

            await trx.rollback()

            return response.badRequest({
                success: false,
                message:
                `El producto "${productoActual.nombre_producto}" no tiene stock suficiente. Stock actual: ${stockDisponible}, solicitado: ${cantidadSolicitada}`
            })
        }

        await trx
          .from('productos')
          .where(
            'id_producto',
            producto.id_producto
          )
          .decrement(
            'cantidad_producto',
            producto.cantidad
          )

        await trx
          .table('movimientos_inventario')
          .insert({
            id_producto:
              producto.id_producto,

            cantidad_movimiento:
              producto.cantidad,

            observacion_movimiento:
              observacion ?? '',

            fecha_movimiento:
              fecha,

            usuario: 
                usuario,

            valor_unitario:
                producto.precio_producto,

            id_valor_total:
                id
          })
      }

      await trx.commit()

      return response.ok({
        success: true,
        message:
          'Inventario registrado correctamente'
      })

    } catch (error) {

      await trx.rollback()

      console.error(error)

      return response.internalServerError({
        success: false,
        message:
          'Error al registrar el inventario'
      })
    }
  }

  async historialMovimientos({ request, response }: HttpContext) {

    const page = request.input('page', 1)
    const limit = request.input('limit', 5)
    const busqueda = request.input('busqueda', '')

    const movimientos = await db
      .from(
        'valor_total_movimiento as vtm'
      )
      .leftJoin(
        'clientes as c',
        'c.id_cliente',
        'vtm.id_cliente'
      )
      .select(
        'vtm.id_valor_total',
        'vtm.fecha_movimiento',
        'vtm.valor_total',
        'vtm.valor_pagado',
        'vtm.cuenta_por_cobrar',
        'vtm.usuario',
        'c.nombre_cliente',
        'c.documento_cliente'
      )
      .if(busqueda, (query) => {

        query.where((subquery) => {

          subquery
            .whereLike(
              'c.nombre_cliente',
              `%${busqueda}%`
            )
            .orWhereLike(
              'c.documento_cliente',
              `%${busqueda}%`
            )
            .orWhereLike(
              'vtm.usuario',
              `%${busqueda}%`
            )
        })
      })
      .orderBy(
        'vtm.fecha_movimiento',
        'desc'
      )
      .paginate(
        page,
        limit
      )

    return response.ok(
      movimientos
    )
  }
}