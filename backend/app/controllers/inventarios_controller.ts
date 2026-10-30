import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import ExcelJS from 'exceljs'

export default class InventariosController {

    async registrarInventario({request, response}: HttpContext) {

    const {
        observacion,
        productos, 
        usuario,
        totalMovimiento,
        id_cliente,
        valor_pagado,
        cuenta_por_cobrar,
        id_trabajador,
        porcentaje_trabajador,
        valorComision,
        medioPago
        } = request.only([
        'observacion',
        'productos',
        'usuario',
        'totalMovimiento',
        'id_cliente',
        'valor_pagado',
        'cuenta_por_cobrar',
        'id_trabajador',
        'porcentaje_trabajador',
        'valorComision',
        'medioPago'
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
                cuenta_por_cobrar: cuenta_por_cobrar,
                id_trabajador: id_trabajador,
                porcentaje_trabajador: porcentaje_trabajador,
                id_medio_pago: medioPago
        })

        await trx
          .from('trabajadores')
          .where(
          'id_trabajador',
          id_trabajador
          )
          .increment(
          'valor_pagar_trabajador',
          valorComision
          )

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

  async consolidadoReportes({ request, response }: HttpContext) {

    const {
      fecha_inicio,
      fecha_fin
    } = request.only([
      'fecha_inicio',
      'fecha_fin'
    ])

    const numeroVentas = await db
      .from('valor_total_movimiento')
      .whereBetween(
        'fecha_movimiento',
        [
          fecha_inicio,
          fecha_fin
        ]
      )
      .count('* as total')
      .first()

    const totalIngresado = await db
      .from('valor_total_movimiento')
      .whereBetween(
        'fecha_movimiento',
        [
          fecha_inicio,
          fecha_fin
        ]
      )
      .sum(
        'valor_pagado as total'
      )
      .first()

    const totalPendiente = await db
      .from('valor_total_movimiento')
      .whereBetween(
        'fecha_movimiento',
        [
          fecha_inicio,
          fecha_fin
        ]
      )
      .sum(
        'cuenta_por_cobrar as total'
      )
      .first()

    return response.ok({

      numeroVentas:
        Number(
          numeroVentas?.total || 0
        ),

      totalIngresado:
        Number(
          totalIngresado?.total || 0
        ),

      totalPendiente:
        Number(
          totalPendiente?.total || 0
        )

    })

  }

  async exportarExcel({ request, response }: HttpContext) {

    const {
      fecha_inicio,
      fecha_fin
    } = request.only([
      'fecha_inicio',
      'fecha_fin'
    ])

    const ventas = await db
      .from('valor_total_movimiento as vtm')
      .innerJoin(
        'clientes as c',
        'c.id_cliente',
        'vtm.id_cliente'
      )
      .innerJoin(
        'trabajadores as t',
        't.id_trabajador',
        'vtm.id_trabajador'
      )
      .innerJoin(
        'medios_pago as me',
        'me.id_medio_pago',
        'vtm.id_medio_pago'
      )
      .select(
        'vtm.id_valor_total',
        'vtm.fecha_movimiento',
        'c.nombre_cliente',
        't.nombre_trabajador',
        'vtm.valor_total',
        'vtm.valor_pagado',
        'vtm.cuenta_por_cobrar',
        'me.medio_pago'
      )
      .whereBetween(
        'vtm.fecha_movimiento',
        [
          fecha_inicio,
          fecha_fin
        ]
      )
      .orderBy(
        'vtm.id_valor_total',
        'desc'
      )

    const detalle = await db
      .from('movimientos_inventario as dm')
      .innerJoin(
        'valor_total_movimiento as vtm',
        'vtm.id_valor_total',
        'dm.id_valor_total'
      )
      .innerJoin(
        'clientes as c',
        'c.id_cliente',
        'vtm.id_cliente'
      )
      .innerJoin(
        'trabajadores as t',
        't.id_trabajador',
        'vtm.id_trabajador'
      )
      .innerJoin(
        'productos as p',
        'p.id_producto',
        'dm.id_producto'
      )
      .select(
        'dm.id_valor_total',
        'c.nombre_cliente',
        't.nombre_trabajador',
        'p.nombre_producto',
        'dm.cantidad_movimiento',
        'dm.valor_unitario'
      )
      .whereBetween(
        'vtm.fecha_movimiento',
        [
          fecha_inicio,
          fecha_fin
        ]
      )

    const workbook =
      new ExcelJS.Workbook()

    /*
      HOJA VENTAS
    */

    const hojaVentas =
      workbook.addWorksheet(
        'Ventas'
      )

    hojaVentas.columns = [

      {
        header: 'Venta',
        key: 'id_valor_total',
        width: 15
      },

      {
        header: 'Fecha',
        key: 'fecha_movimiento',
        width: 20
      },

      {
        header: 'Cliente',
        key: 'nombre_cliente',
        width: 35
      },

      {
        header: 'Medio pago',
        key: 'medio_pago',
        width: 20
      },

      {
        header: 'Trabajador',
        key: 'nombre_trabajador',
        width: 35
      },

      {
        header: 'Total Venta',
        key: 'valor_total',
        width: 20
      },

      {
        header: 'Valor Pagado',
        key: 'valor_pagado',
        width: 20
      },

      {
        header: 'Cuenta por Cobrar',
        key: 'cuenta_por_cobrar',
        width: 25
      }

    ]

    ventas.forEach(
      venta => {

        hojaVentas.addRow(
          venta
        )

      }
    )

    /*
      HOJA DETALLE
    */

    const hojaDetalle =
      workbook.addWorksheet(
        'Productos'
      )

    hojaDetalle.columns = [

      {
        header: 'Venta',
        key: 'id_valor_total',
        width: 15
      },

      {
        header: 'Cliente',
        key: 'nombre_cliente',
        width: 35
      },

      {
        header: 'Trabajador',
        key: 'nombre_trabajador',
        width: 35
      },

      {
        header: 'Producto',
        key: 'nombre_producto',
        width: 40
      },

      {
        header: 'Cantidad',
        key: 'cantidad_movimiento',
        width: 15
      },

      {
        header: 'Valor Unitario',
        key: 'valor_unitario',
        width: 20
      },

      {
        header: 'Total',
        key: 'total',
        width: 20
      }

    ]

    detalle.forEach(
      item => {

        hojaDetalle.addRow({

          ...item,

          total:
            Number(
              item.cantidad_movimiento
            ) *
            Number(
              item.valor_unitario
            )

        })

      }
    )

    try {

        const buffer =
          await workbook.xlsx.writeBuffer()

        response.header(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )

        response.header(
          'Content-Disposition',
          `attachment; filename=Reporte_${fecha_inicio}_${fecha_fin}.xlsx`
        )

        response.header(
          'Access-Control-Expose-Headers',
          'Content-Disposition'
        )

        return response.send(buffer)

      } catch (error) {

        console.error(error)

        return response.internalServerError({
          success: false,
          message: String(error)
        })

      }
    
  }
}