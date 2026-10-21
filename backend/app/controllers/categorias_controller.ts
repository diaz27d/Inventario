 import type { HttpContext } from '@adonisjs/core/http'
 import db from '@adonisjs/lucid/services/db'

export default class CategoriasController {

    async CategoriasExistentes({request, response}: HttpContext){

        const page = request.input('page', 1)
        const limit = request.input('limit', 5)
        const busqueda = request.input('busqueda', '')

        const categorias = await db
            .from('categorias')
            .where((query) => {

                if (busqueda) {

                query
                    .whereLike(
                    'nombre_categoria',
                    `%${busqueda}%`
                    )
                }
            })
            .select(
            'id_categoria',
            'nombre_categoria'
            )
            .orderBy('id_categoria', 'desc')
            .paginate(page, limit);
        //await new Promise((resolve) => setTimeout(resolve, 5000));

        return response.json(categorias)
    }

    async CategoriasCombos({response}: HttpContext){

        const categorias = await db
            .from('categorias')
            .select(
            'id_categoria',
            'nombre_categoria'
            )
            .orderBy('id_categoria', 'desc')
        //await new Promise((resolve) => setTimeout(resolve, 5000));

        return response.json(categorias)
    }

    async guardarCategoria({ request, response }: HttpContext) {

        const { nombre_categoria } =
            request.only([
            'nombre_categoria'
            ])

        if (
            !nombre_categoria?.trim()
        ) {

            return response.badRequest({
            message:
                'Debe ingresar el nombre de la categoría'
            })

        }

        const existe =
            await db
            .from('categorias')
            .where(
                'nombre_categoria',
                nombre_categoria
            )
            .first()

        if (existe) {

            return response.badRequest({
            message:
                'La categoría ya existe'
            })

        }

        await db
            .table('categorias')
            .insert({
            nombre_categoria
            })

        return response.ok({
            message:
            'Categoría registrada correctamente'
        })
    }

    async actualizarCategoria({ request, response }: HttpContext) {

        const {
            id_categoria,
            nombre_categoria
        } = request.only([
            'id_categoria',
            'nombre_categoria'
        ])

        if (!nombre_categoria?.trim()) {

            return response.badRequest({
                message:
                    'Debe ingresar el nombre de la categoría'
            })
        }

        const existe = await db
            .from('categorias')
            .where(
                'nombre_categoria',
                nombre_categoria
            )
            .whereNot(
                'id_categoria',
                id_categoria
            )
            .first()

        if (existe) {

            return response.badRequest({
                message:
                    'Ya existe una categoría con ese nombre'
            })
        }

        await db
            .from('categorias')
            .where(
                'id_categoria',
                id_categoria
            )
            .update({
                nombre_categoria: nombre_categoria
            })

        return response.ok({
            message:
                'Categoría actualizada correctamente'
        })
    }
}