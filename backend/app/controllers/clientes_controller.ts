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
}