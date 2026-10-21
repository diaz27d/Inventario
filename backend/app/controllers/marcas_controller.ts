 import type { HttpContext } from '@adonisjs/core/http'
 import db from '@adonisjs/lucid/services/db'

export default class MarcasController {

    async MarcasExistentes({request, response}: HttpContext){

        const page = request.input('page', 1)
        const limit = request.input('limit', 5)
        const busqueda = request.input('busqueda', '')

        const marcas = await db
            .from('marca')
            .where((query) => {

                if (busqueda) {

                    query.whereLike(
                        'nombre_marca',
                        `%${busqueda}%`
                    )

                }

            })
            .select(
            'id_marca',
            'nombre_marca'
            )
            .orderBy('id_marca', 'desc')
            .paginate(page, limit);
        //await new Promise((resolve) => setTimeout(resolve, 5000));

        return response.json(marcas)
    }

    async MarcasCombos({response}: HttpContext){

        const marcas = await db
            .from('marca')
            .select(
            'id_marca',
            'nombre_marca'
            )
            .orderBy('id_marca', 'desc')
        //await new Promise((resolve) => setTimeout(resolve, 5000));

        return response.json(marcas)
    }

    async guardarMarca({ request, response }: HttpContext) {

        const { nombre_marca } =
            request.only([
                'nombre_marca'
            ]);

        if (!nombre_marca?.trim()) {

            return response.badRequest({
                message:
                'Debe ingresar el nombre de la marca'
            });
        }

        const existe = await db
            .from('marca')
            .where('nombre_marca', nombre_marca)
            .first()

        if (existe) {
            return response.badRequest({
                success: false,
                message: 'Ya existe un marca con ese nombre.'
            })
        }

        await db
        .table('marca')
        .insert({
            nombre_marca
        });

        return response.ok({
            message:
            'Marca registrada correctamente'
        });
    }

    async actualizarMarca({ request, response }: HttpContext) {

        const {
            id_marca,
            nombre_marca
        } = request.only([
            'id_marca',
            'nombre_marca'
        ])

        if (!nombre_marca?.trim()) {

            return response.badRequest({
                message:
                    'Debe ingresar el nombre de la marca'
            })
        }

        await db
            .from('marca')
            .where(
                'id_marca',
                id_marca
            )
            .update({
                nombre_marca: nombre_marca
            })

        return response.ok({
            message:
                'Marca actualizada correctamente'
        })
    }
}