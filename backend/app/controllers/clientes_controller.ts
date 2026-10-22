 import type { HttpContext } from '@adonisjs/core/http'
 import db from '@adonisjs/lucid/services/db'

export default class ClientesController {

    async clientesExistentes({ request, response }: HttpContext) {

    const page = request.input('page', 1)
    const limit = request.input('limit', 5)
    const busqueda = request.input('busqueda', '')

    const clientes = await db
      .from('clientes')
      .where((query) => {

        if (busqueda) {

          query.where((subQuery) => {

            subQuery
              .whereLike(
                'nombre_cliente',
                `%${busqueda}%`
              )
              .orWhereLike(
                'documento_cliente',
                `%${busqueda}%`
              )
              .orWhereLike(
                'telefono_cliente',
                `%${busqueda}%`
              )

          })

        }

      })
      .select(
        'id_cliente',
        'nombre_cliente',
        'documento_cliente',
        'telefono_cliente',
        'direccion_cliente',
        'correo_cliente',
        'estado_cliente'
      )
      .orderBy(
        'id_cliente',
        'desc'
      )
      .paginate(page, limit)

    return response.ok(clientes)
  }

  async guardarCliente({ request, response }: HttpContext) {

    const datos = request.only([
        'nombre_cliente',
        'documento_cliente',
        'telefono_cliente',
        'correo_cliente',
        'direccion_cliente'
    ])

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

    const existe = await db
            .from('clientes')
            .where('nombre_cliente', datos.nombre_cliente)
            .where('documento_cliente', datos.documento_cliente)
            .where('telefono_cliente', datos.telefono_cliente)
            .first()

        if (existe) {
            return response.badRequest({
                success: false,
                message: 'Ya existe un cliente con ese nombre, identificación y correo'
            })
            }

    const [id] = await db
        .table('clientes')
        .insert({
        nombre_cliente:
            datos.nombre_cliente,

        documento_cliente:
            datos.documento_cliente,

        telefono_cliente:
            datos.telefono_cliente,

        correo_cliente:
            datos.correo_cliente,

        direccion_cliente:
            datos.direccion_cliente,

        estado_cliente: 1,

        fecha_creacion_cliente: fecha
        })

        return response.ok({
            success: true,
            id_cliente: id,
            message:
            'Cliente registrado correctamente'
        })
    }

    async actualizarCliente({ request, response }: HttpContext) {

    const datos = request.only([
        'id_cliente',
        'nombre_cliente',
        'documento_cliente',
        'telefono_cliente',
        'correo_cliente',
        'direccion_cliente',
        'estado_cliente'
    ])

    await db
        .from('clientes')
        .where(
        'id_cliente',
        datos.id_cliente
        )
        .update({
        nombre_cliente:
            datos.nombre_cliente,

        documento_cliente:
            datos.documento_cliente,

        telefono_cliente:
            datos.telefono_cliente,

        correo_cliente:
            datos.correo_cliente,

        direccion_cliente:
            datos.direccion_cliente,

        estado_cliente:
            datos.estado_cliente
        })

        return response.ok({
            success: true,
            message:
            'Cliente actualizado correctamente'
        })
    }

    async clientesCombo({ response }: HttpContext) {

    const clientes = await db
      .from('clientes')
      .select(
        'id_cliente',
        'nombre_cliente',
        'documento_cliente',
        'telefono_cliente',
        'direccion_cliente',
        'correo_cliente',
        'estado_cliente'
      )
      .orderBy(
        'id_cliente',
        'desc'
      )

    return response.ok(clientes)
  }

  async MediosPagoCombo({ response }: HttpContext) {

    const medioPago = await db
      .from('medios_pago')
      .select(
        'id_medio_pago',
        'medio_pago'
      )
      .orderBy(
        'id_medio_pago',
        'desc'
      )

    return response.ok(medioPago)
  }

  async DeudasClientes({ request, response }: HttpContext) {

    const page = request.input('page', 1)
    const limit = request.input('limit', 5)
    const busqueda = request.input('busqueda', '')

    const clientes = await db
        .from('clientes as c')
        .leftJoin(
            'valor_total_movimiento as vtm',
            'vtm.id_cliente',
            'c.id_cliente'
        )
        .select(
            'c.id_cliente',
            'c.nombre_cliente',
            'c.documento_cliente',
            'c.telefono_cliente',
            db.raw(
            'COALESCE(SUM(vtm.cuenta_por_cobrar),0) as deuda'
            )
        )
        .groupBy(
            'c.id_cliente',
            'c.nombre_cliente',
            'c.documento_cliente',
            'c.telefono_cliente'
        )
        .havingRaw(
            'COALESCE(SUM(vtm.cuenta_por_cobrar),0) > 0'
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
                'c.telefono_cliente',
                `%${busqueda}%`
                )
            })
        })
        .orderBy(
            'c.nombre_cliente',
            'asc'
        )
        .paginate(page, limit)

    return response.ok(clientes)
  }

  async ventasPendientesCliente({ request, response }: HttpContext) {

    const { id_cliente } = request.only([
        'id_cliente'
    ])

    const ventas = await db
        .from('valor_total_movimiento as vtm')

        .select(
        'vtm.id_valor_total',
        'vtm.fecha_movimiento',
        'vtm.valor_total',
        'vtm.valor_pagado',
        'vtm.cuenta_por_cobrar'
        )
        .where(
        'vtm.id_cliente',
        id_cliente
        )
        .where(
        'vtm.cuenta_por_cobrar',
        '>',
        0
        )
        .orderBy(
        'vtm.fecha_movimiento',
        'desc'
        )

        return response.ok( ventas)
    }

    async detalleVenta({ request, response }: HttpContext) {

    const {
        id_movimiento
        } = request.only([
        'id_movimiento'
    ])

    const resumen = await db
        .from(
        'valor_total_movimiento'
        )
        .where(
        'id_valor_total',
        id_movimiento
        )
        .first()

    const productos = await db
        .from(
        'movimientos_inventario as dm'
        )
        .innerJoin(
        'productos as p',
        'p.id_producto',
        'dm.id_producto'
        )
        .select(
        'p.nombre_producto',
        'dm.cantidad_movimiento',
        'dm.valor_unitario',
        db.raw(`
            dm.cantidad_movimiento *
            dm.valor_unitario
            as total
        `)
        )
        .where(
        'dm.id_valor_total',
        id_movimiento
        )

        return response.ok({resumen,productos})
    }

    async registrarAbono({ request, response }: HttpContext) {

    const {
        id_movimiento,
        abono
    } = request.only([
        'id_movimiento',
        'abono'
    ])

    const venta = await db
        .from(
        'valor_total_movimiento'
        )
        .where(
        'id_movimiento',
        id_movimiento
        )
        .first()

    if (!venta) {

        return response.badRequest({
        success: false,
        message:
            'Venta no encontrada'
        })
    }

    if (abono <= 0) {

        return response.badRequest({
        success: false,
        message:
            'Ingrese un valor válido'
        })
    }

    if (
        abono >
        venta.cuenta_por_cobrar
    ) {

        return response.badRequest({
        success: false,
        message:
            'El abono no puede superar la deuda'
        })
    }

    await db
        .from(
        'valor_total_movimiento'
        )
        .where(
        'id_movimiento',
        id_movimiento
        )
        .update({

        valor_pagado:
            Number(
            venta.valor_pagado
            ) +
            Number(abono),

        cuenta_por_cobrar:
            Number(
            venta.cuenta_por_cobrar
            ) -
            Number(abono)

        })

        return response.ok({
            success: true,
            message:
            'Abono registrado correctamente'
        })
    }
}