 import type { HttpContext } from '@adonisjs/core/http'
 import db from '@adonisjs/lucid/services/db'

export default class TrabajadoresController {

    async trabajadoresExistentes({ request, response }: HttpContext) {

    const page = request.input('page', 1)
    const limit = request.input('limit', 5)
    const busqueda = request.input('busqueda', '')

    const trabajadores = await db
        .from('trabajadores as t')
        .where((query) => {

            if (busqueda) {

            query
                .whereLike(
                't.nombre_trabajador',
                `%${busqueda}%`
                )
                .orWhereLike(
                't.documento_trabajador',
                `%${busqueda}%`
                )
                .orWhereLike(
                't.telefono_trabajador',
                `%${busqueda}%`
                )
            }
        })
        .select(
            't.id_trabajador',
            't.nombre_trabajador',
            't.documento_trabajador',
            't.telefono_trabajador', 
            't.cargo_trabajador',
            't.estado_trabajador',
            't.valor_pagar_trabajador'
        )
        .orderBy(
        't.id_trabajador',
        'asc'
        )
        .paginate(page,limit)

    return response.ok(
        trabajadores
    )

    }

    async guardarTrabajador({ request, response }: HttpContext) {

    const {
        nombre_trabajador,
        documento_trabajador,
        telefono_trabajador,
        cargo_trabajador
    } = request.only([
        'nombre_trabajador',
        'documento_trabajador',
        'telefono_trabajador',
        'cargo_trabajador'
    ])

    if (!nombre_trabajador?.trim()) {

        return response.badRequest({
        success: false,
        message:
            'Debe ingresar el nombre del trabajador'
        })

    }

    if (!documento_trabajador?.trim()) {

        return response.badRequest({
        success: false,
        message:
            'Debe ingresar el documento'
        })

    }

    const existe = await db
        .from('trabajadores')
        .where(
        'documento_trabajador',
        documento_trabajador
        )
        .first()

    if (existe) {

        return response.badRequest({
        success: false,
        message:
            'Ya existe un trabajador con ese documento'
        })

    }

    await db
        .table('trabajadores')
        .insert({
            nombre_trabajador,
            documento_trabajador,
            telefono_trabajador,
            cargo_trabajador,
            estado_trabajador: 1

        })

    return response.ok({
        success: true,
        message:
        'Trabajador registrado correctamente'
    })

    }

    async actualizarTrabajador({ request, response }: HttpContext) {

    const {
        id_trabajador,
        nombre_trabajador,
        documento_trabajador,
        telefono_trabajador,
        cargo_trabajador,
        estado_trabajador,
        valorPagado
    } = request.only([
        'id_trabajador',
        'nombre_trabajador',
        'documento_trabajador',
        'telefono_trabajador',
        'cargo_trabajador',
        'estado_trabajador',
        'valorPagado'
    ])

    await db
        .from('trabajadores')
        .where(
        'id_trabajador',
        id_trabajador
        )
        .update({
        nombre_trabajador,
        documento_trabajador,
        telefono_trabajador,
        cargo_trabajador,
        estado_trabajador
        })
    
    await db
        .from('trabajadores')
        .where(
        'id_trabajador',
        id_trabajador
        )
        .decrement(
        'valor_pagar_trabajador',
        valorPagado
        )

    return response.ok({
        success: true,
        message:
        'Trabajador actualizado correctamente'

    })

    }

    async trabajadoresCombos({response}: HttpContext){

        const trabajadores = await db
        .from('trabajadores as t')
        .where('t.estado_trabajador','1')
        .select(
            't.id_trabajador',
            't.nombre_trabajador',
            't.documento_trabajador',
            't.telefono_trabajador', 
            't.cargo_trabajador',
            't.estado_trabajador',
            't.valor_pagar_trabajador'
        )
        .orderBy('t.id_trabajador', 'desc')
        //await new Promise((resolve) => setTimeout(resolve, 5000));

        return response.json(trabajadores)
    }
}