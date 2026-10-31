import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class FacturasController {

    async facturasProveedorExistentes({ request, response }: HttpContext) {

        const page = request.input('page', 1)
        const limit = request.input('limit', 5)
        const busqueda = request.input('busqueda', '')

        const facturas = await db
            .from('facturas_proveedor as fp')
            .select(
                'fp.id_factura_proveedor',
                'fp.numero_factura',
                'fp.fecha_factura',
                'fp.nombre_proveedor',
                'fp.total_factura',
                'fp.total_abonado',
                'fp.total_pendiente',
                'fp.estado_pago',
                'fp.medio_pago',
                'fp.usuario',
                'fp.fecha_vecimiento'
            )
            .where((query) => {

                if (busqueda) {

                query
                    .whereLike(
                    'numero_factura',
                    `%${busqueda}%`
                    )
                    .orWhereLike(
                    'nombre_proveedor',
                    `%${busqueda}%`
                    )
                }
            })
            .orderBy(
                'id_factura_proveedor',
                'desc'
            )
            .paginate( page, limit )

        return response.ok(
            facturas
        )

    }

    async guardarFacturaProveedor({ request, response }: HttpContext) {

    const {
        numero_factura,
        fecha_factura,
        nombre_proveedor,
        total_factura,
        total_abonado,
        cuenta_por_pagar,
        estado_pago,
        medioPago,
        fecha_vencimiento
    } = request.only([
        'numero_factura',
        'fecha_factura',
        'nombre_proveedor',
        'total_factura',
        'total_abonado',
        'cuenta_por_pagar',
        'estado_pago',
        'medioPago',
        'fecha_vencimiento'
    ])

    if (!numero_factura) {

        return response.badRequest({
        success: false,
        message:
            'Debe ingresar el número de factura'
        })

    }

    if (!nombre_proveedor) {

        return response.badRequest({
        success: false,
        message:
            'Debe ingresar un proveedor'
        })

    }

    if (!fecha_factura) {

        return response.badRequest({
        success: false,
        message:
            'Debe ingresar la fecha de factura'
        })

    }

    const existe = await db
        .from('facturas_proveedor')
        .where(
        'numero_factura',
        numero_factura
        )
        .first()

    if (existe) {

        return response.badRequest({
        success: false,
        message:
            'La factura ya existe'
        })

    }

    const id = await db
        .table('facturas_proveedor')
        .insert({
            numero_factura,
            fecha_factura,
            nombre_proveedor,
            total_factura,
            total_abonado,
            total_pendiente: cuenta_por_pagar,
            estado_pago,
            medio_pago: medioPago,
            fecha_vecimiento: fecha_vencimiento
        })

    return response.ok({
        success: true,
        id_factura_proveedor: id[0],
        message:
            'Factura registrada correctamente'
    })

    }

    async actualizarFacturaProveedor({ request, response }: HttpContext) {

    const {
        id_factura_proveedor,
        total_abonado,
        cuenta_por_pagar,
        id_medio_pago,
        estado_pago
    } = request.only([
        'id_factura_proveedor',
        'total_abonado',
        'cuenta_por_pagar',
        'id_medio_pago',
        'estado_pago'
    ])

    await db
        .from('facturas_proveedor')
        .where(
            'id_factura_proveedor',
            id_factura_proveedor
        )
        .update({
            total_abonado,
            total_pendiente: cuenta_por_pagar,
            medio_pago: id_medio_pago,
            estado_pago
        })

    return response.ok({
        success: true,
        message:
        'Factura actualizada correctamente'
    })

    }
}